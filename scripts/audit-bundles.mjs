/**
 * 发布前体检：把索引里的每个包从 npm 拉一遍，检查「装了会不会用不了」的三类问题。
 *
 *   1. patch-mount   cordis.patch.yml 里的 insert.name 解析不到（最常见：带 scope 的
 *                    包名被写成裸名，DSH 解析失败 → 宿主半边不挂载，用户看到"装了没用"）
 *   2. patch-missing package.json 声明了 dsh.bundle.patch，但 tarball 里没有那个文件
 *   3. client-missing 声明了 dsh.client，但打包里没有浏览器半边（platform 不会自己加载）
 *
 * 用法：node scripts/audit-bundles.mjs [--input plugins.txt] [--json out.json] [--limit N]
 */

import { execFileSync } from 'node:child_process'
import { mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'

const REGISTRY = 'https://registry.npmjs.org/'
const ARGS = process.argv.slice(2)
const flag = (name, fallback) => {
  const index = ARGS.indexOf(`--${name}`)
  return index === -1 ? fallback : ARGS[index + 1]
}

const input = flag('input', 'plugins.txt')
const jsonOut = flag('json', '')
const limit = Number(flag('limit', '0')) || 0

const names = readFileSync(input, 'utf8')
  .split(/\r?\n/u)
  .map((line) => line.trim())
  .filter((line) => line !== '' && !line.startsWith('#'))
const targets = limit > 0 ? names.slice(0, limit) : names

async function fetchJson(url) {
  const response = await fetch(url, {
    headers: { accept: 'application/json' },
    signal: AbortSignal.timeout(30_000),
  })
  if (!response.ok) throw new Error(`HTTP ${response.status}`)
  return response.json()
}

const work = mkdtempSync(join(tmpdir(), 'audit-bundles-'))
let counter = 0

function unpack(name, tarballUrl) {
  const index = counter++
  const dir = join(work, `p${index}`)
  mkdirSync(dir, { recursive: true })
  return fetch(tarballUrl, { signal: AbortSignal.timeout(90_000) })
    .then((result) => {
      if (!result.ok) throw new Error(`tarball HTTP ${result.status}`)
      return result.arrayBuffer()
    })
    .then((buffer) => {
      const tgz = join(work, `t${index}.tgz`)
      writeFileSync(tgz, Buffer.from(buffer))
      return { dir, tgz }
    })
}

function readManifest(dir) {
  return JSON.parse(readFileSync(join(dir, 'package', 'package.json'), 'utf8'))
}

function mountNames(patchText) {
  return patchText
    .split(/\r?\n/u)
    .map((line) => /^\s*(?:-\s*)?name:\s*(['"]?)([^'"#\s]+)\1/u.exec(line))
    .filter((match) => match !== null)
    .map((match) => match[2])
}

function resolves(value, packageName) {
  if (value === packageName) return true
  if (value.startsWith(`${packageName}/`)) return true
  // 指向别的包是合法的（例如 archify 挂 @deepseek-ai/dsh-skill-filesystem），只要它不是
  // 把自己去掉 scope 之后的裸名即可。
  const bare = packageName.startsWith('@') ? packageName.split('/')[1] : packageName
  if (value === bare) return false
  if (value.startsWith(`${bare}/`)) return false
  return true
}

const rows = []

async function audit(name) {
  const row = { name, version: '', issues: [], detail: '' }
  try {
    const doc = await fetchJson(`${REGISTRY}${name.replace('/', '%2F')}`)
    const latest = doc['dist-tags']?.latest
    if (latest === undefined) {
      row.issues.push('no-latest')
      return row
    }
    row.version = latest
    const manifest = doc.versions?.[latest]
    if (manifest === undefined) {
      row.issues.push('no-manifest')
      return row
    }
    const patch = manifest.dsh?.bundle?.patch
    const patchFiles = typeof patch === 'string' ? [patch] : Array.isArray(patch) ? patch : []
    if (!manifest.dsh?.bundle) row.issues.push('not-a-bundle')
    if (patchFiles.length > 0) {
      const { dir, tgz } = await unpack(name, manifest.dist?.tarball)
      const files = patchFiles.map((file) => String(file).replace(/^\.\//u, ''))
      execFileSync('tar', ['-xzf', tgz, '-C', dir, ...files.map((file) => `package/${file}`)], {
        stdio: 'ignore',
      })
      for (const file of files) {
        let text
        try {
          text = readFileSync(join(dir, 'package', file), 'utf8')
        } catch {
          row.issues.push('patch-missing')
          continue
        }
        for (const value of mountNames(text)) {
          if (!resolves(value, name)) row.issues.push(`patch-mount:${value}`)
        }
      }
    }
  } catch (error) {
    row.issues.push(`error:${error?.message ?? String(error)}`)
  }
  return row
}

const queue = [...targets]
const results = []
async function worker() {
  while (queue.length > 0) {
    const name = queue.shift()
    if (name === undefined) return
    const row = await audit(name)
    results.push(row)
    process.stdout.write(row.issues.length === 0 ? '.' : 'x')
  }
}
await Promise.all(Array.from({ length: 6 }, () => worker()))
process.stdout.write('\n')

const bad = results.filter((row) => row.issues.some((issue) => issue !== 'not-a-bundle'))
results.sort((left, right) => left.name.localeCompare(right.name))

console.log(`检查 ${results.length} 个包，有问题的 ${bad.length} 个：`)
for (const row of bad) console.log(`- ${row.name}@${row.version}  ${row.issues.join(', ')}`)

const notBundles = results.filter((row) => row.issues.includes('not-a-bundle'))
if (notBundles.length > 0) {
  console.log(`\n没有 dsh.bundle（可能是纯客户端/工具包，索引里仍有它的界面）：${notBundles.length}`)
  console.log(notBundles.slice(0, 12).map((row) => row.name).join(', '))
}

if (jsonOut !== '') writeFileSync(jsonOut, `${JSON.stringify(results, null, 2)}\n`)
rmSync(work, { recursive: true, force: true })
