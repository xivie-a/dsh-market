#!/usr/bin/env node
/**
 * 把插件页面渲染成一张可以截图的静态页，用来做视觉自查。
 *
 *   node scripts/build-preview.mjs
 *
 * 它直接复用 plugin/client.js 里的真实组件和样式（不复制一份），
 * 只是用假的 DSH 上下文（槽位、locale、remote 服务）把它挂起来，
 * 所以「预览里长什么样」和「DSH 里长什么样」是同一份代码。
 *
 * 产物：preview/index.html
 */
import { mkdir, readFile, stat, writeFile } from 'node:fs/promises'
import { dirname, join, resolve } from 'node:path'

const root = resolve(import.meta.dirname, '..')
const previewDir = join(root, 'preview')
const vendorDir = join(previewDir, 'vendor')

const REACT_URL = 'https://unpkg.com/react@18.3.1/umd/react.production.min.js'
const REACT_DOM_URL = 'https://unpkg.com/react-dom@18.3.1/umd/react-dom.production.min.js'

async function ensureVendor() {
  await mkdir(vendorDir, { recursive: true })
  const files = [
    ['react.js', REACT_URL],
    ['react-dom.js', REACT_DOM_URL],
  ]
  for (const [name, url] of files) {
    const target = join(vendorDir, name)
    try {
      await stat(target)
      continue
    } catch {
      // 下载
    }
    const response = await fetch(url, { headers: { 'user-agent': 'dsh-market-preview/1.0' } })
    if (!response.ok) throw new Error(`下载 ${url} 失败: HTTP ${response.status}`)
    await writeFile(target, new Uint8Array(await response.arrayBuffer()))
    process.stdout.write(`+ ${name}\n`)
  }
}

/** 从 client.js 里抽出样式模板，保证预览和真实界面同一份 CSS。 */
function extractStyles(source) {
  const start = source.indexOf('const STYLES = `')
  if (start === -1) throw new Error('client.js 里找不到 STYLES')
  const from = start + 'const STYLES = `'.length
  const end = source.indexOf('\n`', from)
  if (end === -1) throw new Error('STYLES 模板没有闭合')
  return source.slice(from, end)
}

const HARNESS = String.raw`
  const React = window.React
  const ReactDOM = window.ReactDOM

  // 截图参数：?theme=dark 预置主题（必须在渲染前写，组件初始化时读取）
  const previewParams = new URLSearchParams(location.search)
  if (previewParams.has('theme')) {
    try { window.localStorage.setItem('dsh-market-xivie:theme', previewParams.get('theme')) } catch {}
  }

  // 把索引数据补成市场服务会返回的形状
  const raw = window.__INDEX__
  const entries = raw.plugins.map((plugin) => {
    const versions = (plugin.versions ?? []).map((version) => ({
      ...version,
      install: { spec: version.source?.type === 'npm' ? plugin.name + '@' + version.version : 'git+' + version.version },
      compatibility: { compatible: true }
    }))
    const stable = versions.find((version) => !String(version.version).includes('-'))
    return { ...plugin, versions, ...(stable ? { defaultVersion: stable.version } : {}), installation: { status: 'not-installed' } }
  })
  // 让第一张卡显示「已安装」，好看清两种状态
  if (entries[0]) entries[0].installation = { status: 'installed', installedVersion: entries[0].defaultVersion }

  // 索引里的图标是相对索引地址的，预览里补成绝对地址
  for (const entry of entries) {
    if (typeof entry.icon === 'string') {
      entry.icon = new URL(entry.icon, 'https://xivie-a.github.io/dsh-market/').href
    }
  }

  const fakeRemote = {
    pluginMarket: {
      listIndexes: async () => [{ url: 'https://xivie-a.github.io/dsh-market/index.json' }],
      setIndexes: async () => {},
      search: async (_url, query) => {
        const offset = query.offset ?? 0
        const limit = query.limit ?? 100
        const page = entries.slice(offset, offset + limit)
        return {
          ok: true,
          value: {
            entries: page,
            metadata: raw.metadata,
            fetchedAt: Date.now(),
            nextOffset: offset + page.length < entries.length ? offset + page.length : null,
            total: entries.length
          }
        }
      }
    },
    pluginManager: {
      listBundles: async () => ({ ok: true, value: entries.filter((entry) => entry.installation.status === 'installed').map((entry) => ({ name: entry.name, installed: true, version: entry.defaultVersion })) }),
      inspect: async () => ({ ok: true, value: { status: 'ok' } }),
      installBundle: async () => ({ ok: true, value: { application: 'restart-required' } })
    }
  }

  const registrations = {}
  const scope = {
    remote: fakeRemote,
    effect(fn) { const dispose = fn(); return () => { if (typeof dispose === 'function') dispose() } }
  }

  let dictionary
  const ctx = {
    effect(fn) { const dispose = fn(); return () => { if (typeof dispose === 'function') dispose() } },
    locale: {
      register(_ns, dicts) { dictionary = dicts },
      bind() { return (key) => (dictionary?.zh ?? {})[key] ?? key }
    },
    slots: {
      inject(_name, callback) { callback() },
      register(options, Component) { registrations[options.name] = { options, Component }; return () => {} }
    },
    inject(_paths, callback) { callback(scope) },
    remote: fakeRemote,
    get() { return undefined }
  }

  const spec = window.__spec
  const module = spec.factory((id) => {
    if (id === 'react') return React
    if (id === 'react-dom') return window.ReactDOM
    throw new Error('预览缺少模块: ' + id)
  })
  module.apply(ctx)

  if (!registrations['plugins.tab']) throw new Error('没有注册 plugins.tab 槽位')

  const Tab = registrations['plugins.tab'].Component
  const container = document.getElementById('root')
  ReactDOM.createRoot(container).render(React.createElement('div', { style: { height: '100vh' } }, React.createElement(Tab)))

  // ?select=N 时自动点开第 N 张卡，用来截详情面板
  const params = new URLSearchParams(location.search)
  if (params.has('select')) {
    const index = Number(params.get('select') ?? 2)
    setTimeout(() => {
      const cards = document.querySelectorAll('.dm-card')
      if (cards[index]) cards[index].click()
    }, 400)
  }
`

async function main() {
  await ensureVendor()
  const clientSource = await readFile(join(root, 'plugin', 'client.js'), 'utf8')
  const styles = extractStyles(clientSource)
  const index = JSON.parse(await readFile(join(root, 'dist', 'index.json'), 'utf8'))

  const html = `<!doctype html>
<html lang="zh-CN">
<head>
<meta charset="utf-8">
<title>DSH 插件市场 · 预览</title>
<style>
  html, body { margin: 0; padding: 0; background: #fff; color: #1a1a1a; }
  body { font-family: -apple-system, "Segoe UI", "Microsoft YaHei", sans-serif; }
${styles}
/* 截图用：关掉入场动画，否则会抓到动画中间态 */
.dm-appear, .dm-detail, .dm-toast, .dm-skel { animation: none !important; }
</style>
</head>
<body>
<div id="root"></div>
<script>window.__INDEX__ = ${JSON.stringify(index)};</script>
<script>window.__ModuleLoader__ = { load(spec) { window.__spec = spec } };</script>
<script src="./vendor/react.js"></script>
<script src="./vendor/react-dom.js"></script>
<script>
${clientSource}
</script>
<script>
${HARNESS}
</script>
</body>
</html>
`
  await mkdir(previewDir, { recursive: true })
  const target = join(previewDir, 'index.html')
  await writeFile(target, html, 'utf8')
  process.stdout.write(`写出 ${target}\n`)
}

main().catch((error) => {
  process.stderr.write(`\n${error instanceof Error ? error.message : String(error)}\n`)
  process.exitCode = 1
})
