#!/usr/bin/env node
/**
 * 从 npm 包本身取简介与图标（不再依赖任何第三方索引）。
 *
 *   node scripts/import-from-npm.mjs
 *
 * 对每个插件：
 *   1. 读 registry 元数据，取最新版本的 description / icon / homepage / repository
 *   2. 下载该版本的 tarball，把包里的图标文件解出来存到 icons/
 *   3. 结果写进 scripts/npm-meta.json，供人工写简介时参考
 *
 * 只做「下载 + 解包里的一个图标文件」，不安装、不执行包里的任何代码。
 */
import { execFileSync } from 'node:child_process'
import { mkdtemp, mkdir, readFile, rm, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join, resolve } from 'node:path'

const REGISTRY = 'https://registry.npmjs.org/'
const ICON_EXT = new Set(['.svg', '.png', '.jpg', '.jpeg', '.webp'])
const MAX_ICON_BYTES = 256 * 1024

const root = resolve(import.meta.dirname, '..')
const iconsDir = join(root, 'icons')

const safeName = (name) => name.replace(/^@/u, '').replace(/[/\\]/gu, '__')

async function fetchJson(url) {
  const response = await fetch(url, {
    headers: { accept: 'application/json', 'user-agent': 'dsh-market-npm-import/1.0' },
    signal: AbortSignal.timeout(30_000)
  })
  if (!response.ok) throw new Error(`HTTP ${String(response.status)} ${url}`)
  return await response.json()
}

/** 从 manifest 里找图标路径：icon 字段，或 exports 里的 "./icon"。 */
function iconPathOf(manifest) {
  const direct = manifest.icon ?? manifest.logo
  if (typeof direct === 'string' && direct !== '') return direct.replace(/^\.\//u, '')
  const exported = manifest.exports?.['./icon']
  if (typeof exported === 'string') return exported.replace(/^\.\//u, '')
  if (exported !== null && typeof exported === 'object') {
    const target = exported.default ?? exported.import ?? exported.node
    if (typeof target === 'string') return target.replace(/^\.\//u, '')
  }
  return undefined
}

async function extractIcon(name, manifest, tarballUrl) {
  const iconPath = iconPathOf(manifest)
  if (iconPath === undefined) return { status: 'no-icon-field' }
  const extension = iconPath.slice(iconPath.lastIndexOf('.')).toLowerCase()
  if (!ICON_EXT.has(extension)) return { status: 'unsupported-ext' }

  const response = await fetch(tarballUrl, { signal: AbortSignal.timeout(60_000) })
  if (!response.ok) return { status: 'tarball-http', detail: String(response.status) }
  const bytes = new Uint8Array(await response.arrayBuffer())
  if (bytes.byteLength > 64 * 1024 * 1024) return { status: 'tarball-too-big' }

  const work = await mkdtemp(join(tmpdir(), 'dsh-icon-'))
  const tgz = join(work, 'package.tgz')
  try {
    await writeFile(tgz, bytes)
    execFileSync('tar', ['-xzf', tgz, '-C', work, `package/${iconPath}`], { stdio: 'ignore' })
    const extracted = new Uint8Array(await readFile(join(work, 'package', iconPath)))
    if (extracted.byteLength === 0 || extracted.byteLength > MAX_ICON_BYTES) {
      return { status: 'icon-size', detail: String(extracted.byteLength) }
    }
    const target = join(iconsDir, `${safeName(name)}${extension === '.jpeg' ? '.jpg' : extension}`)
    await writeFile(target, extracted)
    // 记录成相对仓库根的 posix 路径，prune 脚本按这个名单保留
    return { status: 'ok', file: `icons/${safeName(name)}${extension === '.jpeg' ? '.jpg' : extension}`, bytes: extracted.byteLength }
  } catch (error) {
    return { status: 'extract-failed', detail: error instanceof Error ? error.message : String(error) }
  } finally {
    await rm(work, { recursive: true, force: true })
  }
}

async function main() {
  await mkdir(iconsDir, { recursive: true })
  const names = (await readFile(join(root, 'plugins.txt'), 'utf8'))
    .split(/\r?\n/u)
    .map((line) => line.trim())
    .filter((line) => line !== '' && !line.startsWith('#'))

  const report = {}
  let icons = 0
  for (const name of names) {
    try {
      const doc = await fetchJson(`${REGISTRY}${name.replace('/', '%2F')}`)
      const latest = doc['dist-tags']?.latest
      const manifest = doc.versions?.[latest]
      if (manifest === undefined) throw new Error('没有 latest 版本')
      const icon = await extractIcon(name, manifest, manifest.dist?.tarball)
      if (icon.status === 'ok') icons += 1
      report[name] = {
        version: latest,
        description: typeof manifest.description === 'string' ? manifest.description : '',
        icon: icon.status,
        ...(icon.file === undefined ? {} : { iconFile: icon.file }),
        ...(icon.status === 'ok' ? {} : { iconDetail: icon.detail ?? icon.status })
      }
      process.stdout.write(`+ ${name}：${icon.status === 'ok' ? '图标已取' : `图标跳过（${icon.status}）`}\n`)
    } catch (error) {
      report[name] = { error: error instanceof Error ? error.message : String(error) }
      process.stderr.write(`- ${name}：${report[name].error}\n`)
    }
  }

  await writeFile(join(root, 'scripts', 'npm-meta.json'), `${JSON.stringify(report, null, 2)}\n`, 'utf8')
  process.stdout.write(`\n共 ${String(names.length)} 个包，取到 ${String(icons)} 个图标；明细见 scripts/npm-meta.json\n`)
}

main().catch((error) => {
  process.stderr.write(`\n${error instanceof Error ? error.message : String(error)}\n`)
  process.exitCode = 1
})
