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
      featuredShort: '本期精选',
      headline: '好工具，让灵感走得更远。',
      catalogTitle: '探索全部',
      viewDetails: '查看详情',
      get: '获取 +',
      added: '已添加',
      community: '社区插件',
      miniTheme: '给工作空间换一种心情',
      miniThemeSub: '外观与主题插件',
      miniWorkflow: '少一点重复，多一点心流',
      miniWorkflowSub: '工作流与效率工具',
      allPlugins: '全部插件',
      background: '背景',
      preset: '配色',
      customImage: '自定义图片地址',
      apply: '应用',
      close: '关闭',
      author: '作者',
      category: '分类',
      repo: '仓库',
      homepage: '主页',
      versionLabel: '版本',
      updated: '更新',
      sortBy: '排序',
      sortIndex: '推荐排序',
      sortDownloads: '下载最多',
      sortStars: '星数最多',
      sortName: '按名称',
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
      featuredShort: "Editor's pick",
      headline: 'Good tools take ideas further.',
      catalogTitle: 'Browse all',
      viewDetails: 'View details',
      get: 'Get +',
      added: 'Added',
      community: 'Community',
      miniTheme: 'Change the mood of your workspace',
      miniThemeSub: 'Themes and appearance',
      miniWorkflow: 'Less repetition, more flow',
      miniWorkflowSub: 'Workflows and productivity',
      allPlugins: 'All plugins',
      background: 'Background',
      preset: 'Palette',
      customImage: 'Image URL',
      apply: 'Apply',
      close: 'Close',
      author: 'Author',
      category: 'Category',
      repo: 'Repo',
      homepage: 'Home',
      versionLabel: 'Versions',
      updated: 'Updated',
      sortBy: 'Sort',
      sortIndex: 'Recommended',
      sortDownloads: 'Most downloaded',
      sortStars: 'Most starred',
      sortName: 'Name',
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
.dm-root {
  color-scheme: light dark;
  --dm-accent: var(--dsh-accent, #4d6bfe);
  /* DSH 若提供 --dsh-bg 就用它，否则退回系统色 Canvas */
  --dm-bg: var(--dsh-bg, Canvas);
  --dm-surface: color-mix(in srgb, CanvasText 5%, Canvas);
  --dm-text: CanvasText;
  --dm-muted: color-mix(in srgb, CanvasText 68%, Canvas);
  --dm-soft: color-mix(in srgb, CanvasText 5%, Canvas);
  --dm-line: var(--dsh-border, color-mix(in srgb, CanvasText 14%, Canvas));
  --dm-ink: color-mix(in srgb, CanvasText 72%, var(--dm-accent));
  --dm-tint: color-mix(in srgb, var(--dm-accent) 9%, Canvas);
  box-sizing: border-box; display: flex; flex-direction: column; gap: 22px;
  width: 100%; max-width: 1280px; height: 100%; min-width: 0; margin: 0 auto;
  padding: 36px 32px 64px; overflow: auto; color: var(--dm-text);
  background: radial-gradient(ellipse 85% 280px at 15% 0, color-mix(in srgb, var(--dm-accent) 7%, transparent), transparent 80%), var(--dm-bg);
  font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", "PingFang SC", "Microsoft YaHei", sans-serif;
  font-size: 13px; line-height: 1.5; -webkit-font-smoothing: antialiased;
  scrollbar-color: color-mix(in srgb, CanvasText 24%, Canvas) transparent; scrollbar-width: thin;
}
.dm-root *, .dm-root *::before, .dm-root *::after { box-sizing: border-box; }
[data-theme="dark"] .dm-root, [data-color-scheme="dark"] .dm-root, .dark .dm-root, .dm-root[data-theme="dark"] { color-scheme: dark; }
[data-theme="light"] .dm-root, [data-color-scheme="light"] .dm-root, .light .dm-root, .dm-root[data-theme="light"] { color-scheme: light; }
.dm-root button, .dm-root input, .dm-root select { font: inherit; }
.dm-root button { -webkit-tap-highlight-color: transparent; }
.dm-root :where(button, input, select, a, [tabindex]):focus-visible { outline: 2px solid var(--dm-ink); outline-offset: 4px; }
.dm-hero { display: flex; align-items: flex-start; justify-content: space-between; gap: 20px; }
.dm-hero > div:first-child { min-width: 0; }
.dm-hero h1 { display: flex; flex-wrap: wrap; align-items: center; gap: 12px; margin: 0; color: var(--dm-text); font-size: 28px; font-weight: 700; line-height: 1.3; letter-spacing: -.045em; }
.dm-pill { padding: 4px 9px; border: 1px solid color-mix(in srgb, var(--dm-accent) 18%, Canvas); border-radius: 8px; background: var(--dm-tint); color: var(--dm-ink); font-size: 11px; font-weight: 600; line-height: 1.5; letter-spacing: 0; white-space: nowrap; }
.dm-sub { margin: 9px 0 0; color: var(--dm-muted); font-size: 13px; line-height: 1.7; }
.dm-ghost, .dm-state button, .dm-bgrow button { display: inline-flex; align-items: center; justify-content: center; gap: 7px; min-height: 36px; padding: 7px 12px; border: 1px solid var(--dm-line); border-radius: 10px; background: var(--dm-bg); color: var(--dm-muted); font-size: 12px; font-weight: 500; white-space: nowrap; cursor: pointer; transition: background .16s ease, border-color .16s ease, color .16s ease; }
.dm-ghost:hover, .dm-state button:hover, .dm-bgrow button:hover { border-color: color-mix(in srgb, var(--dm-accent) 45%, var(--dm-line)); background: var(--dm-tint); color: var(--dm-ink); }
.dm-ghost[aria-expanded="true"] { background: var(--dm-tint); color: var(--dm-ink); }
.dm-tools, .dm-tools-row { display: flex; align-items: center; gap: 12px; min-width: 0; }
.dm-tools-row { flex-wrap: wrap; justify-content: space-between; }
.dm-search-wrap { position: relative; display: flex; align-items: center; flex: 1 1 auto; min-width: 0; max-width: none; }
.dm-search-wrap svg { position: absolute; left: 15px; color: var(--dm-muted); pointer-events: none; }
.dm-search, .dm-select, .dm-bgpop input { min-width: 0; min-height: 44px; border: 1px solid var(--dm-line); border-radius: 12px; background: var(--dm-bg); color: var(--dm-text); transition: border-color .16s ease, box-shadow .16s ease; }
.dm-search { width: 100%; padding: 11px 15px 11px 42px; font-size: 13px; }
.dm-search::placeholder, .dm-bgpop input::placeholder { color: var(--dm-muted); opacity: 1; }
.dm-search:focus, .dm-select:focus, .dm-bgpop input:focus { border-color: var(--dm-ink); outline: 2px solid color-mix(in srgb, var(--dm-accent) 24%, transparent); outline-offset: 2px; }
.dm-select { flex: 0 0 auto; max-width: 45%; padding: 10px 14px; font-size: 12px; cursor: pointer; }
.dm-select option { background: var(--dm-bg); color: var(--dm-text); }
.dm-chips { display: flex; flex-wrap: wrap; gap: 8px; padding-bottom: 20px; border-bottom: 1px solid var(--dm-line); }
.dm-chip { display: inline-flex; align-items: center; justify-content: center; min-height: 33px; padding: 6px 11px; border: 1px solid transparent; border-radius: 9px; background: var(--dm-soft); color: var(--dm-muted); font-size: 12px; font-weight: 500; cursor: pointer; transition: background .16s ease, border-color .16s ease, color .16s ease; }
.dm-chip:hover { background: var(--dm-tint); color: var(--dm-ink); }
.dm-chip[aria-pressed="true"] { border-color: color-mix(in srgb, var(--dm-accent) 28%, Canvas); background: var(--dm-tint); color: var(--dm-ink); font-weight: 650; }
.dm-chip-count { margin-left: 7px; color: var(--dm-muted); font-size: 11px; font-weight: 400; font-variant-numeric: tabular-nums; }
.dm-chip[aria-pressed="true"] .dm-chip-count { color: inherit; }
.dm-main, .dm-section { display: flex; flex-direction: column; min-width: 0; }
.dm-main { gap: 28px; }
.dm-section { gap: 13px; }
.dm-section-head { display: flex; align-items: center; gap: 9px; min-height: 22px; }
.dm-section-head::before { content: ""; width: 5px; height: 5px; flex: none; border-radius: 50%; background: var(--dm-ink); }
.dm-section-head span { color: var(--dm-muted); font-size: 12px; font-weight: 650; letter-spacing: .02em; }
.dm-eyebrow { color: var(--dm-muted); font-size: 11px; font-weight: 600; letter-spacing: .08em; text-transform: uppercase; }
.dm-featured { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 16px; }
.dm-hero-card { position: relative; display: flex; align-items: center; gap: 18px; min-width: 0; min-height: 150px; padding: 23px; border: 1px solid var(--dm-line); border-radius: 18px; background: radial-gradient(ellipse at 100% 0, color-mix(in srgb, var(--dm-accent) 11%, transparent), transparent 72%), var(--dm-surface); cursor: pointer; transition: border-color .18s ease, box-shadow .18s ease; }
.dm-hero-main { position: relative; display: flex; flex: 1 1 auto; flex-direction: column; gap: 12px; min-width: 0; }
.dm-hero-side { position: relative; display: flex; flex: none; flex-direction: column; align-items: flex-end; gap: 10px; }
.dm-hero-card .dm-thumb { width: 54px; height: 54px; border-radius: 14px; font-size: 22px; }
.dm-hero-title { margin: 0; overflow: hidden; color: var(--dm-text); font-size: 17px; font-weight: 650; line-height: 1.5; letter-spacing: -.025em; text-overflow: ellipsis; white-space: nowrap; }
.dm-hero-desc, .dm-desc { display: -webkit-box; margin: 0; overflow: hidden; color: var(--dm-muted); font-size: 13px; line-height: 1.75; overflow-wrap: anywhere; -webkit-line-clamp: 2; -webkit-box-orient: vertical; }
.dm-hero-foot { display: flex; align-items: center; justify-content: space-between; gap: 10px; }
.dm-grid { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 14px; min-width: 0; }
.dm-card { display: flex; flex-direction: column; gap: 13px; min-width: 0; min-height: 164px; padding: 20px; border: 1px solid var(--dm-line); border-radius: 16px; background: var(--dm-surface); cursor: pointer; transition: border-color .18s ease, box-shadow .18s ease; }
.dm-card-top { display: flex; align-items: center; gap: 12px; min-width: 0; }
.dm-thumb { display: grid; place-items: center; flex: none; width: 46px; height: 46px; overflow: hidden; border: 1px solid var(--dm-line); border-radius: 12px; background: var(--dm-soft); color: var(--dm-text); font-size: 18px; font-weight: 650; }
.dm-thumb img { display: block; width: 100%; height: 100%; object-fit: contain; }
.dm-titles { display: flex; flex: 1 1 auto; flex-direction: column; gap: 4px; min-width: 0; }
.dm-title { margin: 0; overflow: hidden; color: var(--dm-text); font-size: 14px; font-weight: 650; line-height: 1.5; text-overflow: ellipsis; white-space: nowrap; }
.dm-pkg { display: block; min-width: 0; overflow: hidden; color: var(--dm-muted); font-family: ui-monospace, SFMono-Regular, Consolas, monospace; font-size: 10.5px; line-height: 1.5; text-overflow: ellipsis; white-space: nowrap; }
.dm-desc { min-height: 0; }
.dm-foot { display: flex; align-items: center; justify-content: space-between; gap: 10px; margin-top: auto; }
.dm-meta { display: flex; flex-wrap: wrap; align-items: center; gap: 5px; min-width: 0; color: var(--dm-muted); font-size: 10.5px; font-variant-numeric: tabular-nums; }
.dm-tag { max-width: 100%; padding: 3px 7px; overflow: hidden; border-radius: 5px; background: var(--dm-soft); line-height: 1.4; text-overflow: ellipsis; white-space: nowrap; }
.dm-btn { display: inline-flex; align-items: center; justify-content: center; flex: none; min-height: 33px; padding: 6px 16px; border: 1px solid var(--dm-line); border-radius: 9px; background: var(--dm-soft); color: var(--dm-text); font-size: 12px; font-weight: 650; line-height: 1.5; white-space: nowrap; cursor: pointer; transition: background .16s ease, border-color .16s ease; }
.dm-btn--primary { border-color: color-mix(in srgb, var(--dm-accent) 22%, Canvas); background: var(--dm-tint); color: var(--dm-ink); }
.dm-btn--primary:hover:not(:disabled) { border-color: var(--dm-ink); background: color-mix(in srgb, var(--dm-accent) 16%, Canvas); }
.dm-btn:active:not(:disabled) { background: color-mix(in srgb, var(--dm-accent) 23%, Canvas); }
.dm-btn:disabled { border-style: dashed; color: var(--dm-muted); cursor: wait; }
.dm-installed { display: inline-flex; align-items: center; justify-content: center; flex: none; gap: 5px; min-height: 33px; padding: 6px 10px; border-radius: 9px; background: var(--dm-soft); color: var(--dm-muted); font-size: 11px; white-space: nowrap; }
.dm-hero-card .dm-btn { min-height: 38px; padding: 8px 18px; }
.dm-card[aria-current="true"], .dm-hero-card[aria-current="true"] { border-color: var(--dm-ink); box-shadow: inset 0 0 0 1px var(--dm-ink); }
@media (hover: hover) {
  .dm-card:hover, .dm-hero-card:hover { border-color: color-mix(in srgb, var(--dm-accent) 45%, var(--dm-line)); box-shadow: 0 8px 28px rgb(16 24 48 / 6%); }
  /* 卡片内部的错位微动效：图标先动，文字后动，徽章再延迟一点 */
  .dm-card:hover .dm-thumb { transform: translateY(-3px) scale(1.06); box-shadow: 0 8px 18px rgb(16 24 48 / 14%); }
  .dm-card:hover .dm-title { transform: translateX(2px); }
  .dm-card:hover .dm-tag { transform: translateY(-2px); }
}
.dm-thumb, .dm-title, .dm-tag { transition: transform .2s cubic-bezier(.2,.7,.3,1), box-shadow .2s ease; }
.dm-state { display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 16px; min-height: 240px; padding: 40px 20px; color: var(--dm-muted); text-align: center; overflow-wrap: anywhere; }
.dm-skel { min-width: 0; height: 192px; border: 1px solid var(--dm-line); border-radius: 16px; background: linear-gradient(100deg, var(--dm-soft) 30%, color-mix(in srgb, CanvasText 9%, Canvas) 45%, var(--dm-soft) 60%); background-size: 250% 100%; animation: dm-shimmer 2s ease-in-out infinite; }
.dm-mask { position: fixed; inset: 0; z-index: 70; background: rgb(16 20 32 / 32%); animation: dm-fade .16s ease-out; }
.dm-detail { position: fixed; inset: 0 0 0 auto; z-index: 71; display: flex; flex-direction: column; gap: 24px; width: 440px; max-width: 100vw; min-width: 0; padding: 24px; overflow-x: hidden; overflow-y: auto; overscroll-behavior: contain; scrollbar-gutter: stable; scroll-padding-top: 112px; border-left: 1px solid var(--dm-line); background: var(--dm-bg); color: var(--dm-text); box-shadow: -16px 0 64px rgb(16 20 32 / 16%); animation: dm-slide .2s ease-out; }
.dm-detail > * { flex-shrink: 0; min-width: 0; }
.dm-detail-head { position: sticky; top: -24px; z-index: 3; display: flex; align-items: center; gap: 12px; margin: -24px -24px 0; padding: 24px; border-bottom: 1px solid var(--dm-line); background: var(--dm-bg); }
.dm-detail-head .dm-thumb { width: 52px; height: 52px; border-radius: 14px; font-size: 22px; }
.dm-detail h2 { margin: 0; color: var(--dm-text); font-size: 17px; font-weight: 650; line-height: 1.5; overflow-wrap: anywhere; }
.dm-close { display: grid; place-items: center; flex: 0 0 34px; width: 34px; height: 34px; margin-left: auto; padding: 0; border: 1px solid var(--dm-line); border-radius: 10px; background: var(--dm-soft); color: var(--dm-text); font-size: 23px; line-height: 1; cursor: pointer; transition: background .16s ease; }
.dm-close:hover { background: var(--dm-tint); }
.dm-detail-desc { margin: 0; color: var(--dm-muted); font-size: 13px; line-height: 1.9; white-space: pre-wrap; overflow-wrap: anywhere; }
.dm-detail-rows { display: flex; flex-direction: column; gap: 0; padding: 4px 0; border-top: 1px solid var(--dm-line); border-bottom: 1px solid var(--dm-line); font-size: 12px; }
.dm-detail-row { display: flex; align-items: baseline; gap: 16px; min-width: 0; padding: 9px 0; line-height: 1.7; }
.dm-detail-row > span:first-child { flex: 0 0 52px; color: var(--dm-muted); }
.dm-detail-row > :last-child { min-width: 0; overflow-wrap: anywhere; }
.dm-detail-row a { color: var(--dm-ink); text-decoration: none; text-underline-offset: 3px; }
.dm-detail-row a:hover { text-decoration: underline; }
.dm-versions { display: flex; flex-direction: column; gap: 6px; max-height: none; overflow: visible; }
.dm-version { display: flex; justify-content: space-between; gap: 14px; min-width: 0; padding: 10px 12px; border: 1px solid transparent; border-radius: 8px; background: var(--dm-soft); color: var(--dm-text); font-size: 11.5px; font-variant-numeric: tabular-nums; }
.dm-version:first-child { border-color: color-mix(in srgb, var(--dm-accent) 20%, Canvas); background: var(--dm-tint); }
.dm-version span { min-width: 0; overflow-wrap: anywhere; }
.dm-version em { flex: none; color: var(--dm-muted); font-style: normal; }
.dm-detail-foot { position: sticky; bottom: -24px; z-index: 2; display: flex; align-items: center; justify-content: space-between; gap: 16px; margin: auto -24px -24px; padding: 18px 24px max(18px, env(safe-area-inset-bottom)); border-top: 1px solid var(--dm-line); background: var(--dm-bg); }
.dm-detail-foot .dm-btn { min-width: 92px; min-height: 40px; }
.dm-toast { position: fixed; right: 24px; bottom: 24px; z-index: 90; display: flex; align-items: center; gap: 14px; max-width: min(440px, calc(100vw - 32px)); padding: 14px 16px; border: 1px solid var(--dm-line); border-radius: 13px; background: var(--dm-bg); color: var(--dm-text); box-shadow: 0 12px 40px rgb(16 20 32 / 18%); font-size: 12px; animation: dm-rise .18s ease-out; }
.dm-toast > span { min-width: 0; overflow-wrap: anywhere; }
.dm-toast--error { border-left: 3px solid color-mix(in srgb, #db5050 65%, CanvasText); }
.dm-toast button { display: grid; place-items: center; flex: 0 0 28px; width: 28px; height: 28px; padding: 0; border: 0; border-radius: 7px; background: var(--dm-soft); color: var(--dm-text); font-size: 18px; cursor: pointer; }
.dm-bgpop { position: absolute; top: calc(100% + 10px); right: 0; z-index: 40; display: flex; flex-direction: column; gap: 13px; width: 280px; max-width: calc(100vw - 32px); padding: 18px; border: 1px solid var(--dm-line); border-radius: 14px; background: var(--dm-bg); color: var(--dm-text); box-shadow: 0 12px 36px rgb(16 20 32 / 14%); }
.dm-bgpop-label { color: var(--dm-muted); font-size: 11px; font-weight: 600; }
.dm-swatches { display: flex; gap: 10px; padding: 3px; }
.dm-swatch { width: 34px; height: 34px; padding: 0; border: 1px solid var(--dm-line); border-radius: 9px; cursor: pointer; }
.dm-swatch[aria-pressed="true"] { outline: 2px solid var(--dm-ink); outline-offset: 3px; }
.dm-swatch--aurora { background: linear-gradient(135deg, #4d6bfe, #a78bfa); }
.dm-swatch--paper { background: linear-gradient(135deg, #edbf8a, #e99898); }
.dm-swatch--mint { background: linear-gradient(135deg, #65c9b1, #81b8e8); }
.dm-swatch--none { background: repeating-linear-gradient(45deg, var(--dm-soft) 0 5px, var(--dm-line) 5px 10px); }
.dm-bgrow { display: flex; gap: 8px; min-width: 0; }
.dm-bgpop input { width: 100%; min-height: 36px; padding: 7px 10px; font-size: 12px; }
.dm-bgrow button { flex: none; }
.dm-root[data-bg="paper"] { background: radial-gradient(ellipse 85% 280px at 15% 0, rgb(225 160 105 / 10%), transparent 80%), var(--dm-bg); }
.dm-root[data-bg="mint"] { background: radial-gradient(ellipse 85% 280px at 15% 0, rgb(60 180 155 / 9%), transparent 80%), var(--dm-bg); }
.dm-root[data-bg="none"] { background: var(--dm-bg); }
.dm-page { height: 100%; min-width: 0; overflow: auto; }
.dm-page .dm-root { height: auto; min-height: 100%; overflow: visible; }
.dm-appear { animation: dm-rise .2s ease-out backwards; animation-delay: 0ms !important; }
@keyframes dm-rise { from { opacity: 0; } to { opacity: 1; } }
@keyframes dm-fade { from { opacity: 0; } to { opacity: 1; } }
@keyframes dm-slide { from { transform: translateX(24px); opacity: 0; } to { transform: translateX(0); opacity: 1; } }
@keyframes dm-shimmer { from { background-position: 150% 0; } to { background-position: -100% 0; } }
@media (max-width: 999px) {
  .dm-root { padding: 28px 24px 48px; }
  .dm-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
  .dm-hero-card { align-items: flex-start; flex-direction: column; gap: 16px; padding: 20px; }
  .dm-hero-main { width: 100%; }
  .dm-hero-side { align-self: flex-end; }
}
@media (max-width: 600px) {
  .dm-root { gap: 20px; padding: 24px 16px 40px; }
  .dm-hero { flex-wrap: wrap; gap: 16px; }
  .dm-hero h1 { font-size: 25px; }
  .dm-hero > div:last-child { margin-left: auto; }
  .dm-tools { gap: 8px; }
  .dm-select { max-width: 42%; padding-inline: 8px; }
  .dm-chips { gap: 7px; padding-bottom: 16px; }
  .dm-chip { padding-inline: 9px; }
  .dm-grid, .dm-featured { grid-template-columns: minmax(0, 1fr); gap: 12px; }
  .dm-card { min-height: 180px; padding: 18px; }
  .dm-hero-card { min-height: 0; }
  .dm-detail { padding: 20px; }
  .dm-detail-head { top: -20px; margin: -20px -20px 0; padding: 20px; }
  .dm-detail-foot { bottom: -20px; margin: auto -20px -20px; padding-inline: 20px; }
  .dm-toast { right: 16px; bottom: 16px; }
}
@media (prefers-reduced-motion: reduce) {
  .dm-root *, .dm-root *::before, .dm-root *::after { animation: none !important; transition: none !important; scroll-behavior: auto !important; }
}
@media (forced-colors: active) {
  .dm-card[aria-current="true"], .dm-hero-card[aria-current="true"], .dm-chip[aria-pressed="true"] { outline: 2px solid Highlight; outline-offset: -2px; }
  .dm-mask { background: CanvasText; opacity: .35; }
}
`
    // ── 品牌视觉层：移植自概念稿（暖白底 + 深绿主视觉 + 酸绿 CTA） ──────────────
    const STYLES_BRAND = `
.dm-root {
  --bg: #f5f6f2; --panel: #fff; --text: #182b27; --muted: #78827c; --line: #e4e8e1;
  --accent: #246b51; --tint: #e9f2e7; --lime: #d5f48b; --hero: #153f32;
  background: var(--bg); color: var(--text); max-width: 1200px; gap: 26px;
  padding: 30px 34px 64px; font-size: 14px; line-height: 1.6;
}
@media (prefers-color-scheme: dark) {
  .dm-root { --bg: #141c19; --panel: #1b2621; --text: #e6eee7; --muted: #a0afa4;
    --line: #304038; --accent: #b4dcaa; --tint: #2c4033; --lime: #cbe88f; --hero: #123a2d; }
}
.dm-root h1, .dm-root h2, .dm-root h3 { letter-spacing: -.02em; }
.dm-eyebrow { color: var(--muted); font-size: 11px; font-weight: 600; letter-spacing: .16em; text-transform: uppercase; }
.dm-heading { display: flex; align-items: flex-end; justify-content: space-between; gap: 20px; }
.dm-heading h1 { margin: 10px 0 6px; font-size: 34px; font-weight: 800; line-height: 1.25; }
.dm-heading p { margin: 0; color: var(--muted); font-size: 13.5px; }
.dm-total { flex: none; color: var(--muted); font-size: 12px; }

/* 精选横幅 */
.dm-banner { position: relative; display: grid; grid-template-columns: 1.15fr .85fr; gap: 24px;
  padding: 34px 38px; border-radius: 22px; background: var(--hero); color: #eef4ee; overflow: hidden; }
.dm-banner-label { display: flex; align-items: center; gap: 8px; color: rgba(238,244,238,.62);
  font-size: 10.5px; font-weight: 600; letter-spacing: .14em; text-transform: uppercase; }
.dm-banner-label i { width: 6px; height: 6px; border-radius: 50%; background: var(--lime); }
.dm-banner h2 { margin: 16px 0 12px; font-size: 32px; font-weight: 750; line-height: 1.28; color: #fff; }
.dm-banner h2 em { font-style: normal; color: var(--lime); }
.dm-banner p { margin: 0; max-width: 34em; color: rgba(238,244,238,.72); font-size: 13px; line-height: 1.7; }
.dm-banner-cta { margin-top: 20px; display: inline-flex; align-items: center; gap: 8px;
  padding: 11px 20px; border: 0; border-radius: 12px; background: var(--lime); color: #153f32;
  font-size: 13px; font-weight: 650; cursor: pointer; transition: filter .15s, transform .1s; }
.dm-banner-cta:hover { filter: brightness(1.05); }
.dm-banner-cta:active { transform: translateY(1px); }
.dm-art { position: relative; min-height: 190px; }
.dm-art::before, .dm-art::after { content: ""; position: absolute; inset: 50% auto auto 50%;
  border: 1px solid rgba(213,244,139,.22); border-radius: 50%; transform: translate(-50%, -50%); }
.dm-art::before { width: 300px; height: 300px; }
.dm-art::after { width: 190px; height: 190px; }
.dm-art-core { position: absolute; inset: 50% auto auto 50%; width: 102px; height: 102px;
  transform: translate(-50%, -50%) rotate(-6deg); border-radius: 26px;
  background: linear-gradient(160deg, #2f7a5c, #1c5340); box-shadow: 0 18px 40px rgba(0,0,0,.35);
  display: grid; place-items: center; overflow: hidden; }
.dm-art-core img { width: 54px; height: 54px; object-fit: contain; }
.dm-art-glyph { color: var(--lime); font-size: 40px; line-height: 1; }
.dm-art-tag { position: absolute; display: inline-flex; align-items: center; gap: 7px;
  padding: 8px 12px; border: 1px solid rgba(213,244,139,.18); border-radius: 11px;
  background: rgba(255,255,255,.05); color: rgba(238,244,238,.86); font-size: 11.5px; white-space: nowrap; }
.dm-art-tag b { color: var(--lime); }
.dm-art-tag.one { top: 4%; left: 2%; }
.dm-art-tag.two { top: 30%; right: -4%; }
.dm-art-tag.three { bottom: 6%; left: 10%; }
.dm-art-index { position: absolute; right: 0; bottom: 0; color: rgba(238,244,238,.4);
  font-size: 11px; letter-spacing: .14em; }

/* 两枚编辑式入口 */
.dm-minis { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 14px; }
.dm-mini { display: flex; align-items: center; gap: 14px; padding: 18px 20px; text-align: left;
  border: 1px solid var(--line); border-radius: 16px; background: var(--panel); cursor: pointer;
  transition: border-color .16s, box-shadow .16s; }
.dm-mini:hover { border-color: color-mix(in srgb, var(--accent) 35%, var(--line)); box-shadow: 0 8px 22px rgba(24,43,39,.06); }
.dm-mini-icon { display: grid; place-items: center; flex: none; width: 44px; height: 44px;
  border-radius: 12px; background: var(--tint); color: var(--accent); font-size: 20px; }
.dm-mini strong { display: block; font-size: 14px; font-weight: 650; }
.dm-mini p { margin: 2px 0 0; color: var(--muted); font-size: 12px; }
.dm-mini-arrow { margin-left: auto; color: var(--muted); font-size: 17px; }

/* 目录头 */
.dm-catalog-head { display: flex; align-items: center; justify-content: space-between; gap: 18px; margin-bottom: 14px; }
.dm-catalog-head h2 { margin: 0; font-size: 21px; font-weight: 750; }
.dm-catalog-head small { margin-left: 8px; color: var(--muted); font-size: 12px; font-weight: 500; }
.dm-search, .dm-select { min-height: 40px; border: 1px solid var(--line); border-radius: 11px;
  background: var(--panel); color: var(--text); }
.dm-search { padding-left: 38px; font-size: 13px; }
.dm-search-wrap svg { left: 13px; color: var(--muted); }
.dm-select { padding: 9px 12px; font-size: 12px; }
.dm-chips { gap: 4px; padding-bottom: 18px; border-bottom: 1px solid var(--line); }
.dm-chip { min-height: 32px; padding: 6px 12px; border: 0; border-radius: 9px; background: transparent;
  color: var(--muted); font-size: 13px; }
.dm-chip:hover { background: var(--tint); color: var(--accent); }
.dm-chip[aria-pressed="true"] { background: var(--accent); color: #fff; font-weight: 650; }
.dm-chip[aria-pressed="true"] .dm-chip-count { color: rgba(255,255,255,.75); }
.dm-chip-count { margin-left: 6px; font-size: 11px; }

/* 卡片 */
.dm-grid { grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 14px; }
.dm-card { min-height: 172px; padding: 22px; border: 1px solid var(--line); border-radius: 18px;
  background: var(--panel); gap: 12px; }
.dm-card:hover { border-color: color-mix(in srgb, var(--accent) 32%, var(--line));
  box-shadow: 0 10px 28px rgba(24,43,39,.07); }
.dm-thumb { width: 44px; height: 44px; border-radius: 12px; border: 0;
  background: var(--tint); color: var(--accent); font-size: 18px; }
.dm-thumb img { width: 26px; height: 26px; }
.dm-title { font-size: 14.5px; font-weight: 700; }
.dm-cat { color: var(--muted); font-size: 11.5px; line-height: 1.4; }
.dm-desc { color: var(--muted); font-size: 12.5px; line-height: 1.65; min-height: 0; }
.dm-foot { margin-top: auto; }
.dm-meta { gap: 0; color: var(--muted); font-size: 11.5px; }
.dm-meta .dm-tag { padding: 0; background: transparent; }
.dm-btn { border: 0; border-radius: 10px; background: var(--tint); color: var(--accent);
  font-size: 12.5px; font-weight: 650; min-height: 32px; padding: 6px 14px; }
.dm-btn--primary { background: var(--tint); color: var(--accent); }
.dm-btn--primary:hover:not(:disabled) { background: color-mix(in srgb, var(--accent) 16%, var(--bg)); }
.dm-installed { background: transparent; color: var(--muted); font-size: 11.5px; padding: 6px 0; }
[aria-current="true"].dm-card { border-color: var(--accent); box-shadow: inset 0 0 0 1px var(--accent); }

/* 抽屉 */
.dm-detail { background: var(--panel); border-left: 1px solid var(--line); gap: 20px; }
.dm-detail-head { background: var(--panel); border-bottom: 1px solid var(--line); }
.dm-detail-foot { background: var(--panel); border-top: 1px solid var(--line); }
.dm-detail-desc { color: var(--muted); }
.dm-detail-row > span:first-child { color: var(--muted); }
.dm-detail-row a { color: var(--accent); }
.dm-detail h2 { font-size: 19px; font-weight: 750; }
.dm-version { background: transparent; border: 1px solid var(--line); }
.dm-version:first-child { border-color: color-mix(in srgb, var(--accent) 35%, var(--line)); background: var(--tint); }
.dm-close { background: transparent; border-color: var(--line); }
.dm-close:hover { background: var(--tint); color: var(--accent); }
.dm-toast { background: var(--hero); color: #eef4ee; border: 0; }
.dm-mask { background: rgba(21,63,50,.28); }
.dm-section-head::before { background: var(--accent); }
@media (max-width: 1100px) {
  .dm-banner { grid-template-columns: 1fr; padding: 28px; }
  .dm-art { display: none; }
  .dm-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
}
@media (max-width: 720px) {
  .dm-root { padding: 22px 18px 48px; }
  .dm-heading { align-items: flex-start; flex-direction: column; }
  .dm-heading h1 { font-size: 27px; }
  .dm-banner h2 { font-size: 25px; }
  .dm-minis, .dm-grid { grid-template-columns: minmax(0, 1fr); }
  .dm-catalog-head { align-items: stretch; flex-direction: column; }
}
`
    // 旧样式保留在这里只为对照，不参与渲染
    const STYLES_LEGACY = `
.dm-root { --dm-accent: var(--dsh-accent, #4d6bfe); --dm-line: var(--dsh-border, rgba(127,127,127,.22));
  display: flex; flex-direction: column; gap: 16px; max-width: 1280px; margin: 0 auto;
  padding: 26px 28px 56px; height: 100%; overflow: auto; box-sizing: border-box;
  background:
    radial-gradient(1200px 340px at 10% -8%, rgba(77,107,254,.16), transparent 68%),
    radial-gradient(900px 280px at 90% -6%, rgba(128,92,255,.12), transparent 70%); }
.dm-hero { display: flex; align-items: flex-start; justify-content: space-between; gap: 16px; }
.dm-hero h1 { margin: 0; font-size: 22px; font-weight: 650; letter-spacing: -.01em; display: flex; align-items: center; gap: 10px; }
.dm-pill { font-size: 11px; font-weight: 600; padding: 2px 8px; border-radius: 999px; background: rgba(77,107,254,.14); color: var(--dm-accent); }
.dm-sub { margin: 6px 0 0; font-size: 12.5px; opacity: .55; }
.dm-ghost { display: inline-flex; align-items: center; gap: 6px; padding: 7px 13px; border-radius: 9px; border: 1px solid var(--dm-line);
  background: transparent; color: inherit; cursor: pointer; font: inherit; font-size: 12.5px; transition: border-color .15s, color .15s; }
.dm-ghost:hover { border-color: var(--dm-accent); color: var(--dm-accent); }
.dm-search-wrap { position: relative; display: flex; align-items: center; flex: 1 1 320px; max-width: 560px; }
.dm-tools { display: flex; align-items: center; gap: 10px; }
.dm-select { padding: 9px 12px; border-radius: 10px; border: 1px solid var(--dm-line); background: transparent;
  color: inherit; font: inherit; font-size: 12.5px; cursor: pointer; }
.dm-select:focus { outline: none; border-color: var(--dm-accent); }
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
.dm-hero-card { position: relative; display: flex; flex-direction: row; align-items: center; gap: 16px; padding: 16px 18px; border-radius: 18px;
  border: 1px solid var(--dm-line); background: linear-gradient(135deg, rgba(77,107,254,.10), rgba(127,127,127,.04));
  overflow: hidden; transition: border-color .2s, box-shadow .2s, transform .2s; }
.dm-hero-main { flex: 1 1 auto; min-width: 0; display: flex; flex-direction: column; gap: 8px; position: relative; }
.dm-hero-side { flex: none; display: flex; flex-direction: column; align-items: flex-end; gap: 10px; position: relative; }
.dm-hero-card::after { content: ''; position: absolute; top: -90px; right: -60px; width: 240px; height: 240px; border-radius: 50%;
  background: radial-gradient(circle, rgba(77,107,254,.22), transparent 65%); pointer-events: none; }
.dm-hero-card:hover { border-color: var(--dm-accent); box-shadow: 0 14px 34px rgba(77,107,254,.18); transform: translateY(-2px); }
.dm-hero-card .dm-thumb { width: 56px; height: 56px; border-radius: 16px; font-size: 22px; transition: transform .2s; }
.dm-hero-card:hover .dm-thumb { transform: scale(1.06); }
.dm-hero-title { margin: 0; font-size: 17px; font-weight: 650; }
.dm-hero-desc { margin: 0; font-size: 13px; line-height: 1.6; opacity: .75;
  display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
.dm-hero-foot { display: flex; align-items: center; justify-content: space-between; gap: 10px; }
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
.dm-root[data-bg="paper"] { background:
  radial-gradient(900px 300px at 0% -6%, rgba(255,186,110,.14), transparent 68%),
  radial-gradient(760px 260px at 100% -4%, rgba(255,120,120,.10), transparent 70%); }
.dm-root[data-bg="mint"] { background:
  radial-gradient(900px 300px at 10% -6%, rgba(60,200,170,.13), transparent 68%),
  radial-gradient(760px 260px at 92% 0%, rgba(90,170,255,.10), transparent 70%); }
.dm-root[data-bg="none"] { background: transparent; }
.dm-tools-row { display: flex; align-items: center; gap: 8px; justify-content: space-between; flex-wrap: wrap; }
.dm-bgpop { position: absolute; top: 46px; right: 0; z-index: 40; width: 268px; padding: 14px; border-radius: 14px;
  border: 1px solid var(--dm-line); background: rgba(127,127,127,.08); backdrop-filter: blur(14px);
  box-shadow: 0 16px 40px rgba(0,0,0,.18); display: flex; flex-direction: column; gap: 12px; }
.dm-bgpop-label { font-size: 11px; opacity: .55; }
.dm-swatches { display: flex; gap: 8px; }
.dm-swatch { width: 32px; height: 32px; border-radius: 10px; border: 1px solid rgba(127,127,127,.3); cursor: pointer;
  transition: transform .15s, box-shadow .15s; }
.dm-swatch:hover { transform: translateY(-2px); box-shadow: 0 6px 14px rgba(0,0,0,.16); }
.dm-swatch[aria-pressed="true"] { outline: 2px solid var(--dm-accent); outline-offset: 2px; }
.dm-swatch--aurora { background: linear-gradient(135deg, #4d6bfe, #8f5cff); }
.dm-swatch--paper { background: linear-gradient(135deg, #ffba6e, #ff7878); }
.dm-swatch--mint { background: linear-gradient(135deg, #3cc8aa, #5aaaff); }
.dm-swatch--none { background: repeating-linear-gradient(45deg, rgba(127,127,127,.25) 0 4px, transparent 4px 8px); }
.dm-bgpop input { width: 100%; box-sizing: border-box; padding: 7px 9px; border-radius: 8px; border: 1px solid var(--dm-line);
  background: transparent; color: inherit; font: inherit; font-size: 12px; }
.dm-bgrow { display: flex; gap: 6px; }
.dm-bgrow button { padding: 6px 10px; border-radius: 8px; border: 1px solid var(--dm-line); background: transparent;
  color: inherit; cursor: pointer; font: inherit; font-size: 12px; }
.dm-main { min-width: 0; display: flex; flex-direction: column; gap: 16px; }
.dm-mask { position: fixed; inset: 0; z-index: 70; background: rgba(0,0,0,.18); animation: dm-fade .16s ease-out both; }
@keyframes dm-fade { from { opacity: 0 } to { opacity: 1 } }
.dm-detail { position: fixed; top: 0; right: 0; bottom: 0; z-index: 71; width: min(440px, 94vw);
  display: flex; flex-direction: column; gap: 12px; padding: 20px 20px 24px; overflow: auto;
  border-left: 1px solid rgba(127,127,127,.2); box-shadow: -20px 0 54px rgba(0,0,0,.2);
  animation: dm-slide .24s cubic-bezier(.2,.7,.3,1) both; }
@keyframes dm-slide { from { transform: translateX(100%) } to { transform: none } }
.dm-detail-head { display: flex; gap: 12px; align-items: center; }
.dm-detail-head .dm-thumb { width: 52px; height: 52px; border-radius: 14px; font-size: 20px; }
.dm-detail h2 { margin: 0; font-size: 17px; font-weight: 650; }
.dm-detail-desc { margin: 0; font-size: 13px; line-height: 1.7; opacity: .8; white-space: pre-wrap; }
.dm-detail-rows { display: flex; flex-direction: column; gap: 6px; font-size: 12px; }
.dm-detail-row { display: flex; gap: 8px; }
.dm-detail-row span:first-child { width: 52px; flex: none; opacity: .45; }
.dm-detail-row a { color: var(--dm-accent); text-decoration: none; word-break: break-all; }
.dm-detail-row a:hover { text-decoration: underline; }
.dm-versions { display: flex; flex-direction: column; gap: 4px; max-height: 220px; overflow: auto; }
.dm-version { display: flex; justify-content: space-between; gap: 10px; padding: 5px 8px; border-radius: 7px;
  background: rgba(127,127,127,.08); font-size: 11.5px; }
.dm-version em { font-style: normal; opacity: .5; }
.dm-detail-foot { display: flex; gap: 8px; align-items: center; justify-content: space-between; }
.dm-close { border: 0; background: transparent; color: inherit; opacity: .45; cursor: pointer; font-size: 18px; line-height: 1; }
.dm-close:hover { opacity: .9; }
.dm-card { cursor: pointer; }
.dm-card:hover .dm-thumb { transform: translateY(-3px) scale(1.08); box-shadow: 0 8px 18px rgba(0,0,0,.14); }
.dm-thumb { transition: transform .2s cubic-bezier(.2,.7,.3,1), box-shadow .2s; }
.dm-card:hover .dm-title { transform: translateX(2px); }
.dm-title, .dm-hero-title { transition: transform .2s; }
.dm-card:hover .dm-tag { transform: translateY(-2px); }
.dm-tag { transition: transform .2s .04s; }
.dm-card:hover .dm-btn { transform: translateY(-1px); box-shadow: 0 4px 14px rgba(77,107,254,.3); }
.dm-card[aria-current="true"] { border-color: var(--dm-accent); background: rgba(77,107,254,.09); }
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

    const PaletteIcon = () => h('svg', {
      width: 14, height: 14, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor',
      strokeWidth: 1.9, strokeLinecap: 'round', strokeLinejoin: 'round', 'aria-hidden': true
    }, h('path', { d: 'M12 3a9 9 0 1 0 0 18h1.5a2.5 2.5 0 0 0 0-5H13a2 2 0 0 1 0-4h4a4 4 0 0 0 4-4 5 5 0 0 0-5-5Z' }),
      h('circle', { cx: 8, cy: 9, r: 1.2, fill: 'currentColor', stroke: 'none' }),
      h('circle', { cx: 12, cy: 6.5, r: 1.2, fill: 'currentColor', stroke: 'none' }))

    /** 没图标的插件用名字生成一个稳定的淡色底，比统一灰块有辨识度。 */
    function tintOf(name) {
      let hash = 0
      for (const char of String(name)) hash = (hash * 31 + char.codePointAt(0)) % 360
      return `hsl(${hash} 58% 52% / 0.18)`
    }

    /** 图标块：有图就用图，没有就用名字首字 + 稳定淡色底。 */
    function thumbOf(entry, title) {
      const label = title ?? pick(entry.title, entry.name)
      return h('div', {
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
        : String(label).slice(0, 1).toUpperCase())
    }

    const BG_KEY = 'dsh-market-xivie:bg'
    const BG_PRESETS = [
      { id: 'aurora', zh: '极光', en: 'Aurora' },
      { id: 'paper', zh: '暖沙', en: 'Sand' },
      { id: 'mint', zh: '青雾', en: 'Mint' },
      { id: 'none', zh: '无背景', en: 'Plain' }
    ]

    function readBg() {
      try {
        const saved = JSON.parse(window.localStorage.getItem(BG_KEY) ?? 'null')
        if (saved?.kind === 'image' && typeof saved.url === 'string') return saved
        if (saved?.kind === 'preset' && BG_PRESETS.some((preset) => preset.id === saved.id)) return saved
      } catch {
        // 存储不可用时用默认
      }
      return { kind: 'preset', id: 'aurora' }
    }

    function saveBg(value) {
      try {
        window.localStorage.setItem(BG_KEY, JSON.stringify(value))
      } catch {
        // 存不下就只在这次会话生效
      }
    }

    /** 详情抽屉要盖住内容，得用接近不透明的底色；正文是深色说明是浅色主题，面板就该是浅色。 */
    function surfaceOf() {
      const color = getComputedStyle(document.body).color
      const match = /rgba?\((\d+),\s*(\d+),\s*(\d+)/u.exec(color)
      const textLuminance = match
        ? (Number(match[1]) * 0.299 + Number(match[2]) * 0.587 + Number(match[3]) * 0.114) / 255
        : 0
      return textLuminance < 0.5 ? 'rgba(252,252,253,.985)' : 'rgba(26,26,29,.985)'
    }

    /** 自定义背景图时盖一层和页面同色的半透明遮罩，保证文字可读。 */
    function scrimOf() {
      const color = getComputedStyle(document.body).color
      const match = /rgba?\((\d+),\s*(\d+),\s*(\d+)/u.exec(color)
      const textLuminance = match
        ? (Number(match[1]) * 0.299 + Number(match[2]) * 0.587 + Number(match[3]) * 0.114) / 255
        : 0
      return textLuminance < 0.5 ? 'rgba(255,255,255,0.86)' : 'rgba(18,18,20,0.74)'
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
      const [sort, setSort] = React.useState('index')
      const [busy, setBusy] = React.useState('')
      const [notice, setNotice] = React.useState(undefined)
      const [bundles, setBundles] = React.useState(new Map())
      const [selected, setSelected] = React.useState(undefined)
      const initialBg = React.useRef(readBg()).current
      const [bg, setBg] = React.useState(initialBg)
      const [bgOpen, setBgOpen] = React.useState(false)
      const [bgDraft, setBgDraft] = React.useState(initialBg.kind === 'image' ? initialBg.url : '')
      const applyBg = (value) => {
        setBg(value)
        saveBg(value)
        setBgOpen(false)
      }

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

      // Esc 关闭详情抽屉
      React.useEffect(() => {
        if (selected === undefined) return undefined
        const onKeyDown = (event) => { if (event.key === 'Escape') setSelected(undefined) }
        window.addEventListener('keydown', onKeyDown)
        return () => window.removeEventListener('keydown', onKeyDown)
      }, [selected])

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

      const bgPopover = !bgOpen ? null : h('div', { className: 'dm-bgpop' },
        h('span', { className: 'dm-bgpop-label' }, t('preset')),
        h('div', { className: 'dm-swatches' },
          ...BG_PRESETS.map((preset) => h('button', {
            key: preset.id,
            className: `dm-swatch dm-swatch--${preset.id}`,
            type: 'button',
            title: pick(preset, preset.id),
            'aria-pressed': bg.kind === 'preset' && bg.id === preset.id,
            'aria-label': pick(preset, preset.id),
            onClick: () => applyBg({ kind: 'preset', id: preset.id })
          }))),
        h('span', { className: 'dm-bgpop-label' }, t('customImage')),
        h('div', { className: 'dm-bgrow' },
          h('input', {
            value: bgDraft,
            placeholder: 'https://…',
            'aria-label': t('customImage'),
            onChange: (event) => setBgDraft(event.target.value)
          }),
          h('button', {
            type: 'button',
            onClick: () => {
              const url = bgDraft.trim()
              if (url === '') {
                applyBg({ kind: 'preset', id: 'aurora' })
                return
              }
              applyBg({ kind: 'image', url })
            }
          }, t('apply'))))

      const actions = h('div', { style: { display: 'flex', alignItems: 'center', gap: 10 } },
        h('span', { className: 'dm-total' }, `${entries.length} ${t('plugins')}`),
        h('div', { style: { position: 'relative', display: 'flex', gap: 8 } },
          h('button', {
            className: 'dm-ghost',
            type: 'button',
            'aria-expanded': bgOpen,
            onClick: () => setBgOpen(!bgOpen)
          }, h(PaletteIcon), t('background')),
          h('button', { className: 'dm-ghost', type: 'button', onClick: () => void load(true) },
            h(RefreshIcon), t('refresh')),
          bgPopover))

      const header = h('section', { className: 'dm-heading' },
        h('div', null,
          h('div', { className: 'dm-eyebrow' }, 'THE PLUGIN COLLECTION'),
          h('h1', null, t('headline')),
          h('p', null, t('subtitle'))),
        actions)

      const tools = h('div', { className: 'dm-tools' },
        h('div', { className: 'dm-search-wrap' },
          h(SearchIcon),
          h('input', {
            className: 'dm-search',
            type: 'search',
            value: query,
            placeholder: t('search'),
            'aria-label': t('search'),
            onChange: (event) => setQuery(event.target.value)
          })),
        h('select', {
          className: 'dm-select',
          'aria-label': t('sortBy'),
          value: sort,
          onChange: (event) => setSort(event.target.value)
        },
          h('option', { value: 'index' }, t('sortIndex')),
          h('option', { value: 'downloads' }, t('sortDownloads')),
          h('option', { value: 'stars' }, t('sortStars')),
          h('option', { value: 'name' }, t('sortName'))))

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
                : t('get')
        const action = settled
          ? h('span', { className: 'dm-installed' }, `✓ ${t('added')}`)
          : h('button', {
            className: 'dm-btn dm-btn--primary',
            type: 'button',
            disabled: busy !== '',
            onClick: () => void install(entry)
          }, label)
        const thumb = thumbOf(entry, title)
        const categoryLabel = entry.metadata?.category === undefined
          ? t('community')
          : pick(categories[entry.metadata.category]?.title, entry.metadata.category)
        const meta = h('div', { className: 'dm-meta' },
          `${downloads === undefined ? '' : `↧ ${formatCount(downloads)}   `}v${version ?? '1.0'}`)
        const delay = { animationDelay: `${Math.min(index, 14) * 22}ms` }
        const current = selected?.name === entry.name ? 'true' : undefined
        const open = (event) => {
          if (event.target.closest('button, a')) return
          setSelected(entry)
        }
        return h('article', {
          className: 'dm-card dm-appear', key: entry.name, style: delay,
          'aria-current': current, onClick: open, role: 'button', tabIndex: 0,
          onKeyDown: (event) => { if (event.key === 'Enter' || event.key === ' ') setSelected(entry) }
        },
          h('div', { className: 'dm-card-top' },
            thumb,
            h('div', { className: 'dm-titles' },
              h('h3', { className: 'dm-title', title }, title),
              h('div', { className: 'dm-cat' }, categoryLabel))),
          h('p', { className: 'dm-desc' }, pick(entry.description, '')),
          h('div', { className: 'dm-foot' }, meta, action))
      }

      // 只有没筛选时才展示精选，否则会和下面结果重复
      const featured = needle === '' && category === '' && entries.length > 0
        ? entries
          .filter((entry) => entry.icon !== undefined)
          .slice()
          .sort((left, right) => (sortKeyOf(right, 'downloads') ?? 0) - (sortKeyOf(left, 'downloads') ?? 0))
          .slice(0, 1)
        : []
      const featuredNames = new Set(featured.map((entry) => entry.name))
      const gridEntries = filtered
        .filter((entry) => !featuredNames.has(entry.name))
        .sort((left, right) => {
          if (sort === 'downloads') return (sortKeyOf(right, 'downloads') ?? 0) - (sortKeyOf(left, 'downloads') ?? 0)
          if (sort === 'stars') return (sortKeyOf(right, 'stars') ?? 0) - (sortKeyOf(left, 'stars') ?? 0)
          if (sort === 'name') return pick(left.title, left.name).localeCompare(pick(right.title, right.name), 'zh-Hans-CN')
          return 0
        })

      const top = featured[0]
      const banner = top === undefined ? null : h('section', { className: 'dm-banner' },
        h('div', null,
          h('div', { className: 'dm-banner-label' }, h('i'), `EDITOR'S PICK / ${t('featuredShort')}`),
          h('h2', null, pick(top.title, top.name)),
          h('p', null, pick(top.description, '')),
          h('button', {
            className: 'dm-banner-cta', type: 'button', onClick: () => setSelected(top)
          }, t('viewDetails'), h('span', null, '↗'))),
        h('div', { className: 'dm-art', 'aria-hidden': 'true' },
          h('div', { className: 'dm-art-core' },
            top.icon
              ? h('img', { src: top.icon, alt: '', onError: (event) => { event.currentTarget.style.display = 'none' } })
              : h('span', { className: 'dm-art-glyph' }, String(pick(top.title, top.name)).slice(0, 1))),
          sortKeyOf(top, 'downloads') === undefined ? null : h('div', { className: 'dm-art-tag one' },
            h('b', null, '↧'), ` ${formatCount(sortKeyOf(top, 'downloads'))}`),
          sortKeyOf(top, 'stars') === undefined ? null : h('div', { className: 'dm-art-tag two' },
            h('b', null, '★'), ` ${formatCount(sortKeyOf(top, 'stars'))}`),
          h('div', { className: 'dm-art-tag three' }, h('b', null, '◈'),
            ` ${(top.versions?.length ?? 0)} ${t('versions')}`),
          h('div', { className: 'dm-art-index' }, '01 — COLLECTION')))

      const miniOf = (glyph, title, sub, cat) => h('button', {
        className: 'dm-mini', type: 'button', onClick: () => setCategory(cat)
      },
        h('span', { className: 'dm-mini-icon' }, glyph),
        h('div', null, h('strong', null, title), h('p', null, sub)),
        h('span', { className: 'dm-mini-arrow' }, '↗'))

      const minis = h('section', { className: 'dm-minis' },
        miniOf('✳', t('miniTheme'), t('miniThemeSub'), 'appearance'),
        miniOf('⌘', t('miniWorkflow'), t('miniWorkflowSub'), 'workflow'))

      const catalogSection = h('section', { className: 'dm-section' },
        h('div', { className: 'dm-catalog-head' },
          h('h2', null, t('catalogTitle'), h('small', null, `${gridEntries.length} ${t('plugins')}`)),
          tools),
        chips,
        h('div', { className: 'dm-grid' }, ...gridEntries.map((entry, index) => cardOf(entry, index))))

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
        body = h(React.Fragment, null, banner, minis, catalogSection)
      }

      const detail = selected === undefined ? null : (() => {
        const entry = selected
        const title = pick(entry.title, entry.name)
        const status = statusOf(entry)
        const settled = status === 'installed' || status === 'provided'
        const versions = entry.versions ?? []
        const row = (label, value) => (value === undefined || value === ''
          ? null
          : h('div', { className: 'dm-detail-row' }, h('span', null, label), h('span', null, value)))
        const link = (label, href) => (href === undefined
          ? null
          : h('div', { className: 'dm-detail-row' },
            h('span', null, label),
            h('a', { href, target: '_blank', rel: 'noopener noreferrer' }, href.replace(/^https?:\/\//u, ''))))
        return h('aside', {
          className: 'dm-detail',
          'aria-label': title,
          role: 'dialog',
          'aria-modal': 'true'
        },
          h('div', { className: 'dm-detail-head' },
            thumbOf(entry, title),
            h('div', { className: 'dm-titles', style: { minWidth: 0 } },
              h('h2', { title }, title),
              h('code', { className: 'dm-pkg' }, entry.name)),
            h('button', {
              className: 'dm-close', type: 'button', 'aria-label': t('close'), onClick: () => setSelected(undefined)
            }, '×')),
          h('p', { className: 'dm-detail-desc' }, pick(entry.description, '')),
          h('div', { className: 'dm-detail-rows' },
            row(t('author'), entry.author),
            row(t('category'), categories[entry.metadata?.category] ? pick(categories[entry.metadata.category].title, entry.metadata.category) : undefined),
            link(t('repo'), entry.repository?.url),
            link(t('homepage'), entry.homepage),
            row(t('versionLabel'), `${versions.length}`),
            row(t('updated'), versions[0]?.publishTimestamp
              ? new Date(versions[0].publishTimestamp * 1000).toLocaleDateString('zh-CN')
              : undefined)),
          versions.length === 0 ? null : h('div', { className: 'dm-versions' },
            ...versions.slice(0, 10).map((version) => h('div', { className: 'dm-version', key: version.version },
              h('span', null, `v${version.version}`),
              h('em', null, version.publishTimestamp
                ? new Date(version.publishTimestamp * 1000).toLocaleDateString('zh-CN')
                : '')))),
          h('div', { className: 'dm-detail-foot' },
            h('span', { className: 'dm-meta' },
              sortKeyOf(entry, 'stars') !== undefined ? h('span', { className: 'dm-tag' }, `★ ${formatCount(sortKeyOf(entry, 'stars'))}`) : null,
              sortKeyOf(entry, 'downloads') !== undefined ? h('span', { className: 'dm-tag' }, `↓ ${formatCount(sortKeyOf(entry, 'downloads'))}`) : null),
            settled
              ? h('span', { className: 'dm-installed' }, `✓ ${t('installed')}`)
              : h('button', {
                className: 'dm-btn dm-btn--primary',
                type: 'button',
                disabled: busy !== '',
                onClick: () => void install(entry)
              }, busy === entry.name ? t('installing') : t('install'))))
      })()

      const rootProps = { className: 'dm-root' }
      if (bg.kind === 'image' && bg.url !== '') {
        const scrim = scrimOf()
        rootProps.style = {
          backgroundImage: `linear-gradient(${scrim}, ${scrim}), url("${bg.url}")`,
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }
      } else {
        rootProps['data-bg'] = bg.kind === 'preset' ? bg.id : 'aurora'
      }

      return h('div', rootProps,
        header,
        h('div', { className: 'dm-main' }, body),
        detail === null ? null : h(React.Fragment, null,
          h('div', { className: 'dm-mask', onClick: () => setSelected(undefined) }),
          detail),
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
        style.textContent = STYLES + STYLES_BRAND
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
