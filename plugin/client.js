// Browser 半边：插件页的「我的市场」标签 + 左侧导航的「我的市场」入口。
// 手写成 DSH 模块加载器要的形状，所以这个包不需要任何构建步骤。
window.__ModuleLoader__.load({
  id: 'dsh-market-xivie',
  factory: require => {
    const React = require('react')
    const h = React.createElement

    const NS = 'dsh-market-xivie'
    const SIDEBAR_ID = 'my-market'
    const INDEX_URL = 'https://xivie-a.github.io/dsh-market/index.json'
    const PAGE_LIMIT = 100

    const zh = {
      title: '我的市场',
      subtitle: '社区插件索引，每条人工审核后收录',
      search: '搜索插件',
      all: '全部',
      featured: '精选 · 下载最多',
      allPlugins: '全部插件',
      install: '安装',
      installed: '已安装',
      update: '可更新',
      provided: '随 DSH 提供',
      installing: '安装中…',
      restart: '已安装，重启 DSH 后生效',
      done: '已安装',
      empty: '没有匹配的插件',
      loading: '读取索引…',
      retry: '重试',
      refresh: '刷新',
      error: '读取索引失败',
      confirm: '确认安装这个插件？',
      installedOk: '已安装完成',
      needsApproval: '这个插件要运行安装脚本，需要到「插件」页安装并确认',
      dismissed: '已关闭',
      source: '来源',
      versions: '个版本',
      plugins: '个插件',
      noTarget: '这个版本没有可用的安装地址',
      refused: '当前 DSH 版本不接受这个插件',
      inspectFailed: '无法校验这个包',
      installFailed: '安装失败',
      missingSource: '索引还没加进「发现」，先运行 /my-market 命令或在「发现 → 添加索引源」里加上它。'
    }
    const en = {
      title: 'My Market',
      subtitle: 'A community plugin index, reviewed by hand',
      search: 'Search plugins',
      all: 'All',
      featured: 'Featured · most downloaded',
      allPlugins: 'All plugins',
      install: 'Install',
      installed: 'Installed',
      update: 'Update',
      provided: 'Bundled',
      installing: 'Installing…',
      restart: 'Installed. Restart DSH to use it.',
      done: 'Installed',
      empty: 'No matching plugins',
      loading: 'Reading the index…',
      retry: 'Retry',
      refresh: 'Refresh',
      error: 'Could not read the index',
      confirm: 'Install this plugin?',
      installedOk: 'Installed',
      needsApproval: 'This plugin runs install scripts; install it from the Plugins page to approve them',
      dismissed: 'Dismissed',
      source: 'Source',
      versions: 'versions',
      plugins: 'plugins',
      noTarget: 'This version has no install target',
      refused: 'This DSH version refuses the plugin',
      inspectFailed: 'Could not inspect the package',
      installFailed: 'Install failed',
      missingSource: 'The index is not in Discover yet. Run /my-market or add it under Discover → Add index source.'
    }

    const STYLES = `
.dm-root { --dm-accent: var(--dsh-accent, #4d6bfe); --dm-line: var(--dsh-border, rgba(127,127,127,.22));
  display: flex; flex-direction: column; gap: 16px; max-width: 1320px; margin: 0 auto;
  padding: 26px 28px 56px; height: 100%; overflow: auto; box-sizing: border-box;
  background:
    radial-gradient(1200px 320px at 12% -8%, rgba(77,107,254,.10), transparent 68%),
    radial-gradient(900px 260px at 88% -6%, rgba(128,92,255,.08), transparent 70%); }
.dm-hero { display: flex; align-items: flex-start; justify-content: space-between; gap: 16px; }
.dm-hero h1 { margin: 0; font-size: 22px; font-weight: 650; letter-spacing: -.01em; display: flex; align-items: center; gap: 10px; }
.dm-pill { font-size: 11px; font-weight: 600; padding: 2px 8px; border-radius: 999px; background: rgba(77,107,254,.14); color: var(--dm-accent); }
.dm-sub { margin: 6px 0 0; font-size: 12.5px; opacity: .55; }
.dm-ghost { display: inline-flex; align-items: center; gap: 6px; padding: 7px 13px; border-radius: 9px; border: 1px solid var(--dm-line);
  background: transparent; color: inherit; cursor: pointer; font: inherit; font-size: 12.5px; transition: border-color .15s, color .15s; }
.dm-ghost:hover { border-color: var(--dm-accent); color: var(--dm-accent); }
.dm-search-wrap { position: relative; display: flex; align-items: center; max-width: 560px; }
.dm-search-wrap svg { position: absolute; left: 12px; opacity: .4; pointer-events: none; }
.dm-search { width: 100%; box-sizing: border-box; padding: 10px 12px 10px 36px; border-radius: 11px; border: 1px solid var(--dm-line);
  background: transparent; color: inherit; font: inherit; font-size: 13px; transition: border-color .15s, box-shadow .15s; }
.dm-search:focus { outline: none; border-color: var(--dm-accent); box-shadow: 0 0 0 3px rgba(77,107,254,.15); }
.dm-chips { display: flex; gap: 7px; flex-wrap: wrap; }
.dm-chip { padding: 5px 12px; border-radius: 999px; border: 1px solid var(--dm-line); background: transparent; color: inherit;
  cursor: pointer; font: inherit; font-size: 12px; transition: border-color .15s, color .15s, background .15s; }
.dm-chip:hover { border-color: var(--dm-accent); color: var(--dm-accent); }
.dm-chip[aria-pressed="true"] { background: var(--dm-accent); border-color: var(--dm-accent); color: #fff; box-shadow: 0 2px 10px rgba(77,107,254,.3); }
.dm-chip-count { margin-left: 6px; font-size: 10.5px; opacity: .5; }
.dm-chip[aria-pressed="true"] .dm-chip-count { opacity: .8; }
.dm-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(380px, 1fr)); gap: 12px; }
.dm-section { display: flex; flex-direction: column; gap: 10px; }
.dm-section-head { display: flex; align-items: center; gap: 8px; }
.dm-section-head::before { content: ''; width: 3px; height: 13px; border-radius: 2px; background: var(--dm-accent); opacity: .85; }
.dm-section-head span { font-size: 12px; font-weight: 600; letter-spacing: .02em; opacity: .65; }
.dm-eyebrow { font-size: 11px; font-weight: 600; letter-spacing: .08em; text-transform: uppercase; opacity: .45; }
.dm-featured { display: grid; grid-template-columns: repeat(auto-fit, minmax(400px, 1fr)); gap: 12px; }
.dm-hero-card { position: relative; display: flex; flex-direction: column; gap: 12px; padding: 20px; border-radius: 18px;
  border: 1px solid var(--dm-line); background: linear-gradient(135deg, rgba(77,107,254,.10), rgba(127,127,127,.04));
  overflow: hidden; transition: border-color .2s, box-shadow .2s, transform .2s; }
.dm-hero-card::after { content: ''; position: absolute; top: -90px; right: -60px; width: 240px; height: 240px; border-radius: 50%;
  background: radial-gradient(circle, rgba(77,107,254,.22), transparent 65%); pointer-events: none; }
.dm-hero-card:hover { border-color: var(--dm-accent); box-shadow: 0 14px 34px rgba(77,107,254,.18); transform: translateY(-2px); }
.dm-hero-card .dm-thumb { width: 56px; height: 56px; border-radius: 16px; font-size: 22px; transition: transform .2s; }
.dm-hero-card:hover .dm-thumb { transform: scale(1.06); }
.dm-hero-title { margin: 0; font-size: 17px; font-weight: 650; }
.dm-hero-desc { margin: 0; font-size: 13px; line-height: 1.6; opacity: .75;
  display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; overflow: hidden; }
.dm-hero-foot { display: flex; align-items: center; justify-content: space-between; gap: 10px; margin-top: auto; position: relative; }
.dm-hero-card .dm-btn { padding: 9px 20px; font-size: 13px; border-radius: 10px; }
.dm-appear { animation: dm-rise .34s cubic-bezier(.2,.7,.3,1) both; }
@keyframes dm-rise { from { opacity: 0; transform: translateY(10px) } to { opacity: 1; transform: none } }
.dm-card { display: flex; flex-direction: column; gap: 8px; padding: 16px; border-radius: 14px;
  border: 1px solid rgba(127,127,127,.16); background: rgba(127,127,127,.055);
  transition: border-color .18s, box-shadow .18s, transform .18s, background .18s; }
.dm-card:hover { border-color: var(--dm-accent); background: rgba(77,107,254,.07);
  box-shadow: 0 10px 26px rgba(0,0,0,.10); transform: translateY(-2px); }
.dm-card-top { display: flex; gap: 11px; align-items: center; min-width: 0; }
.dm-thumb { width: 42px; height: 42px; flex: none; border-radius: 12px; display: grid; place-items: center; overflow: hidden;
  background: linear-gradient(135deg, rgba(127,127,127,.16), rgba(127,127,127,.06)); border: 1px solid var(--dm-line);
  font-weight: 650; font-size: 16px; }
.dm-thumb img { width: 100%; height: 100%; object-fit: contain; }
.dm-titles { min-width: 0; display: flex; flex-direction: column; gap: 2px; }
.dm-title { font-size: 14.5px; font-weight: 600; margin: 0; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.dm-pkg { font-size: 11px; opacity: .5; font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
  white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.dm-desc { margin: 0; font-size: 12.5px; line-height: 1.55; opacity: .72;
  display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
.dm-foot { display: flex; align-items: center; justify-content: space-between; gap: 10px; margin-top: 2px; }
.dm-meta { display: flex; gap: 8px; align-items: center; font-size: 11px; min-width: 0; overflow: hidden; white-space: nowrap; }
.dm-tag { padding: 2px 7px; border-radius: 6px; background: rgba(127,127,127,.1); opacity: .8; white-space: nowrap; }
.dm-installed { display: inline-flex; align-items: center; gap: 5px; padding: 5px 10px; border-radius: 8px;
  background: rgba(127,127,127,.12); font-size: 12px; opacity: .7; white-space: nowrap; }
.dm-btn { padding: 7px 16px; border-radius: 9px; font: inherit; font-size: 12.5px; font-weight: 550;
  cursor: pointer; white-space: nowrap; border: 1px solid transparent;
  transition: filter .15s, box-shadow .15s, transform .1s, opacity .15s; }
.dm-btn--primary { background: var(--dm-accent); color: #fff; }
.dm-btn--primary:hover { filter: brightness(1.08); box-shadow: 0 4px 16px rgba(77,107,254,.34); }
.dm-btn:active:not(:disabled) { transform: translateY(1px) scale(.985); }
.dm-btn:disabled { cursor: default; opacity: .55; box-shadow: none; filter: none; }
.dm-state { display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 12px; padding: 48px 4px;
  font-size: 13px; opacity: .6; }
.dm-state button { padding: 6px 14px; border-radius: 9px; border: 1px solid var(--dm-line); background: transparent;
  color: inherit; cursor: pointer; font: inherit; font-size: 12.5px; }
.dm-skel { height: 124px; border-radius: 14px; border: 1px solid var(--dm-line);
  background: linear-gradient(90deg, rgba(127,127,127,.05) 25%, rgba(127,127,127,.13) 37%, rgba(127,127,127,.05) 63%);
  background-size: 400% 100%; animation: dm-shimmer 1.4s ease infinite; }
@keyframes dm-shimmer { 0% { background-position: 100% 0 } 100% { background-position: 0 0 } }
.dm-toast { position: fixed; right: 26px; bottom: 26px; z-index: 60; display: flex; align-items: center; gap: 10px; max-width: 440px;
  padding: 11px 14px; border-radius: 12px; font-size: 12.5px; background: rgba(30,30,34,.95); color: #fff;
  box-shadow: 0 12px 32px rgba(0,0,0,.28); animation: dm-in .18s ease-out; }
.dm-toast--error { background: rgba(150,40,40,.96); }
.dm-toast button { border: 0; background: transparent; color: inherit; opacity: .6; cursor: pointer; font-size: 15px; line-height: 1; }
.dm-toast button:hover { opacity: 1; }
@keyframes dm-in { from { opacity: 0; transform: translateY(6px) } to { opacity: 1; transform: none } }
@media (prefers-reduced-motion: reduce) {
  .dm-appear, .dm-skel, .dm-toast { animation: none !important; }
  .dm-card, .dm-hero-card, .dm-btn, .dm-thumb { transition: none !important; }
}
.dm-page { height: 100%; overflow: auto; }
.dm-page .dm-root { height: auto; }
`

    /** 本地化文本 → 字符串；优先中文，其次英文，其次第一个。 */
    function pick(text, fallback) {
      if (typeof text === 'string') return text
      if (text && typeof text === 'object') return text.zh ?? text.en ?? Object.values(text)[0] ?? fallback
      return fallback
    }

    function sortKeyOf(entry, key) {
      const value = entry?.metadata?.sortKeys?.[key]
      return typeof value === 'number' ? value : undefined
    }

      const formatCount = value => (typeof value !== 'number' ? undefined
        : value >= 10000 ? `${(value / 10000).toFixed(value >= 100000 ? 0 : 1)}万` : String(value))

    const RefreshIcon = () => h('svg', {
      width: 14, height: 14, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor',
      strokeWidth: 2, strokeLinecap: 'round', strokeLinejoin: 'round', 'aria-hidden': true
    }, h('path', { d: 'M21 12a9 9 0 1 1-2.64-6.36' }), h('path', { d: 'M21 3v6h-6' }))

    const SearchIcon = () => h('svg', {
      width: 15, height: 15, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor',
      strokeWidth: 2, strokeLinecap: 'round', 'aria-hidden': true
    }, h('circle', { cx: 11, cy: 11, r: 7 }), h('path', { d: 'm20 20-3.5-3.5' }))

    /** 没图标的插件用名字生成一个稳定的淡色底，比统一灰块有辨识度。 */
    function tintOf(name) {
      let hash = 0
      for (const char of String(name)) hash = (hash * 31 + char.codePointAt(0)) % 360
      return `hsl(${hash} 58% 52% / 0.18)`
    }

    const LOG = '[my-market]'
    const messageOf = error => (error instanceof Error ? error.message : String(error))

    /** 给任意 Promise 加一个上限，避免界面一直停在「读取索引」。 */
    function withTimeout(promise, ms, label) {
      return Promise.race([
        promise,
        new Promise((_, reject) => { window.setTimeout(() => reject(new Error(`${label} 超时 ${ms}ms`)), ms) })
      ])
    }

    /** 索引里的版本 → 安装地址（没有内置市场服务时自己拼）。 */
    function installTargetOf(plugin, version) {
      const source = version.source ?? {}
      if (source.type === 'npm') {
        return {
          spec: `${plugin.name}@${version.version}`,
          ...(source.registry ? { registry: source.registry } : {})
        }
      }
      const url = String(source.url ?? '').replace(/\.git$/u, '')
      return { spec: `git+${url}.git#${source.commit ?? ''}${source.path ? `&path:/${source.path}` : ''}` }
    }

    /** 走内置市场服务：分页读完；索引没注册时先注册一次。 */
    async function loadFromService(market, force = false) {
      try {
        const known = await withTimeout(market.listIndexes(), 3000, 'listIndexes')
        const urls = Array.isArray(known) ? known : known?.ok ? known.value : []
        const configured = (urls ?? []).some((source) => source?.url === INDEX_URL)
        console.info(LOG, 'sources', (urls ?? []).map((source) => source?.url), 'configured:', configured)
        if (!configured) {
          const list = (urls ?? []).map((source) => source.url).filter(Boolean)
          console.info(LOG, 'registering index', INDEX_URL)
          await withTimeout(market.setIndexes([...list, INDEX_URL]), 5000, 'setIndexes')
        }
      } catch (error) {
        console.warn(LOG, 'index registration skipped:', messageOf(error))
      }

      const entries = new Map()
      let offset = 0
      let metadata
      for (let page = 0; page < 20; page += 1) {
        const answer = await withTimeout(market.search(INDEX_URL, {
          sort: { kind: 'index' },
          offset,
          limit: PAGE_LIMIT,
          ...(force && offset === 0 ? { refresh: true } : {})
        }), 6000, 'search')
        if (!answer?.ok) throw new Error(answer?.error?.message ?? answer?.error?.code ?? 'search failed')
        const value = answer.value
        if (!Array.isArray(value?.entries)) throw new Error('search returned an invalid page')
        if (offset === 0) metadata = value.metadata
        for (const entry of value.entries) entries.set(entry.name, entry)
        console.info(LOG, 'page', page, 'entries', value.entries.length, 'next', value.nextOffset)
        if (value.nextOffset === null || value.nextOffset === undefined) break
        offset = value.nextOffset
      }
      return { status: 'ready', entries: [...entries.values()], metadata }
    }

    /** 直接读索引文件：CORS 或市场服务都不可用时的兜底。 */
    async function loadFromFile() {
      const response = await withTimeout(fetch(INDEX_URL, { headers: { accept: 'application/json' } }), 15000, 'fetch')
      if (!response.ok) throw new Error(`HTTP ${response.status}`)
      const document = await response.json()
      if (!Array.isArray(document?.plugins)) throw new Error('invalid index document')
      const entries = document.plugins.map((plugin) => {
        const versions = (plugin.versions ?? []).map((version) => ({
          ...version,
          install: installTargetOf(plugin, version),
          compatibility: { compatible: true }
        }))
        const stable = versions.find((version) => !String(version.version).includes('-'))
        return { ...plugin, versions, ...(stable ? { defaultVersion: stable.version } : {}), installation: { status: 'not-installed' } }
      })
      return { status: 'ready', entries, metadata: document.metadata }
    }

    /** 先试内置服务，再退到直接读文件；两条都失败才报错，并把两边的错都带上。 */
    async function loadCatalog(remote, force = false) {
      let market
      try {
        market = remote?.pluginMarket
      } catch (error) {
        console.warn(LOG, 'market service unavailable:', messageOf(error))
      }
      const errors = []
      console.info(LOG, 'load start; market service:', Boolean(market?.search), 'force:', force)
      if (market?.search) {
        try {
          return await loadFromService(market, force)
        } catch (error) {
          errors.push(`服务：${messageOf(error)}`)
          console.warn(LOG, 'service path failed:', messageOf(error))
        }
      }
      try {
        return await loadFromFile()
      } catch (error) {
        errors.push(`文件：${messageOf(error)}`)
        console.warn(LOG, 'file path failed:', messageOf(error))
      }
      return { status: 'error', error: errors.join(' ｜ ') }
    }

    function MarketPanel(props) {
      const { t } = props
      // 两个 remote 必须来自各自的 inject 作用域，否则取服务时会报 without inject。
      const marketRef = React.useRef(undefined)
      const managerRef = React.useRef(undefined)
      if (typeof props.market === 'function') marketRef.current = props.market()
      if (typeof props.manager === 'function') managerRef.current = props.manager()
      const [catalog, setCatalog] = React.useState({ status: 'loading' })
      const [query, setQuery] = React.useState('')
      const [category, setCategory] = React.useState('')
      const [busy, setBusy] = React.useState('')
      const [notice, setNotice] = React.useState(undefined)
      const [bundles, setBundles] = React.useState(new Map())

      const load = React.useCallback(async (force = false) => {
        setCatalog((current) => ({ ...current, status: current.entries ? 'ready' : 'loading' }))
        let next
        try {
          next = await loadCatalog(marketRef.current, force)
        } catch (error) {
          next = { status: 'error', error: messageOf(error) }
        }
        console.info(LOG, 'catalog:', next.status, next.entries?.length ?? 0, next.error ?? '')
        setCatalog(next)
        try {
          const answer = await managerRef.current?.pluginManager?.listBundles?.()
          const list = Array.isArray(answer) ? answer : answer?.ok ? answer.value : []
          if (Array.isArray(list)) {
            setBundles(new Map(list.map((bundle) => [bundle.name, bundle])))
          }
        } catch {
          // 没有插件管理服务时，安装状态就按索引里给的显示
        }
      }, [])

      React.useEffect(() => { void load() }, [load])

      // 结果提示 6 秒后自动消失，也能手动关掉
      React.useEffect(() => {
        if (notice === undefined) return undefined
        const timer = window.setTimeout(() => setNotice(undefined), 6000)
        return () => window.clearTimeout(timer)
      }, [notice])

      const entries = catalog.entries ?? []
      const categories = catalog.metadata?.categories ?? {}
      const needle = query.trim().toLowerCase()
      const filtered = entries.filter((entry) => {
        if (category !== '' && entry?.metadata?.category !== category) return false
        if (needle === '') return true
        const haystack = [
          entry.name,
          pick(entry.title, ''),
          pick(entry.description, ''),
          ...(entry.metadata?.keywords ?? []),
          entry.author ?? ''
        ].join(' ').toLowerCase()
        return haystack.includes(needle)
      })

      const statusOf = (entry) => {
        const installed = bundles.get(entry.name)
        if (entry.installation?.status === 'installed' || installed?.installed) return 'installed'
        if (entry.installation?.status === 'update-available') return 'update'
        if (entry.installation?.status === 'provided') return 'provided'
        return 'idle'
      }

      async function install(entry) {
        const version = entry.versions?.find((item) => item.version === entry.defaultVersion) ?? entry.versions?.[0]
        const target = version?.install
        if (!target?.spec) return setNotice({ kind: 'error', text: t('noTarget') })
        const manager = managerRef.current?.pluginManager
        if (!manager?.inspect || !manager?.installBundle) return setNotice({ kind: 'error', text: t('inspectFailed') })
        setBusy(entry.name)
        setNotice(undefined)
        try {
          const inspected = await manager.inspect(target.spec, { registry: target.registry })
          if (!inspected?.ok) throw new Error(inspected?.error?.message ?? t('inspectFailed'))
          if (inspected.value?.status === 'refused') throw new Error(inspected.value.reason ?? t('refused'))
          const { registry, selection, saveExact } = inspected.value ?? {}
          const result = await manager.installBundle(target.spec, {
            enabled: selection ?? true,
            requestId: crypto.randomUUID(),
            registry,
            ...(saveExact === undefined ? {} : { saveExact })
          })
          if (!result?.ok) throw new Error(result?.error?.message ?? t('installFailed'))
          const value = result.value ?? {}
          if (value.application === 'failed') {
            const pending = Array.isArray(value.pendingBuilds) && value.pendingBuilds.length > 0
            throw new Error(pending ? t('needsApproval') : (value.error?.message ?? t('installFailed')))
          }
          setNotice({
            kind: 'ok',
            text: `${pick(entry.title, entry.name)} · ${value.application === 'restart-required' ? t('restart') : t('installedOk')}`
          })
          await load()
        } catch (error) {
          setNotice({ kind: 'error', text: `${pick(entry.title, entry.name)} · ${messageOf(error)}` })
        } finally {
          setBusy('')
        }
      }

      const header = h('header', { className: 'dm-hero' },
        h('div', null,
          h('h1', null, t('title'), h('span', { className: 'dm-pill' }, `${entries.length} ${t('plugins')}`)),
          h('p', { className: 'dm-sub' }, t('subtitle'))),
        h('button', { className: 'dm-ghost', type: 'button', onClick: () => void load(true) },
          h(RefreshIcon), t('refresh')))

      const tools = h('div', { className: 'dm-search-wrap' },
        h(SearchIcon),
        h('input', {
          className: 'dm-search',
          type: 'search',
          value: query,
          placeholder: t('search'),
          'aria-label': t('search'),
          onChange: (event) => setQuery(event.target.value)
        }))

      const chips = Object.keys(categories).length === 0 ? null : h('div', { className: 'dm-chips' },
        h('button', {
          className: 'dm-chip', type: 'button', 'aria-pressed': category === '',
          onClick: () => setCategory('')
        }, t('all'), h('span', { className: 'dm-chip-count' }, entries.length)),
        ...Object.entries(categories).map(([id, declaration]) => h('button', {
          key: id,
          className: 'dm-chip',
          type: 'button',
          'aria-pressed': category === id,
          onClick: () => setCategory(category === id ? '' : id)
        }, pick(declaration?.title, id),
          h('span', { className: 'dm-chip-count' }, entries.filter((entry) => entry.metadata?.category === id).length))))

      const cardOf = (entry, index, hero = false) => {
        const status = statusOf(entry)
        const settled = status === 'installed' || status === 'provided'
        const downloads = sortKeyOf(entry, 'downloads')
        const stars = sortKeyOf(entry, 'stars')
        const version = entry.defaultVersion ?? entry.versions?.[0]?.version
        const title = pick(entry.title, entry.name)
        const label = busy === entry.name
          ? t('installing')
          : status === 'installed' ? t('installed')
            : status === 'update' ? t('update')
              : status === 'provided' ? t('provided')
                : t('install')
        const action = settled
          ? h('span', { className: 'dm-installed' }, `✓ ${label}`)
          : h('button', {
            className: 'dm-btn dm-btn--primary',
            type: 'button',
            disabled: busy !== '',
            onClick: () => void install(entry)
          }, label)
        const thumb = h('div', {
          className: 'dm-thumb',
          style: entry.icon ? undefined : { background: tintOf(entry.name), borderColor: 'transparent' }
        }, entry.icon
          ? h('img', {
            src: entry.icon,
            alt: '',
            loading: 'lazy',
            referrerPolicy: 'no-referrer',
            onError: (event) => { event.currentTarget.style.display = 'none' }
          })
          : String(title).slice(0, 1).toUpperCase())
        const meta = h('div', { className: 'dm-meta' },
          version ? h('span', { className: 'dm-tag' }, `v${version}`) : null,
          stars !== undefined ? h('span', { className: 'dm-tag' }, `★ ${formatCount(stars)}`) : null,
          downloads !== undefined ? h('span', { className: 'dm-tag' }, `↓ ${formatCount(downloads)}`) : null)
        const delay = { animationDelay: `${Math.min(index, 14) * 22}ms` }

        if (hero) {
          return h('article', { className: 'dm-hero-card dm-appear', key: entry.name, style: delay },
            h('div', { className: 'dm-card-top' },
              thumb,
              h('div', { className: 'dm-titles' },
                h('h3', { className: 'dm-hero-title', title }, title),
                h('code', { className: 'dm-pkg', title: entry.name }, entry.name))),
            h('p', { className: 'dm-hero-desc' }, pick(entry.description, '')),
            h('div', { className: 'dm-hero-foot' }, meta, action))
        }
        return h('article', { className: 'dm-card dm-appear', key: entry.name, style: delay },
          h('div', { className: 'dm-card-top' },
            thumb,
            h('div', { className: 'dm-titles' },
              h('h3', { className: 'dm-title', title }, title),
              h('code', { className: 'dm-pkg', title: entry.name }, entry.name))),
          h('p', { className: 'dm-desc' }, pick(entry.description, '')),
          h('div', { className: 'dm-foot' }, meta, action))
      }

      // 只有没筛选时才展示精选，否则会和下面结果重复
      const featured = needle === '' && category === '' && entries.length > 0
        ? entries
          .filter((entry) => entry.icon !== undefined)
          .slice()
          .sort((left, right) => (sortKeyOf(right, 'downloads') ?? 0) - (sortKeyOf(left, 'downloads') ?? 0))
          .slice(0, 2)
        : []
      const featuredNames = new Set(featured.map((entry) => entry.name))
      const gridEntries = filtered.filter((entry) => !featuredNames.has(entry.name))

      let body
      if (catalog.status === 'loading' && entries.length === 0) {
        body = h('div', { className: 'dm-grid' },
          ...Array.from({ length: 6 }, (_, index) => h('div', { className: 'dm-skel', key: index })))
      } else if (catalog.status === 'error') {
        body = h('div', { className: 'dm-state' },
          h('span', null, `${t('error')}：${catalog.error ?? ''}`),
          h('button', { type: 'button', onClick: () => void load(true) }, t('retry')))
      } else if (filtered.length === 0) {
        body = h('div', { className: 'dm-state' }, t('empty'))
      } else {
        body = h(React.Fragment, null,
          featured.length === 0 ? null : h('section', { className: 'dm-section' },
            h('div', { className: 'dm-section-head' }, h('span', null, t('featured'))),
            h('div', { className: 'dm-featured' }, ...featured.map((entry, index) => cardOf(entry, index, true)))),
          h('section', { className: 'dm-section' },
            h('div', { className: 'dm-section-head' },
              h('span', null, `${t('allPlugins')} · ${gridEntries.length}`)),
            h('div', { className: 'dm-grid' }, ...gridEntries.map((entry, index) => cardOf(entry, index + featured.length)))))
      }

      return h('div', { className: 'dm-root' },
        header,
        tools,
        chips,
        body,
        notice === undefined ? null : h('div', { className: `dm-toast dm-toast--${notice.kind}`, role: 'status' },
          h('span', null, notice.text),
          h('button', {
            type: 'button',
            'aria-label': t('dismissed'),
            onClick: () => setNotice(undefined)
          }, '×')))
    }

    function apply(ctx) {
      ctx.effect(() => ctx.locale.register(NS, { zh, en }), 'dsh-market-xivie: dictionaries')
      ctx.effect(() => {
        const style = document.createElement('style')
        style.textContent = STYLES
        document.head.appendChild(style)
        return () => style.remove()
      }, 'dsh-market-xivie: styles')

      const t = ctx.locale.bind(NS)

      // 取 remote 服务必须先声明注入，否则访问会被拦成 without inject。
      // 把回调里拿到的 remote 存下来给界面用；服务晚到时界面会重新渲染。
      let marketRemote
      let managerRemote
      const remoteListeners = new Set()
      const announce = () => remoteListeners.forEach(listener => listener())
      const subscribeRemote = (listener) => {
        remoteListeners.add(listener)
        return () => remoteListeners.delete(listener)
      }

      ctx.inject(['remote.pluginMarket'], (scope) => {
        marketRemote = scope.remote
        announce()
        scope.effect(() => () => {
          if (marketRemote === scope.remote) marketRemote = undefined
          announce()
        }, 'dsh-market-xivie: market remote')
      })

      ctx.inject(['remote.pluginManager'], (scope) => {
        managerRemote = scope.remote
        announce()
        scope.effect(() => () => {
          if (managerRemote === scope.remote) managerRemote = undefined
          announce()
        }, 'dsh-market-xivie: manager remote')
      })

      function SidebarIcon({ size = 16 } = {}) {
        return h('svg', {
          width: size, height: size, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor',
          strokeWidth: 1.8, strokeLinecap: 'round', strokeLinejoin: 'round', 'aria-hidden': true
        }, h('path', { d: 'M4 7h16M4 12h10M4 17h7' }))
      }

      function Market(props) {
        React.useSyncExternalStore(subscribeRemote, () => marketRemote, () => marketRemote)
        React.useSyncExternalStore(subscribeRemote, () => managerRemote, () => managerRemote)
        // 服务从「没有」变成「有」时换 key，让面板重挂载并重新读一次索引。
        return h(MarketPanel, {
          ...props,
          key: marketRemote ? 'market-ready' : 'market-pending',
          market: () => marketRemote,
          manager: () => managerRemote
        })
      }

      function SidebarPage() {
        return h('div', { className: 'dm-page' }, h(Market, { t }))
      }

      // 插件页标签：排在「已安装」「发现」之后。
      ctx.slots.inject('plugins.tab', () => ctx.slots.register({
        name: 'plugins.tab',
        id: SIDEBAR_ID,
        order: 2,
        label: () => t('title'),
        locale: NS
      }, () => h(Market, { t })))

      // 左侧导航：一行图标 + 一个全宽页面，只有宿主有这个槽时才注册。
      ctx.slots.inject('sidebar.panellist', () => {
        const offRow = ctx.slots.register({
          name: 'sidebar.panellist',
          id: SIDEBAR_ID,
          order: 2,
          label: () => t('title'),
          locale: NS
        }, SidebarIcon)
        const offPage = ctx.slots.register({ name: 'main', key: SIDEBAR_ID, locale: NS }, SidebarPage)
        return () => {
          offRow?.()
          offPage?.()
        }
      })
    }

    return { apply, inject: ['slots', 'locale', 'remote'] }
  }
})
