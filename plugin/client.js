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
.dm-root { display: flex; flex-direction: column; gap: 14px; padding: 20px 24px 40px; height: 100%; overflow: auto; }
.dm-head { display: flex; align-items: baseline; gap: 12px; flex-wrap: wrap; }
.dm-head h1 { font-size: 20px; font-weight: 600; margin: 0; }
.dm-head p { margin: 0; font-size: 12px; opacity: .6; }
.dm-tools { display: flex; gap: 8px; align-items: center; flex-wrap: wrap; }
.dm-search { flex: 1 1 220px; min-width: 180px; padding: 7px 10px; border-radius: 8px; border: 1px solid var(--dsh-border, rgba(127,127,127,.28)); background: transparent; color: inherit; font: inherit; }
.dm-search:focus { outline: 2px solid var(--dsh-accent, #4d6bfe); outline-offset: -1px; }
.dm-refresh { padding: 7px 12px; border-radius: 8px; border: 1px solid var(--dsh-border, rgba(127,127,127,.28)); background: transparent; color: inherit; cursor: pointer; font: inherit; }
.dm-chips { display: flex; gap: 6px; flex-wrap: wrap; }
.dm-chip { padding: 4px 10px; border-radius: 999px; border: 1px solid var(--dsh-border, rgba(127,127,127,.28)); background: transparent; color: inherit; cursor: pointer; font-size: 12px; }
.dm-chip[aria-pressed="true"] { background: var(--dsh-accent, #4d6bfe); border-color: transparent; color: #fff; }
.dm-list { display: flex; flex-direction: column; gap: 10px; }
.dm-card { display: flex; gap: 12px; align-items: flex-start; padding: 12px 14px; border-radius: 12px; border: 1px solid var(--dsh-border, rgba(127,127,127,.22)); }
.dm-card:hover { border-color: var(--dsh-accent, #4d6bfe); }
.dm-icon { width: 38px; height: 38px; border-radius: 10px; flex: none; display: grid; place-items: center; overflow: hidden; background: rgba(127,127,127,.12); font-weight: 600; font-size: 15px; }
.dm-icon img { width: 100%; height: 100%; object-fit: contain; }
.dm-body { flex: 1 1 auto; min-width: 0; }
.dm-name { display: flex; align-items: baseline; gap: 8px; flex-wrap: wrap; }
.dm-name strong { font-size: 14px; font-weight: 600; }
.dm-name code { font-size: 11px; opacity: .55; }
.dm-desc { font-size: 12.5px; opacity: .75; margin: 3px 0 0; line-height: 1.5; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
.dm-meta { display: flex; gap: 10px; flex-wrap: wrap; font-size: 11.5px; opacity: .55; margin-top: 6px; }
.dm-actions { flex: none; display: flex; flex-direction: column; gap: 6px; align-items: flex-end; }
.dm-install { padding: 6px 14px; border-radius: 8px; border: 1px solid var(--dsh-border, rgba(127,127,127,.28)); background: transparent; color: inherit; cursor: pointer; font: inherit; font-size: 12.5px; white-space: nowrap; }
.dm-install:hover { border-color: var(--dsh-accent, #4d6bfe); color: var(--dsh-accent, #4d6bfe); }
.dm-install[disabled] { cursor: default; opacity: .55; }
.dm-state { padding: 28px 4px; font-size: 13px; opacity: .65; display: flex; gap: 10px; align-items: center; }
.dm-state button { padding: 5px 12px; border-radius: 8px; border: 1px solid var(--dsh-border, rgba(127,127,127,.28)); background: transparent; color: inherit; cursor: pointer; font: inherit; }
.dm-notice { font-size: 12.5px; padding: 8px 12px; border-radius: 8px; background: rgba(127,127,127,.12); }
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
      const [notice, setNotice] = React.useState('')
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

      const versionsLabel = (entry) => {
        const count = entry.versions?.length ?? 0
        return count > 1 ? h('span', null, `${count} ${t('versions')}`) : null
      }

      const statusOf = (entry) => {
        const installed = bundles.get(entry.name)
        if (entry.installation?.status === 'installed' || installed?.installed) return 'installed'
        if (entry.installation?.status === 'update-available') return 'update'
        if (entry.installation?.status === 'provided') return 'provided'
        return 'idle'
      }

      async function install(entry) {
        const version = entry.versions?.find((item) => item.version === entry.defaultVersion) ?? entry.versions?.[0]
        const install = version?.install
        if (!install?.spec) return setNotice(t('noTarget'))
        if (!window.confirm(`${pick(entry.title, entry.name)}\n${install.spec}\n\n${t('confirm')}`)) return
        const manager = managerRef.current?.pluginManager
        if (!manager?.inspect || !manager?.installBundle) return setNotice(t('inspectFailed'))
        setBusy(entry.name)
        setNotice('')
        try {
          const inspected = await manager.inspect(install.spec, { registry: install.registry })
          if (!inspected?.ok) return setNotice(inspected?.error?.message ?? t('inspectFailed'))
          if (inspected.value?.status === 'refused') return setNotice(inspected.value.reason ?? t('refused'))
          const { registry, selection, saveExact } = inspected.value ?? {}
          const result = await manager.installBundle(install.spec, {
            enabled: selection ?? true,
            requestId: crypto.randomUUID(),
            registry,
            ...(saveExact === undefined ? {} : { saveExact })
          })
          if (!result?.ok) return setNotice(result?.error?.message ?? t('installFailed'))
          setNotice(result.value?.application === 'restart-required' ? t('restart') : t('done'))
          await load()
        } catch (error) {
          setNotice(error?.message ?? String(error))
        } finally {
          setBusy('')
        }
      }

      const header = h('div', { className: 'dm-head' },
        h('h1', null, t('title')),
        h('p', null, `${t('subtitle')} · ${entries.length} ${t('plugins')}`))

      const tools = h('div', { className: 'dm-tools' },
        h('input', {
          className: 'dm-search',
          type: 'search',
          value: query,
          placeholder: t('search'),
          'aria-label': t('search'),
          onChange: (event) => setQuery(event.target.value)
        }),
        h('button', { className: 'dm-refresh', type: 'button', onClick: () => void load(true) }, t('refresh')))

      const chips = Object.keys(categories).length === 0 ? null : h('div', { className: 'dm-chips' },
        h('button', {
          className: 'dm-chip', type: 'button', 'aria-pressed': category === '',
          onClick: () => setCategory('')
        }, t('all')),
        ...Object.entries(categories).map(([id, declaration]) => h('button', {
          key: id,
          className: 'dm-chip',
          type: 'button',
          'aria-pressed': category === id,
          onClick: () => setCategory(category === id ? '' : id)
        }, pick(declaration?.title, id))))

      let body
      if (catalog.status === 'loading' && entries.length === 0) {
        body = h('div', { className: 'dm-state' }, t('loading'))
      } else if (catalog.status === 'error') {
        body = h('div', { className: 'dm-state' },
          `${t('error')}：${catalog.error ?? ''}`,
          h('button', { type: 'button', onClick: () => void load() }, t('retry')))
      } else if (filtered.length === 0) {
        body = h('div', { className: 'dm-state' }, t('empty'))
      } else {
        body = h('div', { className: 'dm-list' }, ...filtered.map((entry) => {
          const status = statusOf(entry)
          const downloads = sortKeyOf(entry, 'downloads')
          const stars = sortKeyOf(entry, 'stars')
          const version = entry.defaultVersion ?? entry.versions?.[0]?.version
          const label = busy === entry.name
            ? t('installing')
            : status === 'installed' ? t('installed') : status === 'update' ? t('update') : status === 'provided' ? t('provided') : t('install')
          return h('div', { className: 'dm-card', key: entry.name },
            h('div', { className: 'dm-icon' },
              entry.icon
                ? h('img', {
                  src: entry.icon,
                  alt: '',
                  loading: 'lazy',
                  referrerPolicy: 'no-referrer',
                  onError: (event) => { event.currentTarget.style.display = 'none' }
                })
                : String(pick(entry.title, entry.name)).slice(0, 1).toUpperCase()),
            h('div', { className: 'dm-body' },
              h('div', { className: 'dm-name' },
                h('strong', null, pick(entry.title, entry.name)),
                h('code', null, entry.name)),
              h('p', { className: 'dm-desc' }, pick(entry.description, '')),
              h('div', { className: 'dm-meta' },
                version ? h('span', null, `v${version}`) : null,
                entry.author ? h('span', null, entry.author) : null,
                stars !== undefined ? h('span', null, `★ ${formatCount(stars)}`) : null,
                downloads !== undefined ? h('span', null, `↓ ${formatCount(downloads)}`) : null,
                versionsLabel(entry))),
            h('div', { className: 'dm-actions' },
              h('button', {
                className: 'dm-install',
                type: 'button',
                disabled: status === 'installed' || status === 'provided' || busy !== '',
                onClick: () => void install(entry)
              }, label)))
        }))
      }

      return h('div', { className: 'dm-root' },
        header,
        tools,
        chips,
        notice === '' ? null : h('div', { className: 'dm-notice' }, notice),
        body)
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
