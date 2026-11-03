#!/usr/bin/env node
/**
 * 从一份纯文本列表生成 DSH 插件市场索引（format 1），零依赖，只用 Node 内置模块。
 *
 *   node scripts/build-index.mjs --input plugins.txt --output site/index.json --title "我的插件市场"
 *
 * 每行一个 npm 包名；空行和 # 开头的行忽略。生成器只读 npm registry 的公开元数据
 * 和下载量，从不下载 tarball、从不安装、也不运行任何被列出的代码。
 *
 * 只支持 npm 源。需要列 Git 仓库里的包（monorepo、私有仓库）时用 DSH 仓库自带的
 * 参考生成器 apps/plugin-market-generator，那边支持 git、图标提取和多语言。
 */
import { mkdir, readFile, stat, writeFile } from 'node:fs/promises'
import { dirname, join, resolve } from 'node:path'
import { compareSemver, FormatError, isExactSemver, validateIndex } from './format-1.mjs'

const DEFAULT_REGISTRY = 'https://registry.npmjs.org/'
const DOWNLOAD_API = 'https://api.npmjs.org/downloads/point/last-month/'
const ICON_EXTENSIONS = ['svg', 'png', 'jpg', 'jpeg', 'webp']
const USER_AGENT = 'dsh-market-builder/1.0 (+format 1 index generator)'

const HELP = `用法: node scripts/build-index.mjs --input <plugins.txt> --output <index.json> --title <标题> [选项]

  --input <file>        来源列表，每行一个 npm 包名（必填）
  --output <file>       写出的索引文件（必填）
  --title <text>        市场标题（必填）
  --description <text>  市场描述
  --overrides <file>    人工覆盖：标题、描述、分类、图标等
  --downloads           抓 npm 近 30 天下载量，作为可排序的 sortKey
  --stars               抓 GitHub star 数，作为可排序的 sortKey
  --registry <url>      替代 npm registry（默认 ${DEFAULT_REGISTRY}）
  --index-url <url>     发布后的索引地址，仅用于校验相对图标（默认 https://market.invalid/index.json）
  --timeout-ms <n>      单个请求超时（默认 30000）
  -h, --help            显示这段帮助
`

function parseArgs(argv) {
  const options = {
    registry: DEFAULT_REGISTRY,
    indexUrl: 'https://market.invalid/index.json',
    timeoutMs: 30_000,
    downloads: false,
    stars: false,
  }
  for (let i = 0; i < argv.length; i += 1) {
    const flag = argv[i]
    const next = () => {
      const value = argv[i + 1]
      if (value === undefined || value.startsWith('--')) throw new Error(`${flag} 需要一个值`)
      i += 1
      return value
    }
    switch (flag) {
      case '--input': options.input = next(); break
      case '--output': options.output = next(); break
      case '--title': options.title = next(); break
      case '--description': options.description = next(); break
      case '--overrides': options.overrides = next(); break
      case '--registry': options.registry = next(); break
      case '--index-url': options.indexUrl = next(); break
      case '--timeout-ms': options.timeoutMs = Number(next()); break
      case '--downloads': options.downloads = true; break
      case '--stars': options.stars = true; break
      case '-h':
      case '--help': options.help = true; break
      default: throw new Error(`未知参数 ${flag}`)
    }
  }
  if (options.help) return options
  for (const required of ['input', 'output', 'title']) {
    if (!options[required]) throw new Error(`缺少 --${required}`)
  }
  if (!Number.isFinite(options.timeoutMs) || options.timeoutMs <= 0) throw new Error('--timeout-ms 必须是正数')
  return options
}

async function fetchJson(url, timeoutMs) {
  const response = await fetch(url, {
    signal: AbortSignal.timeout(timeoutMs),
    headers: { accept: 'application/json', 'user-agent': USER_AGENT },
  })
  if (!response.ok) throw new Error(`HTTP ${String(response.status)} ${url}`)
  return await response.json()
}

/** 只读列表：去空行、去注释、去重但保留顺序。 */
function readList(text) {
  const seen = new Set()
  const names = []
  for (const raw of text.split(/\r?\n/u)) {
    const line = raw.trim()
    if (line === '' || line.startsWith('#')) continue
    if (line.startsWith('http://') || line.startsWith('https://')) {
      throw new Error(`本生成器只支持 npm 包名，遇到 URL: ${line}（Git 源请用官方生成器）`)
    }
    if (seen.has(line)) continue
    seen.add(line)
    names.push(line)
  }
  return names
}

/** manifest 是否声明了可安装的 DSH 组合包。 */
function hasBundle(manifest) {
  const patch = manifest.dsh?.bundle?.patch
  if (typeof patch === 'string') return patch !== ''
  return Array.isArray(patch) && patch.length > 0 && patch.every((entry) => typeof entry === 'string' && entry !== '')
}

/**
 * 版本的 engines.dsh：优先 manifest 自己声明的，否则取唯一的 @deepseek-ai/dsh* peer 范围。
 * 拿不准就省略——省略时 DSH 安装会按包自身的 peer 依赖再检查一次。
 */
function dshRangeOf(manifest) {
  const declared = manifest.engines?.dsh
  if (typeof declared === 'string' && declared.trim() !== '') {
    const range = declared.trim()
    return range.startsWith('workspace:') ? undefined : range
  }
  const ranges = new Set()
  for (const [dependency, range] of Object.entries(manifest.peerDependencies ?? {})) {
    if (!/^@deepseek-ai\/dsh(?:-|$)/u.test(dependency)) continue
    if (typeof range !== 'string') continue
    if (range === '*' || /^workspace:(?:\*|\^|~)$/u.test(range)) continue
    ranges.add(range)
  }
  return ranges.size === 1 ? [...ranges][0] : undefined
}

function authorNameOf(author) {
  if (typeof author === 'string') {
    const name = author.replace(/<[^>]*>/gu, '').replace(/\([^)]*\)/gu, '').trim()
    return name === '' ? undefined : name
  }
  if (author !== null && typeof author === 'object' && typeof author.name === 'string') {
    return author.name.trim() === '' ? undefined : author.name.trim()
  }
  return undefined
}

function repositoryOf(repository) {
  if (repository === null || repository === undefined) return undefined
  let url
  let directory
  if (typeof repository === 'string') url = repository
  else if (typeof repository === 'object' && typeof repository.url === 'string') {
    url = repository.url
    if (typeof repository.directory === 'string') directory = repository.directory
  }
  if (url === undefined) return undefined
  url = url.trim()
  if (url.startsWith('github:')) url = `https://github.com/${url.slice(7)}`
  else if (url.startsWith('gitlab:')) url = `https://gitlab.com/${url.slice(7)}`
  else if (url.startsWith('bitbucket:')) url = `https://bitbucket.org/${url.slice(10)}`
  else if (/^git@[^:]+:/u.test(url)) url = `https://${url.slice(4).replace(':', '/')}`
  url = url.replace(/^git\+/u, '').replace(/^ssh:\/\/git@/u, 'https://').replace(/\.git$/u, '')
  if (!url.startsWith('https://') && !url.startsWith('http://')) return undefined
  let parsed
  try {
    parsed = new URL(url)
  } catch {
    return undefined
  }
  if (parsed.pathname.split('/').filter(Boolean).length < 2) return undefined
  const result = { url: url.replace(/[?#].*$/u, '') }
  // npm 上常见 "." 表示仓库根目录，格式不接受，直接当没有
  const cleaned = directory?.trim().replace(/^\.\//u, '').replace(/\/+$/u, '')
  const segments = cleaned === undefined ? [] : cleaned.split('/')
  const usable =
    cleaned !== undefined &&
    cleaned !== '' &&
    cleaned !== '.' &&
    !segments.some((segment) => segment === '' || segment === '.' || segment === '..') &&
    /^[A-Za-z0-9._@+-]+(?:\/[A-Za-z0-9._@+-]+)*$/u.test(cleaned)
  if (usable) result.directory = cleaned
  return result
}

function homepageOf(homepage) {
  if (typeof homepage !== 'string') return undefined
  const text = homepage.trim()
  if (!/^https?:\/\//u.test(text)) return undefined
  try {
    return new URL(text).href
  } catch {
    return undefined
  }
}

/**
 * 读 GitHub 仓库的 star 数；不是 GitHub 仓库或读取失败时返回 undefined。
 */
async function starsOf(repository, timeoutMs) {
  if (repository === undefined || typeof repository.url !== 'string') return undefined
  const match = /^https?:\/\/github\.com\/([^/]+)\/([^/]+?)(?:\.git)?$/u.exec(repository.url)
  if (match === null) return undefined
  const response = await fetch(`https://api.github.com/repos/${match[1]}/${match[2]}`, {
    signal: AbortSignal.timeout(timeoutMs),
    headers: { accept: 'application/vnd.github+json', 'user-agent': USER_AGENT },
  })
  if (!response.ok) throw new Error(`GitHub API HTTP ${String(response.status)}`)
  const doc = await response.json()
  return typeof doc.stargazers_count === 'number' ? doc.stargazers_count : undefined
}

/**
 * 找图标：先看输出目录旁的 icons/（CI 会把图标复制进去），再退回仓库根的 icons/。
 * 返回的是相对路径，DSH 会按索引 URL 解析。
 */
async function iconFor(outputDir, name) {
  const safe = name.replace(/^@/u, '').replace(/[/\\]/gu, '__')
  for (const base of [outputDir, process.cwd()]) {
    for (const extension of ICON_EXTENSIONS) {
      const relative = `icons/${safe}.${extension}`
      try {
        await stat(join(base, relative))
        return relative
      } catch {
        // 继续找下一个扩展名
      }
    }
  }
  return undefined
}

/**
 * 把一个 npm 包变成索引里的一个插件条目；没有可安装版本时返回 undefined。
 */
async function entryFor(name, doc, context) {
  const time = doc.time ?? {}
  const versions = []
  for (const [version, manifest] of Object.entries(doc.versions ?? {})) {
    if (manifest === null || typeof manifest !== 'object') continue
    if (manifest.deprecated !== undefined) continue
    if (!isExactSemver(version)) continue
    if (!hasBundle(manifest)) continue
    const published = time[version]
    if (typeof published !== 'string') continue
    const publishTimestamp = Math.floor(Date.parse(published) / 1000)
    if (!Number.isInteger(publishTimestamp) || publishTimestamp < 0) continue
    const range = dshRangeOf(manifest)
    versions.push({
      version,
      publishTimestamp,
      source: { type: 'npm' },
      ...(range === undefined ? {} : { engines: { dsh: range } }),
    })
  }
  if (versions.length === 0) return undefined
  versions.sort((left, right) => compareSemver(right.version, left.version))

  const latest = doc.versions[versions[0].version]
  const override = context.overrides[name] ?? {}
  const icon = override.icon ?? (await iconFor(context.outputDir, name))
  const metadata = {
    keywords: Array.isArray(latest.keywords) ? latest.keywords.filter((keyword) => typeof keyword === 'string') : [],
    ...(override.category === undefined ? {} : { category: override.category }),
    ...(override.labels === undefined ? {} : { labels: override.labels }),
    ...(override.sortKeys === undefined ? {} : { sortKeys: override.sortKeys }),
  }
  if (context.downloads) {
    try {
      const point = await fetchJson(`${DOWNLOAD_API}${name}`, context.timeoutMs)
      const count = point?.downloads
      if (typeof count === 'number' && Number.isFinite(count)) {
        metadata.sortKeys = { ...(metadata.sortKeys ?? {}), downloads: count }
      }
    } catch (error) {
      // 缺值的插件在有 downloads 排序时排在最后，不影响其余条目
      context.warn(`${name}: 下载量读取失败（${error instanceof Error ? error.message : String(error)}）`)
    }
  }
  const repository = override.repository ?? repositoryOf(latest.repository)
  if (context.stars) {
    try {
      const stars = await starsOf(repository, context.timeoutMs)
      if (stars !== undefined) metadata.sortKeys = { ...(metadata.sortKeys ?? {}), stars }
    } catch (error) {
      context.warn(`${name}: star 读取失败（${error instanceof Error ? error.message : String(error)}）`)
    }
  }
  const homepage = override.homepage ?? homepageOf(latest.homepage)
  const author = override.author ?? authorNameOf(latest.author)
  const description = override.description ?? (typeof latest.description === 'string' ? latest.description : undefined)
  return {
    name,
    ...(override.title === undefined ? {} : { title: override.title }),
    ...(description === undefined ? {} : { description }),
    ...(icon === undefined ? {} : { icon }),
    ...(author === undefined ? {} : { author }),
    ...(homepage === undefined ? {} : { homepage }),
    ...(repository === undefined ? {} : { repository }),
    metadata,
    versions,
  }
}

async function readOverrides(path) {
  if (path === undefined) return { metadata: {}, plugins: {} }
  const parsed = JSON.parse(await readFile(resolve(path), 'utf8'))
  if (parsed === null || typeof parsed !== 'object' || Array.isArray(parsed)) throw new Error('覆盖文件必须是 JSON 对象')
  if (Object.hasOwn(parsed, 'plugins') || Object.hasOwn(parsed, 'metadata')) {
    return { metadata: parsed.metadata ?? {}, plugins: parsed.plugins ?? {} }
  }
  // 也接受「包名 → 字段」的扁平写法
  return { metadata: {}, plugins: parsed }
}

async function main() {
  const options = parseArgs(process.argv.slice(2))
  if (options.help) {
    process.stdout.write(HELP)
    return
  }
  const outputDir = dirname(resolve(options.output))
  await mkdir(outputDir, { recursive: true })
  const overrides = await readOverrides(options.overrides)
  const names = readList(await readFile(resolve(options.input), 'utf8'))
  if (names.length === 0) throw new Error(`${options.input} 里没有包名`)

  const context = {
    overrides: overrides.plugins,
    outputDir,
    timeoutMs: options.timeoutMs,
    downloads: options.downloads,
    stars: options.stars,
    warn: (message) => process.stderr.write(`! ${message}\n`),
  }
  const plugins = []
  const failures = []
  for (const name of names) {
    try {
      const doc = await fetchJson(`${options.registry}${name.replace('/', '%2F')}`, options.timeoutMs)
      const entry = await entryFor(name, doc, context)
      if (entry === undefined) {
        context.warn(`${name}: 没有未弃用、声明了 dsh.bundle、带发布时间的版本，已跳过`)
        continue
      }
      plugins.push(entry)
      process.stdout.write(`+ ${name} ${entry.versions[0].version}\n`)
    } catch (error) {
      failures.push(`${name}: ${error instanceof Error ? error.message : String(error)}`)
    }
  }
  if (plugins.length === 0) throw new Error('没有任何可用插件，索引不会写出')

  const metadata = structuredClone(overrides.metadata ?? {})
  if (options.stars) {
    metadata.sortKeys = {
      stars: { title: { en: '★ Most stars', zh: '★ 星数最多' }, order: 'desc' },
      ...(metadata.sortKeys ?? {}),
    }
  }
  if (options.downloads) {
    metadata.sortKeys = {
      downloads: { title: { en: '↓ Downloads (30d)', zh: '↓ 近 30 天下载' }, order: 'desc' },
      ...(metadata.sortKeys ?? {}),
    }
  }
  const index = {
    format: 1,
    title: options.title,
    ...(options.description === undefined ? {} : { description: options.description }),
    metadata,
    plugins,
  }

  try {
    validateIndex(index, options.indexUrl)
  } catch (error) {
    if (error instanceof FormatError) throw new Error(`生成的索引不合规：${error.message}`)
    throw error
  }

  const json = `${JSON.stringify(index, null, 2)}\n`
  await writeFile(resolve(options.output), json, 'utf8')
  process.stdout.write(`\n写出 ${resolve(options.output)}（${String(plugins.length)} 个插件，${String(Buffer.byteLength(json))} 字节）\n`)
  if (failures.length > 0) {
    process.stderr.write(`\n${String(failures.length)} 个来源失败：\n${failures.map((line) => `  - ${line}`).join('\n')}\n`)
    process.exitCode = 1
  }
}

main().catch((error) => {
  process.stderr.write(`\n${error instanceof Error ? error.message : String(error)}\n`)
  process.exitCode = 1
})
