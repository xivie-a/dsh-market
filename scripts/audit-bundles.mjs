/**
 * 发布前体检：把索引里的每个包从 npm 拉下来，判断「装了会不会用不了」。
 *
 * 出三档结论，不再是一个布尔值：
 *   ok    这版能装
 *   warn  能装，但有话要说（最常见：作者没声明支持哪些 DSH 版本）
 *   fail  别上架（挂载名解析不到、客户端半边缺失或重复注册、跟别的插件撞 id）
 *
 * 用法：node scripts/audit-bundles.mjs [--input plugins.txt] [--json dist/audit.json] [--limit N]
 */

import { execFileSync } from 'node:child_process'
import { mkdirSync, mkdtempSync, readdirSync, readFileSync, rmSync, statSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { dirname, join } from 'node:path'

const REGISTRY = 'https://registry.npmjs.org/'
const ARGS = process.argv.slice(2)
const flag = (name, fallback) => {
  const index = ARGS.indexOf(`--${name}`)
  return index === -1 ? fallback : ARGS[index + 1]
}

const input = flag('input', 'plugins.txt')
const jsonOut = flag('json', 'dist/audit.json')
const limit = Number(flag('limit', '0')) || 0

/**
 * 这几类会让「装上就用不了」，直接不上架。
 * client-duplicate 只算提醒：静态看不清哪些文件会被加载，宁可放过也不冤枉好包。
 */
const FATAL = new Set(['patch-missing', 'patch-mount', 'client-missing', 'no-manifest', 'no-latest'])

const names = readFileSync(input, 'utf8')
  .split(/\r?\n/u)
  .map((line) => line.trim())
  .filter((line) => line !== '' && !line.startsWith('#'))
const targets = limit > 0 ? names.slice(0, limit) : names

async function fetchJson(url) {
  const response = await fetch(url, { headers: { accept: 'application/json' }, signal: AbortSignal.timeout(30_000) })
  if (!response.ok) throw new Error(`HTTP ${response.status}`)
  return response.json()
}

const work = mkdtempSync(join(tmpdir(), 'audit-bundles-'))
let counter = 0

/** 整个 tarball 解出来，patch 和客户端半边都在里面。 */
async function unpack(tarballUrl) {
  const index = counter++
  const dir = join(work, `p${index}`)
  mkdirSync(dir, { recursive: true })
  const response = await fetch(tarballUrl, { signal: AbortSignal.timeout(90_000) })
  if (!response.ok) throw new Error(`tarball HTTP ${response.status}`)
  const tgz = join(dir, 'package.tgz')
  writeFileSync(tgz, Buffer.from(await response.arrayBuffer()))
  execFileSync('tar', ['-xzf', tgz, '-C', dir], { stdio: 'ignore' })
  return join(dir, 'package')
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
  // 指向别的包是合法的（例如 archify 挂 @deepseek-ai/dsh-skill-filesystem）。
  const bare = packageName.startsWith('@') ? packageName.split('/')[1] : packageName
  if (value === bare) return false
  if (value.startsWith(`${bare}/`)) return false
  return true
}

function clientCandidates(manifest) {
  const out = []
  const push = (value) => {
    if (typeof value === 'string' && value !== '' && !out.includes(value)) out.push(value.replace(/^\.\//u, ''))
  }
  const exported = manifest.exports
  const sub = exported !== null && typeof exported === 'object' ? exported['./client'] : undefined
  if (typeof sub === 'string') push(sub)
  else if (sub !== null && typeof sub === 'object') {
    push(sub.browser)
    push(sub.default)
    push(sub.import)
  }
  const declared = manifest.dsh?.client
  if (declared !== null && typeof declared === 'object') {
    push(declared.entry)
    push(declared.path)
    push(declared.file)
  }
  push('lib/client.js')
  push('client.js')
  push('dist/client.js')
  return out
}

/**
 * 扫包里所有 js，收集客户端注册。
 * 静态判断不了「哪些文件会被加载」（有源码片段、有 root/lib 两份产物、有 chunk 拆分），
 * 所以只有一种确定性可疑：**同一个文件里同一个 id 注册了两次**。那几乎一定是打包事故。
 */
function scanAll(dir) {
  const found = []
  const walk = (current) => {
    for (const entry of readdirSync(current, { withFileTypes: true })) {
      const full = join(current, entry.name)
      if (entry.isDirectory()) {
        if (entry.name === 'node_modules' || entry.name.startsWith('.')) continue
        walk(full)
        continue
      }
      if (!/\.(?:js|mjs|cjs)$/u.test(entry.name)) continue
      if (statSync(full).size > 4_000_000) continue
      const text = readFileSync(full, 'utf8')
      for (const match of text.matchAll(/__ModuleLoader__\s*\.\s*load\s*\(/gu)) {
        const head = text.slice(match.index, match.index + 400)
        const id = /\bid:\s*['"]([^'"]+)['"]/u.exec(head)?.[1]
        if (id === undefined) continue
        found.push({ id, chunk: /\bchunk:\s*['"][^'"]+['"]/u.test(head), file: full.slice(dir.length + 1) })
      }
    }
  }
  walk(dir)
  return found
}

function engineOf(manifest) {
  const engine = manifest.engines?.dsh
  if (typeof engine === 'string' && engine !== '' && engine !== '*') return engine
  if (typeof manifest.dshTarget === 'string' && manifest.dshTarget !== '') return manifest.dshTarget
  return undefined
}

const rows = []

async function audit(name) {
  const row = { name, version: '', status: 'ok', reasons: [], clientIds: [], engine: undefined }
  try {
    const doc = await fetchJson(`${REGISTRY}${name.replace('/', '%2F')}`)
    const latest = doc['dist-tags']?.latest
    if (latest === undefined) {
      row.reasons.push({ code: 'no-latest', detail: 'npm 上没有 latest 标签' })
      return row
    }
    row.version = latest
    const manifest = doc.versions?.[latest]
    if (manifest === undefined) {
      row.reasons.push({ code: 'no-manifest', detail: 'latest 版本没有 manifest' })
      return row
    }
    row.engine = engineOf(manifest)
    if (row.engine === undefined) {
      row.reasons.push({ code: 'no-dsh-engine', detail: '没声明 engines.dsh，也没写 dshTarget' })
    }
    if (manifest.dsh?.bundle === undefined) {
      row.reasons.push({ code: 'no-bundle', detail: '没声明 dsh.bundle，装进去只是一份依赖' })
    }

    const dir = await unpack(manifest.dist?.tarball)

    const patch = manifest.dsh?.bundle?.patch
    const patchFiles = (typeof patch === 'string' ? [patch] : Array.isArray(patch) ? patch : [])
      .filter((item) => typeof item === 'string' && item !== '')
      .map((item) => item.replace(/^\.\//u, ''))
    for (const file of patchFiles) {
      let text
      try {
        text = readFileSync(join(dir, file), 'utf8')
      } catch {
        row.reasons.push({ code: 'patch-missing', detail: `package.json 声明了 ${file}，但包里没有这个文件` })
        continue
      }
      for (const value of mountNames(text)) {
        if (!resolves(value, name)) {
          row.reasons.push({ code: 'patch-mount', detail: `挂载名写成了 ${value}，DSH 解析不到这个模块` })
        }
      }
    }

    if (manifest.dsh?.client !== undefined) {
      const candidates = clientCandidates(manifest)
      const entry = candidates.find((file) => {
        try {
          return statSync(join(dir, file)).isFile()
        } catch {
          return false
        }
      })
      // 「声明了界面半边但文件根本不存在」是确定的；文件在、注册在哪则静态看不清。
      if (entry === undefined) {
        row.reasons.push({ code: 'client-missing', detail: `声明了浏览器半边，但找不到 ${candidates.slice(0, 3).join(' / ')}` })
      }
    }

    const registrations = scanAll(dir)
    row.clientIds = [...new Set(registrations.map((item) => item.id))]
    const perFile = new Map()
    for (const item of registrations) {
      if (item.chunk) continue
      const key = `${item.file}\u0000${item.id}`
      perFile.set(key, (perFile.get(key) ?? 0) + 1)
    }
    for (const [key, count] of perFile) {
      if (count < 2) continue
      const [file, id] = key.split('\u0000')
      row.reasons.push({ code: 'client-duplicate', detail: `${file} 里同一个 id "${id}" 注册了 ${count} 次` })
    }
  } catch (error) {
    row.reasons.push({ code: 'error', detail: String(error?.message ?? error).slice(0, 160) })
  }
  return row
}

const queue = [...targets]
async function worker() {
  while (queue.length > 0) {
    const name = queue.shift()
    if (name === undefined) return
    const row = await audit(name)
    rows.push(row)
    process.stdout.write(row.reasons.some((reason) => FATAL.has(reason.code) || reason.code === 'error') ? 'x' : row.reasons.length > 0 ? '!' : '.')
  }
}
await Promise.all(Array.from({ length: 6 }, () => worker()))
process.stdout.write('\n')

// 同一个客户端 id 被两个包注册，也会让后装的那个直接失效。
const byId = new Map()
for (const row of rows) {
  for (const id of row.clientIds) {
    const owners = byId.get(id) ?? []
    owners.push(row)
    byId.set(id, owners)
  }
}
for (const [id, owners] of byId) {
  if (owners.length < 2) continue
  for (const row of owners) {
    row.reasons.push({ code: 'client-id-collision', detail: `客户端 id "${id}" 同时被 ${owners.filter((other) => other !== row).map((other) => other.name).join('、')} 注册` })
  }
}

rows.sort((left, right) => left.name.localeCompare(right.name))
for (const row of rows) {
  const fatal = row.reasons.some((reason) => FATAL.has(reason.code) || reason.code === 'error')
  row.status = fatal ? 'fail' : row.reasons.length > 0 ? 'warn' : 'ok'
}

const fail = rows.filter((row) => row.status === 'fail')
const warn = rows.filter((row) => row.status === 'warn')
const ok = rows.filter((row) => row.status === 'ok')

console.log(`检查 ${rows.length} 个包：可以用 ${ok.length}，有提醒 ${warn.length}，不能上架 ${fail.length}`)
for (const row of fail) console.log(`\n✗ ${row.name}@${row.version}\n  ${row.reasons.filter((reason) => FATAL.has(reason.code) || reason.code === 'error').map((reason) => `${reason.code}: ${reason.detail}`).join('\n  ')}`)
const warnKinds = new Map()
for (const row of warn) for (const reason of row.reasons) warnKinds.set(reason.code, (warnKinds.get(reason.code) ?? 0) + 1)
console.log(`\n提醒分类：${[...warnKinds.entries()].map(([code, count]) => `${code} ${count}`).join(' · ')}`)

if (jsonOut !== '') {
  mkdirSync(dirname(jsonOut), { recursive: true })
  writeFileSync(jsonOut, `${JSON.stringify({ generatedAt: new Date().toISOString(), rows }, null, 2)}\n`)
  console.log(`写出 ${jsonOut}`)
}
rmSync(work, { recursive: true, force: true })
