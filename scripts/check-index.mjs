#!/usr/bin/env node
/**
 * 发布前校验一个索引文件是否符合 DSH 插件市场索引 format 1。
 *
 *   node scripts/check-index.mjs site/index.json https://example.com/market/index.json
 *
 * 第二个参数是这份索引发布后的地址；相对图标会按它解析。省略时用占位域名，
 * 这样只要图标是相对路径就能通过（绝对图标必须是 https）。
 * 退出码：0 通过，1 不合规，2 用法错误。
 */
import { readFile } from 'node:fs/promises'
import { FormatError, validateIndex } from './format-1.mjs'

const USAGE = '用法: node scripts/check-index.mjs <index.json> [发布后的绝对 URL]\n'

const [file, indexUrl = 'https://market.invalid/index.json'] = process.argv.slice(2)
if (file === undefined) {
  process.stderr.write(USAGE)
  process.exit(2)
}

let parsed
try {
  parsed = JSON.parse(await readFile(file, 'utf8'))
} catch (error) {
  process.stderr.write(`读取失败: ${error instanceof Error ? error.message : String(error)}\n`)
  process.exit(1)
}

if (!URL.canParse(indexUrl)) {
  process.stderr.write(`索引 URL 不是绝对地址: ${indexUrl}\n`)
  process.exit(2)
}

let index
try {
  index = validateIndex(parsed, indexUrl)
} catch (error) {
  if (error instanceof FormatError) {
    process.stderr.write(`不合规: ${error.message}\n`)
    process.stderr.write(`位置: ${error.path}\n规则: ${error.reason}\n`)
    process.exit(1)
  }
  throw error
}

const versions = index.plugins.reduce((total, plugin) => total + plugin.versions.length, 0)
const missingTitle = index.plugins.filter((plugin) => plugin.title === undefined).length
const missingIcon = index.plugins.filter((plugin) => plugin.icon === undefined).length
const languages = new Set(['en'])
for (const plugin of index.plugins) {
  for (const text of [plugin.title, plugin.description]) {
    if (text !== undefined && typeof text === 'object') for (const language of Object.keys(text)) languages.add(language)
  }
}

process.stdout.write(`通过：${String(index.plugins.length)} 个插件，${String(versions)} 个版本\n`)
process.stdout.write(`标题语言：${[...languages].join(', ')}\n`)
if (missingTitle > 0) process.stdout.write(`提示：${String(missingTitle)} 个插件没有 title，卡片会显示包名\n`)
if (missingIcon > 0) process.stdout.write(`提示：${String(missingIcon)} 个插件没有图标\n`)
if (index.metadata.categories && Object.keys(index.metadata.categories).length > 0) {
  process.stdout.write(`分类：${Object.keys(index.metadata.categories).join(', ')}\n`)
}
