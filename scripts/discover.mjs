#!/usr/bin/env node
/**
 * 发现候选插件：从 npm 注册表按关键词搜索，挑出真正声明了 DSH 集成的包。
 *
 *   node scripts/discover.mjs [--out candidates.json]
 *
 * 判定「是 DSH 插件」的依据（任一）：
 *   - package.json 里有 dsh.bundle 或 dsh.client
 *   - 依赖里有 @deepseek-ai/dsh-* 或 cordis
 * 只有声明了 dsh.client（浏览器半边）的才算「有界面」；其它归为 host 插件。
 */
import { readFile, writeFile } from 'node:fs/promises'
import { join, resolve } from 'node:path'

const REGISTRY = 'https://registry.npmjs.org'
const root = resolve(import.meta.dirname, '..')

const QUERIES = [
  'keywords:dsh',
  'keywords:dsh-plugin',
  'keywords:deepseek-harness',
  'keywords:cordis',
  'dsh plugin',
  'deepseek harness',
  '@deepseek-ai'
]

const existing = new Set(
  (await readFile(join(root, 'plugins.txt'), 'utf8'))
    .split(/\r?\n/u).map((line) => line.trim())
    .filter((line) => line !== '' && !line.startsWith('#')),
)

async function getJson(url) {
  const response = await fetch(url, {
    headers: { accept: 'application/json', 'user-agent': 'dsh-market-discover/1.0' },
    signal: AbortSignal.timeout(30_000)
  })
  if (!response.ok) throw new Error(`HTTP ${String(response.status)} ${url}`)
  return await response.json()
}

const found = new Map()
for (const query of QUERIES) {
  for (let from = 0; from < 250; from += 250) {
    const url = `${REGISTRY}/-/v1/search?text=${encodeURIComponent(query)}&size=250&from=${String(from)}`
    let page
    try {
      page = await getJson(url)
    } catch (error) {
      process.stderr.write(`搜索失败 ${query}: ${String(error)}\n`)
      break
    }
    for (const item of page.objects ?? []) {
      const name = item.package?.name
      if (typeof name !== 'string' || existing.has(name) || found.has(name)) continue
      found.set(name, {
        name,
        version: item.package.version,
        description: item.package.description ?? '',
        date: item.package.date,
        keywords: item.package.keywords ?? []
      })
    }
    if ((page.objects ?? []).length < 250) break
  }
  process.stdout.write(`搜索「${query}」后累计 ${String(found.size)} 个候选\n`)
}

// 逐个确认是不是 DSH 插件
const confirmed = []
for (const [name, info] of found) {
  try {
    const doc = await getJson(`${REGISTRY}/${name.replace('/', '%2F')}`)
    const latest = doc['dist-tags']?.latest
    const manifest = doc.versions?.[latest]
    if (manifest === undefined) continue
    const deps = { ...manifest.dependencies, ...manifest.peerDependencies, ...manifest.devDependencies }
    const depNames = Object.keys(deps)
    const hasDshField = manifest.dsh !== undefined
      && (manifest.dsh.bundle !== undefined || manifest.dsh.client !== undefined)
    const hasDshDep = depNames.some((dep) => dep.startsWith('@deepseek-ai/') || dep === 'cordis')
    if (!hasDshField && !hasDshDep) continue
    confirmed.push({
      ...info,
      version: latest,
      kind: manifest.dsh?.client === undefined ? 'host' : 'client',
      dsh: manifest.dsh ?? {},
      repository: typeof manifest.repository === 'string' ? manifest.repository : manifest.repository?.url,
      homepage: manifest.homepage
    })
  } catch (error) {
    process.stderr.write(`跳过 ${name}: ${String(error)}\n`)
  }
}

confirmed.sort((left, right) => String(right.date).localeCompare(String(left.date)))
const out = join(root, 'scripts', 'candidates.json')
await writeFile(out, `${JSON.stringify({ generatedAt: new Date().toISOString(), candidates: confirmed }, null, 2)}\n`, 'utf8')
process.stdout.write(`\n候选 ${String(found.size)} 个，确认是 DSH 插件的 ${String(confirmed.length)} 个\n明细：scripts/candidates.json\n`)
for (const item of confirmed.slice(0, 40)) {
  process.stdout.write(`  ${item.kind === 'client' ? '[界面]' : '[Host]'} ${item.name}@${item.version} — ${item.description.slice(0, 60)}\n`)
}
