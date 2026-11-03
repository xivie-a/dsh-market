#!/usr/bin/env node
/**
 * 从一份参考索引批量收录插件（批量导入用，不代替人工审核）。
 *
 *   node scripts/bulk-import.mjs --from https://dshopen.org/index.json --limit 48
 *
 * 做三件事：
 *   1. 把选中的包名追加进 plugins.txt
 *   2. 在 overrides.json 里补标题、简介、分类（已有条目不覆盖）
 *   3. 不下载图标——之后跑 scripts/import-icons.mjs 即可
 *
 * 选中的顺序：按参考索引里的 downloads 排序键降序，跳过已经在列表里的。
 */
import { readFile, writeFile } from 'node:fs/promises'
import { resolve } from 'node:path'

const CATEGORY_IDS = new Set([
  'appearance', 'interface', 'tools', 'memory', 'providers', 'workflow',
  'integrations', 'usage', 'development', 'knowledge', 'skills',
])

function parseArgs(argv) {
  const options = { input: 'plugins.txt', overrides: 'overrides.json', limit: 40, minDownloads: 0, section: '批量收录' }
  for (let i = 0; i < argv.length; i += 1) {
    const flag = argv[i]
    const value = argv[i + 1]
    if (flag === '--from') { options.from = value; i += 1 }
    else if (flag === '--input') { options.input = value; i += 1 }
    else if (flag === '--overrides') { options.overrides = value; i += 1 }
    else if (flag === '--limit') { options.limit = Number(value); i += 1 }
    else if (flag === '--min-downloads') { options.minDownloads = Number(value); i += 1 }
    else if (flag === '--section') { options.section = value; i += 1 }
    else if (flag === '-h' || flag === '--help') { options.help = true }
  }
  if (options.help) return options
  if (options.from === undefined) throw new Error('缺少 --from（参考索引 URL）')
  return options
}

const pickText = (text) => {
  if (typeof text === 'string') return text
  if (text && typeof text === 'object') return text.zh ?? text.en ?? Object.values(text)[0] ?? ''
  return ''
}

// 参考索引把下载量做成标签（downloads-1k 之类），没有 downloads 排序键，这里反推出一个档位
const DOWNLOAD_LABELS = new Map([
  ['downloads-100k', 100000], ['downloads-50k', 50000], ['downloads-10k', 10000],
  ['downloads-5k', 5000], ['downloads-1k', 1000], ['downloads-500', 500], ['downloads-100', 100],
])

function downloadsOf(plugin) {
  const declared = plugin.metadata?.sortKeys?.downloads
  if (typeof declared === 'number' && declared > 0) return declared
  let best = 0
  for (const label of plugin.metadata?.labels ?? []) {
    best = Math.max(best, DOWNLOAD_LABELS.get(label) ?? 0)
  }
  return best
}

function starsOf(plugin) {
  const value = plugin.metadata?.sortKeys?.['github-stars']
  return typeof value === 'number' ? value : 0
}

/** 参考索引的简介前面常带「★ 10,018 │ 」，去掉它，并压成一句短描述。 */
function cleanDescription(text) {
  const flat = pickText(text)
    .replace(/^★[^│]*│\s*/u, '')
    .replace(/\s+/gu, ' ')
    .trim()
  if (flat.length <= 120) return flat
  const cut = flat.slice(0, 118)
  const boundary = Math.max(cut.lastIndexOf('，'), cut.lastIndexOf('。'), cut.lastIndexOf(' '), cut.lastIndexOf('、'))
  return `${(boundary > 60 ? cut.slice(0, boundary) : cut).trim()}…`
}

async function main() {
  const options = parseArgs(process.argv.slice(2))
  if (options.help) {
    process.stdout.write('用法: node scripts/bulk-import.mjs --from <参考索引 URL> [--limit 40] [--min-downloads 0]\n')
    return
  }

  const reference = await (await fetch(options.from, {
    headers: { accept: 'application/json', 'user-agent': 'dsh-market-bulk/1.0' },
  })).json()
  if (!Array.isArray(reference?.plugins)) throw new Error('参考索引没有 plugins 数组')

  const inputPath = resolve(options.input)
  const original = await readFile(inputPath, 'utf8')
  const listed = new Set(
    original.split(/\r?\n/u).map((line) => line.trim()).filter((line) => line !== '' && !line.startsWith('#')),
  )

  const overridesPath = resolve(options.overrides)
  const overrides = JSON.parse(await readFile(overridesPath, 'utf8'))
  overrides.plugins ??= {}

  const candidates = reference.plugins
    .filter((plugin) => typeof plugin?.name === 'string' && !listed.has(plugin.name))
    .filter((plugin) => downloadsOf(plugin) >= options.minDownloads)
    .sort((left, right) => downloadsOf(right) - downloadsOf(left) || starsOf(right) - starsOf(left))
    .slice(0, options.limit)

  if (candidates.length === 0) {
    process.stdout.write('没有可新增的插件\n')
    return
  }

  const added = []
  for (const plugin of candidates) {
    const category = plugin.metadata?.category
    const entry = {
      ...(plugin.title === undefined ? {} : { title: plugin.title }),
      ...(plugin.description === undefined ? {} : { description: cleanDescription(plugin.description) }),
      ...(category !== undefined && CATEGORY_IDS.has(category) ? { category } : {}),
    }
    overrides.plugins[plugin.name] = { ...entry, ...(overrides.plugins[plugin.name] ?? {}) }
    added.push(plugin.name)
  }

  const block = [`\n# ${options.section}（批量导入，记得逐个人工复核）`, ...added].join('\n')
  await writeFile(inputPath, `${original.trimEnd()}\n${block}\n`, 'utf8')
  await writeFile(overridesPath, `${JSON.stringify(overrides, null, 2)}\n`, 'utf8')

  process.stdout.write(`新增 ${String(added.length)} 个插件：\n${added.map((name) => `  + ${name}`).join('\n')}\n`)
  process.stdout.write('\n下一步：node scripts/import-icons.mjs --from <参考索引 URL> --input plugins.txt\n')
}

main().catch((error) => {
  process.stderr.write(`\n${error instanceof Error ? error.message : String(error)}\n`)
  process.exitCode = 1
})
