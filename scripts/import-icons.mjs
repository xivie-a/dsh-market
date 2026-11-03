#!/usr/bin/env node
/**
 * 从一份参考索引里把图标搬到本地 icons/ 目录。
 *
 *   node scripts/import-icons.mjs --from https://dshopen.org/index.json --input plugins.txt
 *
 * 为什么需要它：DSH 的索引格式要求图标要么内联 base64、要么是一个 URL。
 * npm 包里的图标通常在 tarball 里，抓下来要解包；而社区索引（比如 dshopen）已经
 * 替我们提取好了，直接借用同一份图标文件最省事。
 *
 * 只会下载图标本身（SVG/PNG/JPEG/WebP，<=256 KiB），不碰任何代码。
 * 图标版权归各插件作者所有，这里只用于在索引里标识对应插件。
 */
import { mkdir, readFile, stat, writeFile } from 'node:fs/promises'
import { join, resolve } from 'node:path'

const MAX_ICON_BYTES = 256 * 1024
const ALLOWED = new Map([
  ['.svg', 'svg'],
  ['.png', 'png'],
  ['.jpg', 'jpg'],
  ['.jpeg', 'jpg'],
  ['.webp', 'webp'],
])

function parseArgs(argv) {
  const options = { output: 'icons', timeoutMs: 30_000 }
  for (let i = 0; i < argv.length; i += 1) {
    const flag = argv[i]
    const value = argv[i + 1]
    if (flag === '--from') options.from = value
    else if (flag === '--input') options.input = value
    else if (flag === '--output') options.output = value
    else if (flag === '-h' || flag === '--help') options.help = true
    else continue
    i += 1
  }
  if (options.help) return options
  if (options.from === undefined || options.input === undefined) throw new Error('缺少 --from 或 --input')
  return options
}

const safeName = (name) => name.replace(/^@/u, '').replace(/[/\\]/gu, '__')

function extensionOf(url) {
  const path = new URL(url).pathname.toLowerCase()
  for (const extension of ALLOWED.keys()) {
    if (path.endsWith(extension)) return extension
  }
  return undefined
}

async function main() {
  const options = parseArgs(process.argv.slice(2))
  if (options.help) {
    process.stdout.write('用法: node scripts/import-icons.mjs --from <参考索引 URL> --input <plugins.txt> [--output icons]\n')
    return
  }
  await mkdir(resolve(options.output), { recursive: true })

  const indexResponse = await fetch(options.from, {
    headers: { accept: 'application/json', 'user-agent': 'dsh-market-icons/1.0' },
  })
  if (!indexResponse.ok) throw new Error(`参考索引读取失败: HTTP ${String(indexResponse.status)}`)
  const reference = await indexResponse.json()

  const wanted = new Set(
    (await readFile(resolve(options.input), 'utf8'))
      .split(/\r?\n/u)
      .map((line) => line.trim())
      .filter((line) => line !== '' && !line.startsWith('#')),
  )

  let saved = 0
  let missing = 0
  for (const plugin of reference.plugins ?? []) {
    if (!wanted.has(plugin.name)) continue
    if (typeof plugin.icon !== 'string') {
      process.stderr.write(`- ${plugin.name}: 参考索引里没有图标\n`)
      missing += 1
      continue
    }
    const url = new URL(plugin.icon, options.from)
    if (url.protocol !== 'https:') {
      process.stderr.write(`- ${plugin.name}: 图标不是 https，跳过\n`)
      missing += 1
      continue
    }
    const extension = extensionOf(url.href)
    if (extension === undefined) {
      process.stderr.write(`- ${plugin.name}: 图标格式不支持（${url.pathname}）\n`)
      missing += 1
      continue
    }
    const target = join(resolve(options.output), `${safeName(plugin.name)}.${ALLOWED.get(extension)}`)
    try {
      await stat(target)
      process.stdout.write(`= ${plugin.name}: 已存在，跳过\n`)
      continue
    } catch {
      // 不存在，继续下载
    }
    const response = await fetch(url, {
      signal: AbortSignal.timeout(options.timeoutMs),
      headers: { 'user-agent': 'dsh-market-icons/1.0' },
    })
    if (!response.ok) {
      process.stderr.write(`- ${plugin.name}: 下载失败 HTTP ${String(response.status)}\n`)
      missing += 1
      continue
    }
    const bytes = new Uint8Array(await response.arrayBuffer())
    if (bytes.byteLength === 0 || bytes.byteLength > MAX_ICON_BYTES) {
      process.stderr.write(`- ${plugin.name}: 图标大小不合适（${String(bytes.byteLength)} 字节）\n`)
      missing += 1
      continue
    }
    await writeFile(target, bytes)
    process.stdout.write(`+ ${plugin.name} -> ${target}\n`)
    saved += 1
  }
  process.stdout.write(`\n完成：新增 ${String(saved)} 个，缺失/跳过 ${String(missing)} 个\n`)
}

main().catch((error) => {
  process.stderr.write(`\n${error instanceof Error ? error.message : String(error)}\n`)
  process.exitCode = 1
})
