/**
 * DSH 插件市场（dsh-market-xivie）
 * Copyright (c) 2026 xivie-a. All rights reserved.
 * 专有许可：允许安装使用，禁止复制、再分发或改作同类市场。见仓库根目录 LICENSE。
 */
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
      bannerLeadPrefix: '让',
      bannerLeadSuffix: '更好用。',
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
      favorites: '收藏',
      favorite: '收藏这个插件',
      unfavorite: '取消收藏',
      myPlugins: '我的插件',
      clearFilters: '清除筛选',
      quickSearch: '快捷搜索',
      quickSearchPlaceholder: '搜索插件名称、作者或描述…',
      paletteNavigate: '选择',
      paletteOpen: '打开',
      paletteClose: '关闭',
      related: '相关推荐',
      layoutGrid: '网格视图',
      layoutList: '列表视图',
      suites: '场景套装',
      suitesSub: '按场景搭配，一次装齐',
      installAll: '全部获取',
      suiteInstalling: '正在获取…',
      suiteDone: '套装已处理完，重启 DSH 生效',
      suiteConnect: '装完顺便接通 QQ',
      suiteBotQQPlaceholder: '机器人 QQ 号',
      suiteAdminPlaceholder: '你自己的 QQ 号（管理员）',
      suiteConnectHint: '勾了：重启一次之后市场自己下载 NapCat、写好配置，二维码直接放这，你只扫码。',
      suiteAutoNote: '这两个下载不用点。勾了「装完顺便接通」之后，重启回来市场自己下、自己对版本。',
      suiteConnectOff: '不勾也能装，只是装完你得自己去右上角「连接」里点一键接通。勾了才会自动下 NapCat。',
      iInstallItMyself: '我自己装',
      needsManualHint: '这两个勾选框是「我自己装」：勾上只会帮你打开下载页，不勾就交给市场——一会儿在「连接」里点一键接通，它自己下、自己对版本。',
      suitePending: '插件装好了。重启一次 DSH，回来自动接通 QQ——你只要扫码。',
      suitePendingFail: '插件装好了，但没记下「顺便接通」——回市场点「连接 → 一键接通」也一样。',
      pending: '待获取',
      failed: '失败',
      working: '处理中…',
      remove: '卸载',
      removed: '已卸载',
      disabled: '已停用',
      removeUnsupported: '这个 DSH 版本不支持从这里卸载，请到「插件」页操作',
      curatedBundle: '场景套装',
      suiteCompose: '搭配你的能力组合',
      installSelected: '安装所选',
      pickCombo: '选择你的插件组合',
      optionalGroup: '其他',
      selectAll: '全选',
      keepRequired: '仅保留必需',
      required: '必需',
      autoIncluded: '自动包含',
      optional: '可选',
      selected: '已选',
      suiteOrderHint: '必需项优先，其余按清单顺序添加',
      suiteBuilding: '正在搭建你的插件套装…',
      suiteReady: '套装已准备好',
      onlyRunning: '正在处理…',
      restartShort: '重启生效',
      pickable: '可选',
      compatNone: '没有适配当前 DSH 的版本',
      compatMismatch: '版本不匹配',
      installCompat: '安装兼容版本',
      compatDsh: '当前 DSH',
      compatUnknown: '无法识别',
      incompatible: '不兼容',
      compatUse: '兼容',
      compatNeed: '要求',
      checkFail: '这版装不上',
      checkWarn: '体检有提醒',
      checkLine: '加载检查',
      checkOk: '体检通过',
      mustPickOne: '上面这组至少要选一个，才能继续安装',
      appearance: '外观',
      prev: '上一个',
      next: '下一个',
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
      missingSource: '索引还没加进「发现」，先运行 /my-market 命令或在「发现 → 添加索引源」里加上它。',
      connect: '连接',
      connectHint: '扫码 / 连线状态',
      connectTitle: '把插件连上',
      connectEyebrow: 'CONNECT',
      connectIntro: '装完只是第一步。扫码登录、填好路径，这些插件才真的能干活。',
      connOnline: '已上线',
      connWaiting: '等你扫码',
      connOffline: '没连上',
      connNotRunning: 'NapCat 桥没在跑',
      connQrWait: '二维码还没出来',
      connResumeOk: '上次留的「顺便接通」已经自动跑完了',
      connResumeFail: '上次的「顺便接通」没跑通',
      connRepull: '重新拉起',
      connOpenPage: '打开扫码页',
      connRefresh: '刷新状态',
      setupOpenOne: '一键接通',
      setupQqPlaceholder: '你自己的 QQ 号',
      setupPathLabel: '装到',
      setupPathPlaceholder: '留空 = 用户目录下的 dsh-napcat',
      setupPathHint: '就是上面这个文件夹，默认在用户目录下。想换盘就改它——装完的真实路径也会写进下面的进度里。',
      setupReuseHint: '这个目录是你已经在用的那份，市场不会另装一份。',
      setupManual: '下载不通？手动拿 NapCat.Shell',
      setupStart: '开始接通',
      setupHint: '市场会自己下载 NapCat、对齐版本、写好两侧配置，然后把二维码贴出来。你只需要扫码。',
      setupScanTip: '用手机 QQ 扫码；扫完这里会变成已上线',
      setupDetecting: '正在检查这台机器…',
      connStepsTitle: '还差这三步',
      connStep1: '装 QQ 9.9.36 和 NapCat.Shell（管理员运行 launcher.bat）',
      connStep2: 'DSH 设置 → napcat 桥，填 NapCat 目录',
      connStep3: '回来点「重新拉起」，出码就扫',
      connBlocked: '看门狗发现重复进程，但没填路径前缀，杀不掉。填上路径就会自己恢复。',
      connGetNapcat: '下载 NapCat.Shell',
      connBiliTitle: 'B站工具包',
      connBiliHint: '扫一次码就行。市场里直接能扫，不用去找插件自己的入口。',
      connOnlyBili: '这台机器没装 NapCat 桥，QQ 通道那套用不上。下面是能在这里直接做的事。',
      biliLogin: 'B站登录',
      biliIntro: '装好只是第一步。扫一次码，之后总结视频、抓字幕这些才能真正读到你的权限。',
      biliScanNow: '扫码登录',
      biliScanTip: '用 B站 App 扫这张码，扫完在手机上点确认。',
      biliRefreshCode: '换一张',
      biliPwdTitle: '设一个本地密码',
      biliPwdHint: '登录凭证会用它加密后再存到这台机器上，以后解锁用。忘了只能重新扫码。',
      biliPwdOne: '密码',
      biliPwdTwo: '再输一次',
      biliSave: '保存',
      biliUnlock: '解锁',
      biliLockedHint: '账号是加密存的，输入本地密码解锁。',
      biliReadyHint: '已登录，之后用得上 B站 的插件都能直接干活了。',
      biliMissingHint: '没找到「B站接入」在跑。先在市场里装上它，再回来点这里。',
      biliStuckHint: '插件装好了，但它的接口没挂上：上游把挂载名写错了，这一版它自己加载不了。市场不会去改它的文件（改错了会让 DSH 起不来），先在插件页把它停用，等上游修。',
      biliErrorHint: '接口没通。确认插件装好并重启过 DSH，再试一次。',
      biliExpiredHint: '二维码两分钟就过期，换一张再扫。',
      biliDone: '完成',
      connSms: '这次登录要短信验证',
      connAutoNote: '每天第一次打开市场会提醒一次，连上之后不再打扰。',
      connQrTip: '扫码成功后这一格会自己变绿',
      needsTag: '需',
      needsEyebrow: 'BEFORE YOU INSTALL',
      needsTitle: '装之前先准备',
      needsNote: '这些不是 npm 依赖，装完插件还得自己准备；缺了它，插件要么没反应，要么一直报错。',
      needsKindApp: '软件',
      needsKindAccount: '账号',
      needsKindConfig: '设置',
      needsOpen: '打开官网',
      needsCancel: '先不装',
      needsConfirm: '我准备好了，继续安装',
      needsDrawer: '安装前准备',
      needsInline: '还需要',
      download: '下载',
      downloadHint: '装好后自动打开下载页',
      downloadOn: '装插件时一并打开下载页',
      releasePage: '发布页'
    }
    const en = {
      title: 'My Market',
      subtitle: 'A community plugin index, reviewed by hand',
      search: 'Search plugins',
      all: 'All',
      featured: 'Featured · most downloaded',
      featuredShort: "Editor's pick",
      bannerLeadPrefix: 'Make',
      bannerLeadSuffix: 'work better.',
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
      favorites: 'Favorites',
      favorite: 'Save this plugin',
      unfavorite: 'Remove from favorites',
      myPlugins: 'My plugins',
      clearFilters: 'Clear filters',
      quickSearch: 'Quick search',
      quickSearchPlaceholder: 'Search by name, author or description…',
      paletteNavigate: 'select',
      paletteOpen: 'open',
      paletteClose: 'close',
      related: 'Related plugins',
      layoutGrid: 'Grid view',
      layoutList: 'List view',
      suites: 'Bundles',
      suitesSub: 'Picked sets, installed in one go',
      installAll: 'Get all',
      suiteInstalling: 'Getting…',
      suiteDone: 'Bundle finished. Restart DSH to apply.',
      suiteConnect: 'Also connect QQ after installing',
      suiteBotQQPlaceholder: 'Bot QQ number',
      suiteAdminPlaceholder: 'Your QQ number (admin)',
      suiteConnectHint: 'Ticked means: after one restart the market downloads NapCat, writes the config and puts the QR right here — you only scan.',
      suiteAutoNote: 'Do not click those downloads. With the box ticked the market fetches it and matches the version itself after the restart.',
      suiteConnectOff: 'Installing works without it — you would then use Connect in the top-right to set QQ up by hand. Only ticking it makes the market download NapCat for you.',
      iInstallItMyself: 'I install it myself',
      needsManualHint: 'Those two tick boxes mean "I install it myself": ticking only opens the download page. Leave them empty and the market does it — use Connect → one-click setup and it downloads and matches the version itself.',
      suitePending: 'Plugins installed. Restart DSH once — QQ gets connected automatically, you only scan.',
      suitePendingFail: 'Plugins installed, but the auto-connect could not be queued — use Connect → one-click setup instead.',
      pending: 'Pending',
      failed: 'Failed',
      working: 'Working…',
      remove: 'Remove',
      removed: 'Removed',
      disabled: 'Disabled',
      removeUnsupported: 'This DSH build cannot remove plugins here; use the Plugins page',
      curatedBundle: 'Curated bundle',
      suiteCompose: 'Compose your toolset',
      installSelected: 'Install selected',
      pickCombo: 'Pick your combination',
      optionalGroup: 'Also in this set',
      selectAll: 'Select all',
      keepRequired: 'Required only',
      required: 'Required',
      autoIncluded: 'included',
      optional: 'Optional',
      selected: 'Selected',
      suiteOrderHint: 'Required items first, then list order',
      suiteBuilding: 'Building your bundle…',
      suiteReady: 'Bundle ready',
      onlyRunning: 'Working…',
      restartShort: 'Restart to apply',
      pickable: 'Optional',
      compatNone: 'No version fits this DSH build',
      compatMismatch: 'Version mismatch',
      installCompat: 'Install compatible',
      compatDsh: 'Current DSH',
      compatUnknown: 'unknown',
      incompatible: 'incompatible',
      compatUse: 'fits',
      compatNeed: 'needs',
      checkFail: "won't load",
      checkWarn: 'Load check has notes',
      checkLine: 'Load check',
      checkOk: 'Load check passed',
      mustPickOne: 'Pick at least one in the group above to continue',
      appearance: 'Appearance',
      prev: 'Previous',
      next: 'Next',
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
      missingSource: 'The index is not in Discover yet. Run /my-market or add it under Discover → Add index source.',
      connect: 'Connect',
      connectHint: 'Scan / connection status',
      connectTitle: 'Connect your plugins',
      connectEyebrow: 'CONNECT',
      connectIntro: 'Installing is step one. Scan a code or fill in a path, and these plugins actually start working.',
      connOnline: 'Online',
      connWaiting: 'Waiting for scan',
      connOffline: 'Not connected',
      connNotRunning: 'NapCat bridge is not running',
      connQrWait: 'No QR code yet',
      connResumeOk: 'The auto-connect you queued last time already ran',
      connResumeFail: 'The auto-connect you queued last time did not finish',
      connRepull: 'Restart',
      connOpenPage: 'Open QR page',
      connRefresh: 'Refresh',
      setupOpenOne: 'Set up in one click',
      setupQqPlaceholder: 'Your own QQ number',
      setupPathLabel: 'Install to',
      setupPathPlaceholder: 'Empty = dsh-napcat under your user folder',
      setupPathHint: 'That folder above. It goes under your user folder by default; change it if you want another drive.',
      setupReuseHint: 'That is the copy you already use — the market will not install a second one.',
      setupManual: 'Download blocked? Get NapCat.Shell by hand',
      setupStart: 'Start',
      setupHint: 'The market downloads NapCat, matches the QQ version, writes both configs, then shows the QR here. You only scan.',
      setupScanTip: 'Scan with mobile QQ; this panel flips to online when you are in',
      setupDetecting: 'Checking this machine…',
      connStepsTitle: 'Three steps left',
      connStep1: 'Install QQ 9.9.36 plus NapCat.Shell (run launcher.bat as admin)',
      connStep2: 'DSH Settings → napcat bridge → set the NapCat folder',
      connStep3: 'Come back, hit Restart, then scan',
      connBlocked: 'The watchdog found duplicate processes but has no path prefix, so it cannot kill them. Fill the path in and it recovers itself.',
      connGetNapcat: 'Get NapCat.Shell',
      connBiliTitle: 'Bilibili toolkit',
      connBiliHint: 'One scan is enough — you can do it right here in the market.',
      connOnlyBili: 'No NapCat bridge on this machine, so the QQ side does not apply. Here is what you can do right here.',
      biliLogin: 'Bilibili sign-in',
      biliIntro: 'Installing is only half. Scan once so video summaries and subtitles can read your permissions.',
      biliScanNow: 'Scan to sign in',
      biliScanTip: 'Open the Bilibili app, scan this code, then confirm on your phone.',
      biliRefreshCode: 'New code',
      biliPwdTitle: 'Set a local password',
      biliPwdHint: 'The credential is encrypted with it and stored on this machine. Lose it and you scan again.',
      biliPwdOne: 'Password',
      biliPwdTwo: 'Repeat',
      biliSave: 'Save',
      biliUnlock: 'Unlock',
      biliLockedHint: 'The account is stored encrypted. Enter the local password to unlock.',
      biliReadyHint: 'Signed in — every Bilibili plugin can work now.',
      biliMissingHint: 'The Bilibili plugin is not running. Install it from the market first.',
      biliStuckHint: 'Installed, but its API never mounted: the upstream patch declares the wrong module name and this build cannot load it. The market will not rewrite other plugins\' files (that is how DSH stopped booting), so disable it in the plugin page and wait for an upstream fix.',
      biliErrorHint: 'The API did not answer. Make sure the plugin is installed and DSH restarted.',
      biliExpiredHint: 'Codes expire in two minutes. Grab a new one.',
      biliDone: 'Done',
      connSms: 'This login needs an SMS code',
      connAutoNote: 'We remind you once a day until it is connected.',
      connQrTip: 'This panel turns green as soon as the scan lands',
      needsTag: 'needs',
      needsEyebrow: 'BEFORE YOU INSTALL',
      needsTitle: 'Set this up first',
      needsNote: 'These are not npm packages. The plugin installs fine without them, then sits there doing nothing.',
      needsKindApp: 'app',
      needsKindAccount: 'account',
      needsKindConfig: 'setup',
      needsOpen: 'Open site',
      needsCancel: 'Not now',
      needsConfirm: 'I have these — install',
      needsDrawer: 'Before you install',
      needsInline: 'also needs',
      download: 'Download',
      downloadHint: 'opens the download page when installing',
      downloadOn: 'open the download page when installing',
      releasePage: 'releases'
    }

    const STYLES = `
/*
   DSH 插件市场（dsh-market-xivie）
   Copyright (c) 2026 xivie-a. All rights reserved.
   专有许可：允许安装使用，禁止复制、再分发或改作同类市场。见仓库根目录 LICENSE。
*/\n
/* ==========================================================================
   DSH 插件市场 · 单一样式表
   设计语言：暖白底 + 深绿主视觉 + 酸绿 CTA（移植自概念稿）
   规则：只保留一套 token（--bg/--panel/--text/…），不再有第二层覆盖
   ========================================================================== */

.dm-root {
  --bg: #f5f6f2;
  --panel: #fff;
  --text: #182b27;
  --muted: #78827c;
  --line: #e4e8e1;
  --accent: #246b51;
  --tint: #e9f2e7;
  --lime: #d5f48b;
  --hero: #153f32;

  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  gap: 26px;
  width: 100%;
  max-width: 1200px;
  height: 100%;
  min-width: 0;
  margin: 0 auto;
  padding: 30px 34px 64px;
  overflow: auto;
  background: var(--bg);
  color: var(--text);
  font: 14px/1.6 system-ui, -apple-system, "Segoe UI", "PingFang SC", "Microsoft YaHei", sans-serif;
  -webkit-font-smoothing: antialiased;
  scrollbar-width: thin;
  scrollbar-color: color-mix(in srgb, var(--text) 24%, transparent) transparent;
  color-scheme: light;
}
.dm-root *,
.dm-root *::before,
.dm-root *::after { box-sizing: border-box; }

/* 主题：跟随右上角开关，而不是系统 */
.dm-root[data-theme="light"] {
  --bg: #f5f6f2; --panel: #fff; --text: #182b27; --muted: #78827c; --line: #e4e8e1;
  --accent: #246b51; --tint: #e9f2e7; --lime: #d5f48b; --hero: #153f32;
  color-scheme: light;
}
.dm-root[data-theme="dark"] {
  --bg: #141c19; --panel: #1b2621; --text: #e6eee7; --muted: #a0afa4; --line: #304038;
  --accent: #b4dcaa; --tint: #2c4033; --lime: #cbe88f; --hero: #123a2d;
  color-scheme: dark;
}

/* :where 让选择器权重为 0，组件自己的颜色/字体不会被这条重置盖掉 */
.dm-root :where(button, input, select) { font: inherit; color: inherit; }
.dm-root :where(button) { -webkit-tap-highlight-color: transparent; cursor: pointer; }
.dm-root :where(button, input, select, a, [tabindex]):focus-visible {
  outline: 2px solid var(--accent);
  outline-offset: 3px;
}

/* ── 标题区 ───────────────────────────────────────────────────────────── */
.dm-eyebrow { color: var(--muted); font-size: 11px; font-weight: 600; letter-spacing: .16em; text-transform: uppercase; }
.dm-heading { display: flex; align-items: flex-end; justify-content: space-between; gap: 20px; }
.dm-heading h1 { margin: 10px 0 6px; font-size: 34px; font-weight: 800; line-height: 1.25; letter-spacing: -.02em; }
.dm-heading p { margin: 0; color: var(--muted); font-size: 13.5px; }
.dm-total { flex: none; color: var(--muted); font-size: 12px; }
.dm-total em { color: color-mix(in srgb, var(--muted) 78%, transparent); font-style: normal; font-variant-numeric: tabular-nums; }

.dm-ghost {
  display: inline-flex; align-items: center; justify-content: center; gap: 7px;
  min-height: 36px; padding: 7px 12px;
  border: 1px solid var(--line); border-radius: 10px;
  background: var(--panel); color: var(--muted);
  font-size: 12px; font-weight: 500; white-space: nowrap;
  transition: border-color .16s, background .16s, color .16s;
}
.dm-ghost:hover { border-color: color-mix(in srgb, var(--accent) 45%, var(--line)); background: var(--tint); color: var(--accent); }
.dm-ghost[aria-pressed="true"] { background: var(--tint); color: var(--accent); }

/* ── 精选横幅 ─────────────────────────────────────────────────────────── */
.dm-banner {
  position: relative;
  display: grid;
  grid-template-columns: 1.15fr .85fr;
  gap: 24px;
  padding: 34px 38px;
  border-radius: 22px;
  background: var(--hero);
  color: #eef4ee;
  overflow: hidden;
}
.dm-banner-body { position: relative; min-width: 0; animation: dm-swap .28s ease-out; }
@keyframes dm-swap { from { opacity: 0; transform: translateY(6px) } to { opacity: 1; transform: none } }

.dm-banner-label {
  display: flex; align-items: center; gap: 8px;
  color: rgba(238, 244, 238, .62);
  font-size: 10.5px; font-weight: 600; letter-spacing: .14em; text-transform: uppercase;
}
.dm-banner-label i { width: 6px; height: 6px; border-radius: 50%; background: var(--lime); }
.dm-banner h2 {
  margin: 16px 0 12px;
  font-size: 32px; font-weight: 750; line-height: 1.28; letter-spacing: -.02em;
  color: #fff;
}
.dm-banner h2 em { font-style: normal; color: var(--lime); }
.dm-banner p { margin: 0; max-width: 34em; color: rgba(238, 244, 238, .72); font-size: 13px; line-height: 1.7; overflow-wrap: anywhere; }
.dm-banner p strong { color: #fff; font-weight: 600; }
.dm-banner-cta {
  display: inline-flex; align-items: center; gap: 8px;
  margin-top: 20px; padding: 11px 20px;
  border: 0; border-radius: 12px;
  background: var(--lime); color: #153f32;
  font-size: 13px; font-weight: 650;
  transition: filter .15s, transform .1s;
}
.dm-banner-cta:hover { filter: brightness(1.05); }
.dm-banner-cta:active { transform: translateY(1px); }

/* ── 轮播悬停：整块亮起来，图标站正，标签依次浮起，按钮扫光 ────────────── */
.dm-banner {
  transition: box-shadow .28s ease, background-color .28s ease;
}
.dm-banner:hover {
  box-shadow: 0 22px 60px rgba(21, 59, 48, .28), inset 0 0 0 1px rgba(213, 244, 139, .16);
}
/* 光晕跟着指针方向轻微偏移（用背景渐变模拟，不产生布局抖动） */
.dm-banner::after {
  content: ""; position: absolute; inset: 0;
  background: radial-gradient(560px 300px at var(--mx, 30%) var(--my, 20%), rgba(213, 244, 139, .1), transparent 70%);
  opacity: 0; transition: opacity .3s ease;
  pointer-events: none;
}
.dm-banner:hover::after { opacity: 1; }

.dm-art-core {
  transition: transform .34s cubic-bezier(.2, .7, .3, 1), box-shadow .34s ease;
}
.dm-banner:hover .dm-art-core {
  transform: translate(-50%, -50%) rotate(0deg) scale(1.07);
  box-shadow: 0 26px 54px rgba(0, 0, 0, .42);
}
.dm-art::before,
.dm-art::after {
  transition: transform .5s cubic-bezier(.2, .7, .3, 1), border-color .4s ease;
}
.dm-banner:hover .dm-art::before { transform: translate(-50%, -50%) scale(1.09); border-color: rgba(213, 244, 139, .34); }
.dm-banner:hover .dm-art::after { transform: translate(-50%, -50%) scale(1.13); border-color: rgba(213, 244, 139, .4); }

.dm-art-tag {
  transition: transform .26s cubic-bezier(.2, .7, .3, 1), border-color .26s ease, background .26s ease;
}
.dm-banner:hover .dm-art-tag {
  transform: translateY(-4px);
  border-color: rgba(213, 244, 139, .36);
  background: rgba(255, 255, 255, .09);
}
.dm-banner:hover .dm-art-tag.two { transition-delay: 60ms; }
.dm-banner:hover .dm-art-tag.three { transition-delay: 120ms; }

.dm-banner-cta {
  position: relative; overflow: hidden;
  transition: filter .15s, transform .18s cubic-bezier(.2, .7, .3, 1), box-shadow .18s ease;
}
.dm-banner-cta:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 22px rgba(0, 0, 0, .24);
}
.dm-banner-cta::after {
  content: ""; position: absolute; inset: 0 auto 0 -60%;
  width: 45%;
  background: linear-gradient(100deg, transparent, rgba(255, 255, 255, .55), transparent);
  transform: skewX(-18deg);
  transition: left .5s ease;
  pointer-events: none;
}
.dm-banner-cta:hover::after { left: 120%; }

.dm-arrow { transition: transform .18s ease, background .18s ease, color .18s ease; }
.dm-arrow:hover { transform: scale(1.12); }
.dm-dot { transition: width .2s ease, background .2s ease, transform .2s ease; }
.dm-dot:hover { transform: scaleY(1.6); }

@media (prefers-reduced-motion: reduce) {
  .dm-banner:hover .dm-art-core,
  .dm-banner:hover .dm-art-tag,
  .dm-banner-cta:hover,
  .dm-arrow:hover,
  .dm-dot:hover { transform: none; }
  .dm-banner-cta:hover::after { left: -60%; }
}

.dm-art { position: relative; min-height: 190px; }
.dm-art::before,
.dm-art::after {
  content: ""; position: absolute; inset: 50% auto auto 50%;
  border: 1px solid rgba(213, 244, 139, .22); border-radius: 50%;
  transform: translate(-50%, -50%);
}
.dm-art::before { width: 300px; height: 300px; }
.dm-art::after { width: 190px; height: 190px; }
.dm-art-core {
  position: absolute; inset: 50% auto auto 50%;
  display: grid; place-items: center;
  width: 102px; height: 102px;
  transform: translate(-50%, -50%) rotate(-6deg);
  border-radius: 26px;
  background: linear-gradient(160deg, #2f7a5c, #1c5340);
  box-shadow: 0 18px 40px rgba(0, 0, 0, .35);
  overflow: hidden;
}
.dm-art-core img { width: 54px; height: 54px; object-fit: contain; }
.dm-art-glyph { color: var(--lime); font-size: 40px; line-height: 1; }
.dm-art-tag {
  position: absolute; display: inline-flex; align-items: center; gap: 7px;
  padding: 8px 12px;
  border: 1px solid rgba(213, 244, 139, .18); border-radius: 11px;
  background: rgba(255, 255, 255, .05);
  color: rgba(238, 244, 238, .86);
  font-size: 11.5px; white-space: nowrap;
}
.dm-art-tag b { color: var(--lime); }
.dm-art-tag.one { top: 4%; left: 2%; }
.dm-art-tag.two { top: 30%; right: -4%; }
.dm-art-tag.three { bottom: 6%; left: 10%; }

.dm-banner-nav { position: absolute; right: 26px; bottom: 22px; display: flex; align-items: center; gap: 10px; z-index: 2; }
.dm-dots { display: flex; gap: 6px; align-items: center; }
.dm-dot {
  width: 6px; height: 6px; padding: 0;
  border: 0; border-radius: 99px;
  background: rgba(238, 244, 238, .28);
  transition: width .2s ease, background .2s ease;
}
.dm-dot[aria-current="true"] { width: 18px; background: var(--lime); }
.dm-arrow {
  display: grid; place-items: center;
  width: 28px; height: 28px; padding: 0;
  border: 1px solid rgba(238, 244, 238, .22); border-radius: 50%;
  background: rgba(255, 255, 255, .06); color: #eef4ee;
  font-size: 13px; line-height: 1;
  transition: background .15s;
}
.dm-arrow:hover { background: rgba(255, 255, 255, .15); }

/* ── 两枚分类入口 ─────────────────────────────────────────────────────── */
.dm-minis { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 14px; }
.dm-mini {
  display: flex; align-items: center; gap: 14px;
  padding: 18px 20px; text-align: left;
  border: 1px solid var(--line); border-radius: 16px;
  background: var(--panel);
  transition: border-color .16s, box-shadow .16s;
}
.dm-mini:hover { border-color: color-mix(in srgb, var(--accent) 35%, var(--line)); box-shadow: 0 8px 22px rgba(24, 43, 39, .06); }
.dm-mini-icon { display: grid; place-items: center; flex: none; width: 44px; height: 44px; border-radius: 12px; background: var(--tint); color: var(--accent); font-size: 20px; }
.dm-mini strong { display: block; font-size: 14px; font-weight: 650; }
.dm-mini p { margin: 2px 0 0; color: var(--muted); font-size: 12px; }
.dm-mini-arrow { margin-left: auto; color: var(--muted); font-size: 17px; }

/* ── 目录头与筛选 ─────────────────────────────────────────────────────── */
.dm-section { display: flex; flex-direction: column; gap: 13px; min-width: 0; }
.dm-catalog-head { display: flex; align-items: center; justify-content: space-between; gap: 18px; margin-bottom: 14px; }
.dm-catalog-head h2 { margin: 0; font-size: 21px; font-weight: 750; letter-spacing: -.02em; }
.dm-catalog-head small { margin-left: 8px; color: var(--muted); font-size: 12px; font-weight: 500; }
.dm-tools { display: flex; align-items: center; gap: 10px; min-width: 0; }
.dm-search-wrap { position: relative; display: flex; align-items: center; flex: 1 1 auto; min-width: 0; }
.dm-search-wrap svg { position: absolute; left: 13px; color: var(--muted); pointer-events: none; }
.dm-search,
.dm-select {
  min-width: 0; min-height: 40px;
  border: 1px solid var(--line); border-radius: 11px;
  background: var(--panel); color: var(--text);
  transition: border-color .16s, box-shadow .16s;
}
.dm-search { width: 100%; padding: 10px 14px 10px 38px; font-size: 13px; }
.dm-search::placeholder { color: var(--muted); opacity: 1; }
.dm-search:focus,
.dm-select:focus { outline: none; border-color: var(--accent); box-shadow: 0 0 0 3px color-mix(in srgb, var(--accent) 18%, transparent); }
.dm-select { flex: none; padding: 9px 12px; font-size: 12px; }
.dm-select option { background: var(--panel); color: var(--text); }

.dm-chips { display: flex; flex-wrap: wrap; gap: 4px; padding-bottom: 18px; border-bottom: 1px solid var(--line); }
.dm-chip {
  min-height: 32px; padding: 6px 12px;
  border: 0; border-radius: 9px;
  background: transparent; color: var(--muted);
  font-size: 13px;
  transition: background .16s, color .16s, transform .16s cubic-bezier(.2, .7, .3, 1), box-shadow .16s;
}
.dm-chip:hover {
  background: var(--tint); color: var(--accent);
  transform: translateY(-2px);
  box-shadow: 0 6px 14px rgba(21, 59, 48, .12);
}
.dm-chip:active { transform: translateY(0); box-shadow: none; }
.dm-chip[aria-pressed="true"] { background: var(--accent); color: #fff; font-weight: 650; }
.dm-root[data-theme="dark"] .dm-chip[aria-pressed="true"] { color: #141c19; }
.dm-chip-count { margin-left: 6px; font-size: 11px; font-variant-numeric: tabular-nums; opacity: .75; }

/* ── 卡片 ─────────────────────────────────────────────────────────────── */
.dm-grid { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 14px; min-width: 0; }
.dm-card {
  position: relative;
  display: flex; flex-direction: column; gap: 12px;
  min-width: 0; min-height: 208px; padding: 22px;
  border: 1px solid var(--line); border-radius: 18px;
  background: var(--panel);
  cursor: pointer;
  transform-style: preserve-3d;
  transition: transform .2s cubic-bezier(.2, .7, .3, 1), border-color .18s, box-shadow .18s;
}
.dm-card::after {
  content: ""; position: absolute; inset: 0; border-radius: inherit; pointer-events: none;
  opacity: 0; transition: opacity .25s ease;
  background: radial-gradient(220px circle at var(--mx, 50%) var(--my, 50%),
    color-mix(in srgb, var(--accent) 14%, transparent), transparent 68%);
}
.dm-card:hover::after { opacity: 1; }
.dm-card:hover {
  transform: translateY(-7px) perspective(900px) rotateX(var(--rx, 0deg)) rotateY(var(--ry, 0deg));
  border-color: color-mix(in srgb, var(--accent) 38%, var(--line));
  box-shadow: 0 18px 35px -14px rgba(21, 59, 48, .2), 0 5px 12px -8px rgba(21, 59, 48, .12);
}
.dm-card[aria-current="true"] { border-color: var(--accent); box-shadow: inset 0 0 0 1px var(--accent); }

.dm-card-top { display: flex; align-items: center; gap: 12px; min-width: 0; }
.dm-thumb {
  display: grid; place-items: center; flex: none;
  width: 46px; height: 46px; overflow: hidden;
  border: 0; border-radius: 13px;
  background: var(--tint); color: var(--accent);
  font-size: 19px; font-weight: 650;
  transition: transform .2s cubic-bezier(.2, .7, .3, 1), box-shadow .2s ease;
}
.dm-thumb img { display: block; width: 30px; height: 30px; object-fit: contain; }
@media (hover: hover) {
  .dm-card:hover .dm-thumb { transform: translateY(-3px) scale(1.06); box-shadow: 0 8px 18px rgba(21, 59, 48, .14); }
  .dm-card:hover .dm-title { transform: translateX(2px); }
  .dm-card:hover .dm-tag { transform: translateY(-2px); }
}
.dm-titles { display: flex; flex: 1 1 auto; flex-direction: column; gap: 4px; min-width: 0; }
.dm-title {
  margin: 0; overflow: hidden;
  color: var(--text); font-size: 15px; font-weight: 700; line-height: 1.5;
  text-overflow: ellipsis; white-space: nowrap;
  transition: transform .2s;
}
.dm-cat { color: var(--muted); font-size: 11.5px; line-height: 1.4; }
.dm-desc {
  display: -webkit-box; margin: 0; min-height: 2.4em; overflow: hidden;
  color: var(--muted); font-size: 12.5px; line-height: 1.7; overflow-wrap: anywhere;
  -webkit-line-clamp: 2; -webkit-box-orient: vertical;
}
.dm-foot { display: flex; align-items: center; justify-content: space-between; gap: 10px; margin-top: auto; }
.dm-meta { display: flex; align-items: center; gap: 6px; min-width: 0; color: var(--muted); font-size: 11.5px; font-variant-numeric: tabular-nums; }
.dm-tag {
  max-width: 100%; padding: 3px 7px; overflow: hidden;
  border-radius: 5px; background: var(--tint);
  line-height: 1.4; text-overflow: ellipsis; white-space: nowrap;
  transition: transform .2s .04s;
}
.dm-card .dm-meta .dm-tag { padding: 0; background: transparent; }

.dm-btn {
  position: relative; overflow: hidden;
  display: inline-flex; align-items: center; justify-content: center; flex: none;
  min-height: 32px; padding: 6px 14px;
  border: 0; border-radius: 10px;
  background: var(--tint); color: var(--accent);
  font-size: 12.5px; font-weight: 650; white-space: nowrap;
  transition: background .16s, box-shadow .16s, transform .1s;
}
.dm-btn--primary:hover:not(:disabled) { background: color-mix(in srgb, var(--accent) 16%, var(--bg)); }
.dm-btn:active:not(:disabled) { transform: translateY(1px) scale(.985); }
.dm-btn:disabled { opacity: .6; cursor: wait; box-shadow: none; }
.dm-ripple {
  position: absolute; border-radius: 50%; pointer-events: none;
  transform: scale(0);
  background: color-mix(in srgb, currentColor 26%, transparent);
  animation: dm-ripple .55s ease-out forwards;
}
@keyframes dm-ripple { to { transform: scale(2.8); opacity: 0; } }

.dm-installed {
  display: inline-flex; align-items: center; gap: 5px;
  min-height: 32px; padding: 6px 4px;
  color: var(--muted); font-size: 11.5px; white-space: nowrap;
}
.dm-fav {
  flex: none; margin-left: auto; padding: 5px 7px;
  border: 0; border-radius: 8px; background: transparent;
  color: var(--muted); font-size: 15px; line-height: 1;
  transition: color .15s, background .15s, transform .12s;
}
.dm-fav:hover { color: #d9534f; background: color-mix(in srgb, #d9534f 10%, transparent); }
.dm-fav[aria-pressed="true"] { color: #d9534f; }
.dm-fav:active { transform: scale(.84); }
.dm-fav--pop { animation: dm-pop .32s ease; }
@keyframes dm-pop { 50% { transform: scale(1.35); } }

/* ── 状态 ─────────────────────────────────────────────────────────────── */
.dm-state {
  display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 14px;
  min-height: 200px; padding: 40px 20px;
  color: var(--muted); font-size: 13px; text-align: center; overflow-wrap: anywhere;
}
.dm-state button {
  padding: 7px 14px; border: 1px solid var(--line); border-radius: 9px;
  background: var(--panel); color: var(--accent); font-size: 12.5px;
  transition: background .15s, border-color .15s;
}
.dm-state button:hover { background: var(--tint); border-color: var(--accent); }
.dm-skel {
  min-width: 0; height: 208px;
  border: 1px solid var(--line); border-radius: 18px;
  background: linear-gradient(100deg, var(--panel) 30%, var(--tint) 45%, var(--panel) 60%);
  background-size: 250% 100%;
  animation: dm-shimmer 2s ease-in-out infinite;
}
@keyframes dm-shimmer { from { background-position: 150% 0; } to { background-position: -100% 0; } }

/* ── 详情抽屉 ─────────────────────────────────────────────────────────── */
.dm-mask { position: fixed; inset: 0; z-index: 70; background: rgba(21, 63, 50, .28); animation: dm-fade .16s ease-out; }
@keyframes dm-fade { from { opacity: 0 } to { opacity: 1 } }
.dm-detail {
  position: fixed; inset: 0 0 0 auto; z-index: 71;
  display: flex; flex-direction: column; gap: 22px;
  width: 440px; max-width: 100vw; min-width: 0;
  padding: 24px; overflow-x: hidden; overflow-y: auto;
  overscroll-behavior: contain; scrollbar-gutter: stable;
  border-left: 1px solid var(--line);
  background: var(--panel); color: var(--text);
  box-shadow: -16px 0 64px rgba(21, 59, 48, .16);
  animation: dm-slide .22s cubic-bezier(.2, .7, .3, 1);
}
@keyframes dm-slide { from { transform: translateX(100%) } to { transform: none } }
.dm-detail > * { flex-shrink: 0; min-width: 0; }
.dm-detail-head {
  position: sticky; top: -24px; z-index: 3;
  display: flex; align-items: center; gap: 12px;
  margin: -24px -24px 0; padding: 24px;
  border-bottom: 1px solid var(--line);
  background: var(--panel);
}
.dm-detail-head .dm-thumb { width: 52px; height: 52px; border-radius: 14px; font-size: 22px; }
.dm-detail h2 { margin: 0; font-size: 19px; font-weight: 750; line-height: 1.5; overflow-wrap: anywhere; }
.dm-pkg {
  display: block; min-width: 0; overflow: hidden;
  color: var(--muted); font-family: ui-monospace, SFMono-Regular, Consolas, monospace;
  font-size: 10.5px; line-height: 1.5; text-overflow: ellipsis; white-space: nowrap;
}
.dm-close {
  display: grid; place-items: center; flex: 0 0 34px;
  width: 34px; height: 34px; margin-left: auto; padding: 0;
  border: 1px solid var(--line); border-radius: 10px;
  background: transparent; color: var(--text); font-size: 23px; line-height: 1;
  transition: background .16s, color .16s;
}
.dm-close:hover { background: var(--tint); color: var(--accent); }
.dm-detail-desc { margin: 0; color: var(--muted); font-size: 13px; line-height: 1.9; white-space: pre-wrap; overflow-wrap: anywhere; }
.dm-detail-rows { display: flex; flex-direction: column; padding: 4px 0; border-top: 1px solid var(--line); border-bottom: 1px solid var(--line); font-size: 12px; }
.dm-detail-row { display: flex; align-items: baseline; gap: 16px; min-width: 0; padding: 9px 0; line-height: 1.7; }
.dm-detail-row > span:first-child { flex: 0 0 52px; color: var(--muted); }
.dm-detail-row > :last-child { min-width: 0; overflow-wrap: anywhere; }
.dm-detail-row a { color: var(--accent); text-decoration: none; text-underline-offset: 3px; }
.dm-detail-row a:hover { text-decoration: underline; }
.dm-versions { display: flex; flex-direction: column; gap: 6px; }
.dm-version {
  display: flex; justify-content: space-between; gap: 14px; min-width: 0;
  padding: 10px 12px;
  border: 1px solid var(--line); border-radius: 8px;
  color: var(--text); font-size: 11.5px; font-variant-numeric: tabular-nums;
}
.dm-version:first-child { border-color: color-mix(in srgb, var(--accent) 35%, var(--line)); background: var(--tint); }
.dm-version em { flex: none; color: var(--muted); font-style: normal; }
.dm-version.is-bad { opacity: .55; border-style: dashed; }
.dm-version.is-bad:first-child { border-color: var(--line); background: transparent; }
.dm-version-side { display: flex; align-items: center; gap: 10px; flex: none; }
.dm-version-install {
  padding: 3px 9px; border-radius: 6px;
  border: 1px solid color-mix(in srgb, var(--accent) 35%, var(--line));
  background: transparent; color: var(--accent);
  font-size: 10.5px; font-weight: 600;
  transition: background .15s, color .15s;
}
.dm-version-install:hover:not(:disabled) { background: var(--accent); color: #fff; }
.dm-version-install:disabled { opacity: .4; cursor: default; }

/* 卡片上的兼容角标 */
.dm-compat {
  margin-left: 6px; padding: 1px 6px; border-radius: 5px;
  font-size: 9.5px; font-weight: 600; letter-spacing: .02em;
  vertical-align: middle;
}
.dm-compat--bad { background: color-mix(in srgb, #c05050 12%, transparent); color: #b6463f; }
.dm-compat--ok { background: var(--tint); color: var(--accent); }

/* ==========================================================================
   安装前提示：这些插件要靠外部软件 / 账号 / 设置才能跑
   ========================================================================== */
.dm-needs {
  margin-left: 6px; padding: 1px 6px; border-radius: 5px;
  background: color-mix(in srgb, #c08a2e 14%, transparent);
  color: #9a6a1c;
  font-size: 9.5px; font-weight: 600; letter-spacing: .02em;
  vertical-align: middle; white-space: nowrap;
}
.dm-root[data-theme="dark"] .dm-needs { background: rgba(208, 154, 60, .18); color: #e9be78; }

/* 详情抽屉里的那一块 */
.dm-needs-box {
  padding: 12px 13px; border-radius: 12px;
  border: 1px solid color-mix(in srgb, #c08a2e 26%, var(--line));
  background: color-mix(in srgb, #c08a2e 5%, transparent);
}
.dm-needs-title {
  display: block; margin-bottom: 8px;
  color: #9a6a1c; font-size: 11.5px; font-weight: 700; letter-spacing: .02em;
}
.dm-root[data-theme="dark"] .dm-needs-title { color: #e9be78; }
.dm-needs-row { display: flex; align-items: flex-start; gap: 9px; padding: 6px 0; }
.dm-needs-row + .dm-needs-row { border-top: 1px dashed color-mix(in srgb, #c08a2e 20%, var(--line)); }
.dm-needs-body { min-width: 0; }
.dm-needs-body strong { display: block; font-size: 12px; font-weight: 600; color: var(--text); }
.dm-needs-body p { margin: 3px 0 0; color: var(--muted); font-size: 11px; line-height: 1.6; }

.dm-gate-kind {
  flex: none; min-width: 34px; padding: 2px 6px; border-radius: 6px;
  font-size: 9.5px; font-weight: 700; letter-spacing: .04em; text-align: center;
  background: color-mix(in srgb, #c08a2e 14%, transparent); color: #9a6a1c;
}
.dm-gate-kind--account { background: color-mix(in srgb, #2f6fb0 12%, transparent); color: #2f6fb0; }
.dm-gate-kind--config { background: var(--tint); color: var(--accent); }
.dm-root[data-theme="dark"] .dm-gate-kind { background: rgba(208, 154, 60, .18); color: #e9be78; }
.dm-root[data-theme="dark"] .dm-gate-kind--account { background: rgba(90, 150, 220, .18); color: #8fbce8; }
.dm-root[data-theme="dark"] .dm-gate-kind--config { background: var(--tint); color: var(--accent); }

.dm-gate-link {
  display: inline-block; margin-top: 4px;
  color: var(--accent); font-size: 11px; font-weight: 600; text-decoration: none;
}
.dm-gate-link:hover { text-decoration: underline; }

/* 安装前的拦截弹窗：和套装弹窗同一套定位与动画，窄一点 */
.dm-gate {
  position: fixed; z-index: 77; top: 50%; left: 50%;
  display: flex; flex-direction: column;
  width: min(620px, calc(100vw - 48px)); max-height: 86vh;
  transform: translate(-50%, -50%);
  border: 1px solid var(--line); border-radius: 20px;
  background: var(--panel);
  box-shadow: 0 30px 90px rgba(0, 0, 0, .3);
  overflow: hidden;
  animation: dm-dialog-in .26s cubic-bezier(.2, .7, .3, 1) both;
}
.dm-gate .dm-suite-head { padding: 20px 22px 12px; }
.dm-gate-note { margin: 0 22px 12px; color: var(--muted); font-size: 12px; line-height: 1.7; }
.dm-gate-list { display: grid; gap: 12px; padding: 0 22px 18px; overflow-y: auto; }
.dm-gate-item {
  padding: 12px 13px; border-radius: 12px;
  border: 1px solid var(--line); background: color-mix(in srgb, var(--panel) 92%, var(--bg));
}
.dm-gate-item-head { display: flex; align-items: center; gap: 9px; margin-bottom: 8px; }
.dm-gate-item-head strong { font-size: 13px; font-weight: 600; }
.dm-gate-tag {
  padding: 1px 6px; border-radius: 5px;
  background: color-mix(in srgb, #c08a2e 14%, transparent); color: #9a6a1c;
  font-size: 9.5px; font-weight: 700; letter-spacing: .02em;
}
.dm-root[data-theme="dark"] .dm-gate-tag { background: rgba(208, 154, 60, .18); color: #e9be78; }
.dm-gate-need { display: flex; align-items: flex-start; gap: 9px; padding: 7px 0 0; }
.dm-gate-need-body { min-width: 0; }
.dm-gate-need-body strong { display: block; font-size: 12.5px; font-weight: 600; color: var(--text); }
.dm-gate-need-body p { margin: 3px 0 0; color: var(--muted); font-size: 11.5px; line-height: 1.65; }
.dm-gate-foot {
  display: flex; align-items: center; justify-content: space-between; gap: 12px;
  margin: auto 0 0; padding: 13px 22px;
  border-top: 1px solid var(--line); color: var(--muted); font-size: 11px;
}
.dm-gate-actions { display: flex; gap: 8px; }

/* 详情里的不兼容提示条 */
.dm-compat-bar {
  display: flex; align-items: center; justify-content: space-between; gap: 12px;
  padding: 11px 13px; margin: 0 0 4px;
  border: 1px solid color-mix(in srgb, #c05050 22%, var(--line));
  border-radius: 11px;
  background: color-mix(in srgb, #c05050 6%, transparent);
}
.dm-compat-bar strong { display: block; color: #b6463f; font-size: 11.5px; font-weight: 700; }
.dm-compat-bar span { display: block; margin-top: 2px; color: var(--muted); font-size: 10.5px; line-height: 1.45; }
.dm-compat-bar > div { min-width: 0; flex: 1 1 auto; }
.dm-compat-bar .dm-btn { flex: none; min-height: 32px; font-size: 11.5px; white-space: nowrap; }

/* 发布前体检的结论条：和兼容条长得像，但 warn 用中性色，只有真装不上才红 */
.dm-check {
  display: flex; align-items: flex-start; gap: 12px;
  padding: 11px 13px; margin: 0 0 4px;
  border: 1px solid color-mix(in srgb, var(--accent) 18%, var(--line));
  border-radius: 11px;
  background: color-mix(in srgb, var(--tint) 55%, transparent);
}
.dm-check strong { display: block; color: var(--accent); font-size: 11.5px; font-weight: 700; }
.dm-check span { display: block; margin-top: 2px; color: var(--muted); font-size: 10.5px; line-height: 1.45; }
.dm-check > div { min-width: 0; flex: 1 1 auto; }
.dm-check--bad {
  border-color: color-mix(in srgb, #c05050 26%, var(--line));
  background: color-mix(in srgb, #c05050 8%, transparent);
}
.dm-check--bad strong { color: #b6463f; }
.dm-detail-foot {
  position: sticky; bottom: -24px; z-index: 2;
  display: flex; align-items: center; justify-content: space-between; gap: 16px;
  margin: auto -24px -24px; padding: 18px 24px max(18px, env(safe-area-inset-bottom));
  border-top: 1px solid var(--line);
  background: var(--panel);
}
.dm-detail-foot .dm-btn { min-width: 92px; min-height: 38px; }

/* ── 提示条 ───────────────────────────────────────────────────────────── */
.dm-toast {
  position: fixed; right: 24px; bottom: 24px; z-index: 90;
  display: flex; align-items: center; gap: 14px;
  max-width: min(440px, calc(100vw - 32px));
  padding: 14px 16px;
  border-radius: 13px;
  background: var(--hero); color: #eef4ee;
  font-size: 12px;
  box-shadow: 0 12px 40px rgba(0, 0, 0, .22);
  animation: dm-rise .18s ease-out;
}
.dm-toast > span { min-width: 0; overflow-wrap: anywhere; }
.dm-toast--error { background: #5c2424; }
.dm-toast button {
  display: grid; place-items: center; flex: 0 0 26px;
  width: 26px; height: 26px; padding: 0;
  border: 0; border-radius: 7px;
  background: rgba(255, 255, 255, .12); color: inherit; font-size: 17px;
}
@keyframes dm-rise { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: none; } }

/* ── 页面容器（侧栏整页时用） ─────────────────────────────────────────── */
.dm-page { height: 100%; min-width: 0; overflow: auto; }
.dm-page .dm-root { height: auto; min-height: 100%; overflow: visible; }

/* ── 入场 ─────────────────────────────────────────────────────────────── */
.dm-appear { animation: dm-rise .34s cubic-bezier(.2, .7, .3, 1) backwards; }

/* ── 页脚署名（版权信息，请勿移除） ───────────────────────────────────── */
.dm-footer {
  display: flex; flex-wrap: wrap; align-items: center; justify-content: center; gap: 6px;
  margin-top: 10px; padding-top: 16px;
  border-top: 1px solid var(--line);
  color: var(--muted); font-size: 11px;
}
.dm-footer a { color: var(--muted); text-decoration: none; }
.dm-footer a:hover { color: var(--accent); text-decoration: underline; }
.dm-footer strong { color: var(--text); font-weight: 600; }

/* ── 统一的可交互反馈：所有可点的方块都会轻微上浮 ─────────────────────── */
.dm-mini,
.dm-suite-card,
.dm-suite-tile,
.dm-palette-item,
.dm-related-item,
.dm-ghost,
.dm-btn,
.dm-chip,
.dm-card {
  transition: transform .16s cubic-bezier(.2, .7, .3, 1), box-shadow .16s ease,
    border-color .16s ease, background .16s ease, color .16s ease;
}
.dm-mini:hover,
.dm-suite-tile:hover,
.dm-palette-item:hover,
.dm-related-item:hover,
.dm-ghost:hover,
.dm-btn:hover:not(:disabled) {
  transform: translateY(-2px);
}
.dm-mini:hover,
.dm-suite-tile:hover,
.dm-palette-item:hover,
.dm-related-item:hover,
.dm-ghost:hover {
  box-shadow: 0 8px 20px rgba(21, 59, 48, .12);
}
.dm-mini:active,
.dm-suite-tile:active,
.dm-palette-item:active,
.dm-related-item:active,
.dm-ghost:active,
.dm-btn:active:not(:disabled) {
  transform: translateY(0);
  box-shadow: none;
}
@media (prefers-reduced-motion: reduce) {
  .dm-mini:hover, .dm-suite-tile:hover, .dm-palette-item:hover,
  .dm-related-item:hover, .dm-ghost:hover, .dm-btn:hover:not(:disabled) { transform: none; }
}

/* ── 响应式 ───────────────────────────────────────────────────────────── */
@media (max-width: 1100px) {
  .dm-root { padding: 26px 26px 56px; gap: 22px; }
  .dm-heading h1 { font-size: 30px; }
  .dm-banner { padding: 28px; }
  .dm-banner h2 { font-size: 28px; }
}
/* 1000px 以上保持三列与插画；以下才降级 */
@media (max-width: 999px) {
  .dm-banner { grid-template-columns: 1fr; }
  .dm-art { display: none; }
  .dm-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
}
@media (max-width: 720px) {
  .dm-root { padding: 22px 16px 48px; gap: 20px; }
  .dm-heading { align-items: flex-start; flex-direction: column; }
  .dm-heading h1 { font-size: 27px; }
  .dm-banner h2 { font-size: 24px; }
  .dm-minis,
  .dm-grid { grid-template-columns: minmax(0, 1fr); }
  .dm-catalog-head { align-items: stretch; flex-direction: column; }
  .dm-detail { width: 100vw; padding: 20px; }
  .dm-detail-head { top: -20px; margin: -20px -20px 0; padding: 20px; }
  .dm-detail-foot { bottom: -20px; margin: auto -20px -20px; padding-inline: 20px; }
  .dm-toast { right: 16px; bottom: 16px; }
}

@media (prefers-reduced-motion: reduce) {
  .dm-root *,
  .dm-root *::before,
  .dm-root *::after { animation: none !important; transition: none !important; scroll-behavior: auto !important; }
  .dm-card:hover { transform: none; }
  .dm-card::after { display: none; }
}

@media (forced-colors: active) {
  .dm-card[aria-current="true"],
  .dm-chip[aria-pressed="true"] { outline: 2px solid Highlight; outline-offset: -2px; }
  .dm-mask { background: CanvasText; opacity: .35; }
}

/* ── 布局切换 ─────────────────────────────────────────────────────────── */
.dm-layout { display: flex; gap: 6px; align-items: center; }
.dm-layout button {
  display: grid; place-items: center;
  width: 34px; height: 34px; padding: 0;
  border: 1px solid var(--line); border-radius: 9px;
  background: var(--panel); color: var(--muted); font-size: 14px;
  transition: background .15s, color .15s, border-color .15s;
}
.dm-layout button:hover { border-color: var(--accent); color: var(--accent); }
.dm-layout button[aria-pressed="true"] {
  background: var(--tint); color: var(--accent);
  border-color: color-mix(in srgb, var(--accent) 35%, var(--line));
}

/* 列表模式：一条一行，信息横排 */
.dm-grid.dm-list { grid-template-columns: 1fr; gap: 10px; }
.dm-grid.dm-list .dm-card { flex-direction: row; align-items: center; min-height: 0; padding: 14px 18px; gap: 16px; }
.dm-grid.dm-list .dm-card-top { flex: 0 0 250px; }
.dm-grid.dm-list .dm-desc { flex: 1 1 auto; min-height: 0; margin: 0; -webkit-line-clamp: 1; }
.dm-grid.dm-list .dm-foot { margin-top: 0; flex: 0 0 auto; gap: 16px; }
.dm-grid.dm-list .dm-card:hover { transform: none; }
.dm-grid.dm-list .dm-card::after { display: none; }

/* ── 快捷搜索 ─────────────────────────────────────────────────────────── */
.dm-palette-mask { position: fixed; inset: 0; z-index: 95; background: rgba(21, 63, 50, .32); animation: dm-fade .14s ease-out; }
.dm-palette {
  position: fixed; z-index: 96; top: 12vh; left: 50%;
  display: flex; flex-direction: column;
  width: min(620px, calc(100vw - 40px)); max-height: 62vh;
  transform: translateX(-50%);
  border: 1px solid var(--line); border-radius: 16px;
  background: var(--panel);
  box-shadow: 0 24px 70px rgba(0, 0, 0, .3);
  overflow: hidden;
  animation: dm-swap .18s ease-out;
}
.dm-palette input {
  width: 100%; padding: 16px 18px;
  border: 0; border-bottom: 1px solid var(--line);
  background: transparent; color: inherit; font-size: 14px;
}
.dm-palette input:focus { outline: none; }
.dm-palette-list { flex: 1 1 auto; overflow-y: auto; padding: 6px; }
.dm-palette-item {
  display: flex; align-items: center; gap: 12px; width: 100%;
  padding: 9px 12px; border: 0; border-radius: 10px;
  background: transparent; text-align: left;
}
.dm-palette-item[aria-selected="true"] { background: var(--tint); }
.dm-palette-item .dm-thumb { width: 34px; height: 34px; border-radius: 9px; font-size: 15px; }
.dm-palette-item .dm-thumb img { width: 22px; height: 22px; }
.dm-palette-name { min-width: 0; }
.dm-palette-name strong {
  display: block; font-size: 13.5px; font-weight: 650;
  overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
}
.dm-palette-name small { color: var(--muted); font-size: 11px; }
.dm-palette-empty { padding: 26px; text-align: center; color: var(--muted); font-size: 12.5px; }
.dm-palette-hint {
  display: flex; gap: 16px; padding: 9px 16px;
  border-top: 1px solid var(--line);
  color: var(--muted); font-size: 11px;
}
.dm-palette-hint kbd {
  padding: 1px 5px; border: 1px solid var(--line); border-radius: 5px;
  background: var(--tint); font: inherit; font-size: 10px;
}

/* ── 相关推荐 ─────────────────────────────────────────────────────────── */
.dm-related { display: flex; flex-direction: column; gap: 6px; }
.dm-related-title { color: var(--muted); font-size: 11px; font-weight: 600; letter-spacing: .08em; text-transform: uppercase; }
.dm-related-item {
  display: flex; align-items: center; gap: 10px; width: 100%;
  padding: 8px 10px; border: 1px solid transparent; border-radius: 10px;
  background: transparent; text-align: left;
  transition: background .15s;
}
.dm-related-item:hover { background: var(--tint); }
.dm-related-item .dm-thumb { width: 30px; height: 30px; border-radius: 8px; font-size: 13px; }
.dm-related-item .dm-thumb img { width: 20px; height: 20px; }
.dm-related-name { min-width: 0; }
.dm-related-name strong {
  display: block; font-size: 12.5px; font-weight: 600;
  overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
}
.dm-related-name small { color: var(--muted); font-size: 10.5px; }

/* ── 场景套装 ─────────────────────────────────────────────────────────── */
.dm-suite-grid { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 14px; }
.dm-suite-card {
  display: flex; flex-direction: column; align-items: flex-start; gap: 6px;
  padding: 18px; text-align: left;
  border: 1px solid var(--line); border-radius: 16px; background: var(--panel);
  transition: border-color .16s, box-shadow .16s, transform .16s;
}
.dm-suite-card:hover {
  border-color: color-mix(in srgb, var(--accent) 38%, var(--line));
  box-shadow: 0 10px 26px rgba(21, 59, 48, .12);
  transform: translateY(-2px);
}
.dm-suite-glyph {
  display: grid; place-items: center; width: 38px; height: 38px; margin-bottom: 4px;
  border-radius: 11px; background: var(--tint); color: var(--accent); font-size: 18px;
}
.dm-suite-card strong { font-size: 14.5px; font-weight: 700; }
.dm-suite-label {
  color: var(--accent); font-size: 10.5px; font-weight: 600;
  letter-spacing: .1em; text-transform: uppercase; opacity: .8;
}
.dm-suite-desc { color: var(--muted); font-size: 12px; line-height: 1.6; }
.dm-suite-foot {
  display: flex; align-items: center; justify-content: space-between; width: 100%;
  margin-top: 6px; color: var(--muted); font-size: 11px;
}

/* 套装弹窗 */
.dm-suite-mask { position: fixed; inset: 0; z-index: 76; background: rgba(21, 63, 50, .4); animation: dm-fade .16s ease-out; }
.dm-suite-dialog {
  position: fixed; z-index: 77; top: 50%; left: 50%;
  display: flex; flex-direction: column;
  width: min(880px, calc(100vw - 48px)); max-height: 86vh;
  transform: translate(-50%, -50%);
  border: 1px solid var(--line); border-radius: 20px;
  background: var(--panel);
  box-shadow: 0 30px 90px rgba(0, 0, 0, .3);
  overflow: hidden;
  animation: dm-dialog-in .26s cubic-bezier(.2, .7, .3, 1) both;
}
/* 动画必须带上 -50% 的位移，否则会从左边「飞」过来 */
@keyframes dm-dialog-in {
  from { opacity: 0; transform: translate(-50%, calc(-50% + 10px)) scale(.985); }
  to { opacity: 1; transform: translate(-50%, -50%) scale(1); }
}
.dm-suite-head {
  display: flex; align-items: flex-start; justify-content: space-between; gap: 12px;
  padding: 20px 24px 14px;
}
.dm-suite-eyebrow { color: var(--muted); font-size: 10.5px; font-weight: 600; letter-spacing: .14em; text-transform: uppercase; }
.dm-suite-head h2 { margin: 6px 0 0; font-size: 21px; font-weight: 750; letter-spacing: -.02em; }
.dm-suite-head .dm-close { flex: none; }
.dm-suite-body {
  display: grid; grid-template-columns: 300px minmax(0, 1fr); gap: 22px;
  padding: 0 24px 4px; overflow-y: auto;
}
.dm-suite-intro { display: flex; flex-direction: column; gap: 10px; }
.dm-suite-symbol {
  display: grid; place-items: center; width: 48px; height: 48px;
  border-radius: 14px; background: var(--tint); color: var(--accent); font-size: 22px;
}
.dm-suite-intro h3 { margin: 4px 0 0; font-size: 16px; font-weight: 700; }
.dm-suite-intro p { margin: 0; color: var(--muted); font-size: 12.5px; line-height: 1.75; }
.dm-suite-stats { display: flex; flex-wrap: wrap; gap: 6px; }
.dm-suite-stats span {
  padding: 3px 8px; border-radius: 6px; background: var(--tint);
  color: var(--accent); font-size: 10.5px; font-variant-numeric: tabular-nums;
}
.dm-suite-actions { display: flex; flex-direction: column; gap: 8px; margin-top: 6px; }
.dm-suite-actions .dm-btn { justify-content: center; min-height: 38px; }
/* 弹窗里两个按钮要有主次：安装所选实心，全部获取描边 */
.dm-suite-actions .dm-btn--primary {
  background: var(--accent); color: #fff; box-shadow: 0 6px 18px rgba(21, 59, 48, .18);
}
.dm-suite-actions .dm-btn--primary:hover:not(:disabled) { filter: brightness(1.06); background: var(--accent); }
.dm-root[data-theme="dark"] .dm-suite-actions .dm-btn--primary { color: #141c19; }
.dm-suite-actions .dm-btn:not(.dm-btn--primary) {
  background: transparent; color: var(--text); border: 1px solid var(--line);
}
.dm-suite-actions .dm-btn:not(.dm-btn--primary):hover:not(:disabled) {
  background: var(--tint); border-color: var(--accent); color: var(--accent);
}

.dm-suite-picker { display: flex; flex-direction: column; gap: 10px; min-width: 0; }
.dm-suite-picker-head { display: flex; align-items: center; justify-content: space-between; gap: 10px; }
.dm-suite-picker-head > span { color: var(--muted); font-size: 11.5px; font-weight: 600; }
.dm-suite-links { display: flex; gap: 10px; }
.dm-suite-links button {
  padding: 0; border: 0; background: transparent; color: var(--accent);
  font-size: 11.5px; text-decoration: underline; text-underline-offset: 3px;
}
.dm-suite-links button:disabled { opacity: .4; cursor: default; }
.dm-suite-tiles { display: flex; flex-direction: column; gap: 10px; }
/* 有分组的套装：每组一个框，标题在框里，框里才是可选项 */
.dm-suite-block {
  display: flex; flex-direction: column; gap: 9px;
  padding: 11px 11px 12px;
  border: 1px solid var(--line); border-radius: 17px;
  background: color-mix(in oklab, var(--tint) 30%, transparent);
}
.dm-suite-block.is-plain { background: transparent; border-style: dashed; }
.dm-suite-block-head { display: flex; align-items: baseline; gap: 7px; padding: 0 3px; }
.dm-suite-block-head strong {
  color: var(--accent); font-size: 11.5px; font-weight: 750; letter-spacing: .04em;
}
.dm-suite-block-head em {
  margin-left: auto; color: var(--muted); font-size: 10px; font-style: normal;
  font-variant-numeric: tabular-nums;
}
.dm-suite-block-min {
  padding: 1px 6px; border-radius: 5px;
  background: color-mix(in oklab, var(--accent) 14%, transparent);
  color: var(--accent); font-size: 10px; font-variant-numeric: tabular-nums;
}
.dm-suite-block-hint { padding: 0 3px; color: var(--muted); font-size: 10.5px; line-height: 1.6; }
.dm-suite-block-body { display: flex; flex-direction: column; gap: 8px; }
.dm-suite-group { display: flex; flex-direction: column; gap: 3px; margin-top: 6px; }
.dm-suite-group-head { display: flex; align-items: baseline; justify-content: space-between; gap: 8px; }
.dm-suite-group-head strong { color: var(--accent); font-size: 11.5px; font-weight: 700; letter-spacing: .04em; }
.dm-suite-group-head span {
  padding: 1px 6px; border-radius: 5px; background: var(--tint);
  color: var(--accent); font-size: 10px; font-variant-numeric: tabular-nums;
}
.dm-suite-group-hint { color: var(--muted); font-size: 10.5px; line-height: 1.6; }
/* 套装里选中某项后，原地展开它「装之前还缺什么」 */
.dm-suite-pair { display: flex; flex-direction: column; }
.dm-suite-pair.is-open .dm-suite-tile {
  border-bottom-color: transparent;
  border-bottom-left-radius: 0; border-bottom-right-radius: 0;
}
.dm-suite-needs {
  display: flex; flex-direction: column; gap: 9px;
  padding: 11px 14px 13px;
  border: 1px solid color-mix(in oklab, var(--accent) 26%, var(--line));
  border-top: 0; border-radius: 0 0 14px 14px;
  background: color-mix(in oklab, var(--tint) 50%, var(--panel));
  animation: dm-fade .18s ease-out;
}
.dm-suite-needs-head {
  display: flex; align-items: center; gap: 7px;
  color: var(--accent); font-size: 10.5px; font-weight: 700; letter-spacing: .04em;
}
.dm-suite-needs-head em {
  padding: 1px 6px; border-radius: 5px;
  background: color-mix(in oklab, var(--accent) 14%, transparent);
  font-size: 10px; font-style: normal; font-weight: 600;
}
.dm-suite-need { display: flex; align-items: flex-start; gap: 9px; }
.dm-suite-need > .dm-gate-kind { flex: none; margin-top: 1px; }
/* 需要下载的软件：默认勾上，装插件时顺手打开下载页 */
.dm-need-check {
  flex: none; width: 13px; height: 13px; margin: 2px 0 0;
  accent-color: var(--accent); cursor: pointer;
}
.dm-need-dl { flex: none; margin: 0 0 0 auto; align-self: flex-start; white-space: nowrap; }
.dm-suite-need-body { display: flex; flex-direction: column; gap: 2px; min-width: 0; }
.dm-suite-need-body strong { font-size: 11.5px; font-weight: 650; color: var(--text); }
.dm-suite-need-body p { margin: 0; color: var(--muted); font-size: 10.5px; line-height: 1.6; }
/* 「发布页」这类次要出口，贴着说明文字走 */
.dm-need-alt {
  align-self: flex-start; margin-top: 1px;
  font-size: 10.5px; color: var(--muted) !important;
  text-decoration: underline; text-underline-offset: 2px;
}
.dm-need-alt:hover { color: var(--accent) !important; }
.dm-need-auto {
  margin: 3px 0 0;
  font-size: 11px; line-height: 1.6;
  color: color-mix(in srgb, var(--accent) 78%, var(--muted));
}
.dm-suite-warn {
  margin-top: 2px; padding: 8px 10px;
  border-radius: 9px;
  background: color-mix(in srgb, #c05050 10%, transparent);
  color: #b6463f; font-size: 11px; line-height: 1.6;
}
.dm-suite-tile {
  display: flex; flex-direction: column; gap: 8px;
  padding: 12px 14px;
  border: 1px solid var(--line); border-radius: 14px; background: var(--panel);
  cursor: pointer;
  transition: border-color .15s, background .15s;
}
.dm-suite-tile:hover { border-color: color-mix(in srgb, var(--accent) 32%, var(--line)); }
.dm-suite-tile.is-picked { background: color-mix(in srgb, var(--accent) 5%, var(--panel)); border-color: color-mix(in srgb, var(--accent) 30%, var(--line)); }
.dm-suite-tile.is-required { cursor: default; }
.dm-suite-tile-top { display: flex; align-items: center; gap: 11px; min-width: 0; }
.dm-suite-tile .dm-thumb { width: 36px; height: 36px; border-radius: 10px; font-size: 15px; }
.dm-suite-tile .dm-thumb img { width: 24px; height: 24px; }
.dm-suite-tile-name { flex: 1 1 auto; min-width: 0; }
.dm-suite-tile-name strong { display: block; font-size: 13.5px; font-weight: 650; }
.dm-suite-tile-name small { display: block; margin-top: 2px; color: var(--muted); font-size: 11px; line-height: 1.5; }
.dm-suite-tile input {
  flex: none; width: 17px; height: 17px; accent-color: var(--accent); cursor: pointer;
}
.dm-suite-tile input:disabled { cursor: default; opacity: .55; }
.dm-suite-tile-foot {
  display: flex; align-items: center; justify-content: space-between; gap: 10px;
  color: var(--muted); font-size: 10.5px;
}

.dm-suite-plan {
  display: flex; align-items: baseline; justify-content: space-between; gap: 12px;
  padding: 12px 24px; border-top: 1px solid var(--line);
  color: var(--muted); font-size: 11px;
}
.dm-suite-plan strong { color: var(--text); font-size: 12px; font-weight: 650; }
.dm-suite-queue { display: flex; flex-direction: column; gap: 8px; padding: 0 24px 18px; max-height: 210px; overflow-y: auto; }
.dm-suite-queue-head { display: flex; align-items: baseline; justify-content: space-between; gap: 10px; font-size: 11.5px; }
.dm-suite-queue-head strong { font-size: 12.5px; font-weight: 650; }
.dm-suite-meter { height: 4px; border-radius: 99px; background: var(--tint); overflow: hidden; }
.dm-suite-meter span { display: block; height: 100%; border-radius: 99px; background: var(--accent); transition: width .3s ease; }
.dm-suite-job { display: flex; flex-wrap: wrap; align-items: center; gap: 8px; font-size: 11.5px; color: var(--muted); }
.dm-suite-job-icon { width: 16px; text-align: center; }
.dm-suite-job[data-state="done"] .dm-suite-job-icon { color: var(--accent); }
.dm-suite-job[data-state="restart"] .dm-suite-job-icon { color: #b07d22; }
.dm-suite-job[data-state="restart"] .dm-suite-job-status { color: #8a6420; }
.dm-suite-job[data-state="error"] .dm-suite-job-icon { color: #c05050; }
.dm-suite-job[data-state="error"] .dm-suite-job-status { color: #b6463f; }
.dm-suite-job-name { flex: 1 1 auto; min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.dm-suite-job-status { flex: none; }
/* 真失败时把原因摊开，否则只看到「失败」两个字没法排查 */
.dm-suite-job-note {
  flex: 1 0 100%;
  margin: -2px 0 2px 24px;
  color: color-mix(in srgb, #c05050 78%, var(--muted));
  font-size: 10.5px; line-height: 1.55;
  display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical;
  overflow: hidden;
}
.dm-suite-state { flex: none; color: var(--muted); font-size: 11px; white-space: nowrap; }
.dm-suite-state--error { color: #c05050; }
.dm-btn--danger { background: transparent; color: #b6463f; border: 1px solid color-mix(in srgb, #b6463f 35%, var(--line)); }
.dm-btn--danger:hover:not(:disabled) { background: color-mix(in srgb, #b6463f 10%, transparent); }

/* 连接助手：NapCat 桥的扫码/在线状态 */
.dm-conn-btn { gap: 6px; }
.dm-conn-dot {
  display: inline-block; flex: none;
  width: 7px; height: 7px; border-radius: 99px;
  background: var(--muted);
  box-shadow: 0 0 0 3px color-mix(in srgb, var(--muted) 14%, transparent);
  transition: background .2s ease, box-shadow .2s ease;
}
.dm-conn-dot.is-on { background: var(--accent); box-shadow: 0 0 0 3px color-mix(in srgb, var(--accent) 18%, transparent); }
.dm-conn-dot.is-warn { background: #d09a3c; box-shadow: 0 0 0 3px rgba(208, 154, 60, .18); animation: dm-conn-pulse 2.2s ease-in-out infinite; }
.dm-conn-dot.is-off { background: color-mix(in srgb, var(--muted) 65%, transparent); box-shadow: none; }
@keyframes dm-conn-pulse {
  0%, 100% { box-shadow: 0 0 0 3px rgba(208, 154, 60, .16); }
  50% { box-shadow: 0 0 0 6px rgba(208, 154, 60, .06); }
}

.dm-conn-dialog {
  position: fixed; z-index: 77; top: 50%; left: 50%;
  display: flex; flex-direction: column;
  width: min(820px, calc(100vw - 48px)); max-height: 86vh;
  transform: translate(-50%, -50%);
  border: 1px solid var(--line); border-radius: 20px;
  background: var(--panel);
  box-shadow: 0 30px 90px rgba(0, 0, 0, .3);
  overflow: hidden;
  animation: dm-dialog-in .26s cubic-bezier(.2, .7, .3, 1) both;
}
.dm-conn-body {
  display: grid; grid-template-columns: minmax(0, 1fr) 260px; gap: 22px;
  padding: 0 24px 18px; overflow-y: auto;
}
.dm-conn-intro { display: flex; flex-direction: column; gap: 10px; min-width: 0; }
.dm-conn-pill {
  display: inline-flex; align-items: center; gap: 7px; align-self: flex-start;
  padding: 5px 11px; border-radius: 99px;
  background: var(--tint); color: var(--accent);
  font-size: 11.5px; font-weight: 650;
}
.dm-conn-pill.is-warn { background: rgba(208, 154, 60, .14); color: #8a6420; }
.dm-conn-pill.is-off { background: color-mix(in srgb, var(--muted) 12%, transparent); color: var(--muted); }
.dm-conn-pill .dm-conn-dot { width: 6px; height: 6px; box-shadow: none; }
.dm-conn-pill.is-warn .dm-conn-dot { animation: none; }
.dm-conn-lead { margin: 0; color: var(--muted); font-size: 12.5px; line-height: 1.75; }
.dm-conn-ok { margin: 0; color: var(--accent); font-size: 12.5px; line-height: 1.7; }
.dm-conn-step-title { margin-top: 2px; font-size: 12px; font-weight: 700; color: var(--text); }
.dm-conn-steps {
  margin: 0; padding: 0; list-style: none;
  counter-reset: conn;
  display: flex; flex-direction: column; gap: 7px;
}
.dm-conn-steps li {
  position: relative; padding-left: 24px;
  color: var(--muted); font-size: 12px; line-height: 1.6;
}
.dm-conn-steps li::before {
  counter-increment: conn; content: counter(conn);
  position: absolute; left: 0; top: 1px;
  display: grid; place-items: center;
  width: 17px; height: 17px; border-radius: 6px;
  background: var(--tint); color: var(--accent);
  font-size: 10px; font-weight: 700;
}
.dm-conn-warn {
  padding: 9px 11px; border-radius: 10px;
  background: rgba(208, 154, 60, .12);
  color: #8a6420; font-size: 11.5px; line-height: 1.65;
}
/* 一键接通：一个输入框 + 一串进度 + 一张码，全在连接弹窗里完成 */
.dm-setup { display: flex; flex-direction: column; gap: 10px; margin-top: 4px; }
.dm-setup-row { display: flex; align-items: center; gap: 8px; }
.dm-setup-input {
  flex: 1; min-width: 0; height: 34px; padding: 0 10px;
  border: 1px solid var(--line, #dcdcd6); border-radius: 9px;
  background: var(--surface, #fff); color: inherit; font-size: 13px;
}
.dm-setup-input::placeholder { color: #9a9a94; }
/* 装到哪：路径要能让用户看见，也能改 */
.dm-setup-path { display: flex; align-items: center; gap: 8px; }
.dm-setup-path > span {
  flex: none; width: 34px; font-size: 11.5px; font-weight: 700; color: #6f6f69;
}
.dm-setup-input--path { font-size: 11.5px; font-family: ui-monospace, SFMono-Regular, Menlo, monospace; }
.dm-setup-hint { margin: 0; font-size: 11.5px; line-height: 1.65; color: #6f6f69; }
.dm-setup-steps {
  list-style: none; margin: 0; padding: 0;
  display: flex; flex-direction: column; gap: 6px;
  max-height: 176px; overflow: auto;
}
.dm-setup-steps li {
  display: flex; align-items: flex-start; gap: 7px;
  font-size: 11.5px; line-height: 1.55; color: #4a4a45;
}
.dm-setup-mark { flex: none; width: 14px; text-align: center; color: #9a9a94; }
.dm-setup-steps li[data-state="ok"] .dm-setup-mark { color: #2f7d4f; }
.dm-setup-steps li[data-state="fail"] { color: #a33a34; }
.dm-setup-steps li[data-state="fail"] .dm-setup-mark { color: #a33a34; }
/* 套装里勾「顺便接通」：两个号 + 一句说明，装完重启就能自动跑 */
.dm-suite-connect {
  margin-top: 14px; padding: 12px 14px; border-radius: 12px;
  border: 1px solid var(--line, #dcdcd6); background: rgba(255, 255, 255, .55);
}
.dm-suite-connect-head {
  display: flex; align-items: center; gap: 8px;
  font-size: 12.5px; font-weight: 700; color: inherit; cursor: pointer;
}
.dm-suite-connect-head input { width: 15px; height: 15px; accent-color: #2c6e49; }
.dm-suite-connect-fields { display: flex; flex-wrap: wrap; gap: 8px; margin-top: 10px; }
.dm-suite-connect-fields .dm-setup-input { flex: 1 1 150px; }
.dm-suite-connect-hint {
  flex: 1 1 100%; margin: 0; font-size: 11.5px; line-height: 1.7; color: #6f6f69;
}
/* 上次留的「顺便接通」，重启后 host 自己跑完了，结果摆在这里 */
.dm-conn-resume {
  margin: 10px 0 0; padding: 10px 12px; border-radius: 10px;
  font-size: 11.5px; line-height: 1.65;
}
.dm-conn-resume.is-ok { background: rgba(47, 125, 79, .12); color: #2f6b46; }
.dm-conn-resume.is-bad { background: rgba(163, 58, 52, .12); color: #8a3a34; }
.dm-setup-qr { display: flex; align-items: center; gap: 12px; }
.dm-setup-qr img {
  width: 128px; height: 128px; border-radius: 10px;
  background: #fff; border: 1px solid #e4e4de;
}
.dm-setup-qr span { font-size: 11.5px; line-height: 1.6; color: #6f6f69; }
.dm-setup-done { font-size: 12px; font-weight: 700; color: #2f7d4f; }
.dm-root[data-theme="dark"] .dm-setup-input { background: rgba(255, 255, 255, .06); border-color: rgba(255, 255, 255, .16); }
.dm-root[data-theme="dark"] .dm-setup-hint,
.dm-root[data-theme="dark"] .dm-setup-path > span,
.dm-root[data-theme="dark"] .dm-setup-steps li,
.dm-root[data-theme="dark"] .dm-setup-qr span { color: #b6b6ae; }

/* 「下载 NapCat 一键包」：比正文重一点，但不抢主按钮 */
.dm-conn-dl {
  display: inline-flex; align-items: center; gap: 4px;
  align-self: flex-start;
  margin-top: 2px; padding: 6px 11px;
  border: 1px dashed color-mix(in srgb, var(--accent) 45%, transparent);
  border-radius: 999px;
  color: var(--accent); font-size: 11.5px; font-weight: 600;
  text-decoration: none;
  transition: background .18s ease, border-color .18s ease;
}
.dm-conn-dl:hover {
  background: color-mix(in srgb, var(--accent) 8%, transparent);
  border-style: solid;
}
/* 深色下琥珀色要提亮，否则压在深底上读不清 */
.dm-root[data-theme="dark"] .dm-conn-pill.is-warn { background: rgba(208, 154, 60, .18); color: #e9be78; }
.dm-root[data-theme="dark"] .dm-conn-warn { background: rgba(208, 154, 60, .16); color: #e9c286; }
.dm-conn-actions { display: flex; flex-wrap: wrap; gap: 8px; margin-top: 4px; }
.dm-conn-actions .dm-btn { min-height: 34px; }
.dm-conn-actions .dm-btn--primary {
  background: var(--accent); color: #fff; box-shadow: 0 6px 18px rgba(21, 59, 48, .18);
}
.dm-conn-actions .dm-btn--primary:hover:not(:disabled) { filter: brightness(1.06); background: var(--accent); }
.dm-root[data-theme="dark"] .dm-conn-actions .dm-btn--primary { color: #141c19; }

.dm-conn-side { display: flex; flex-direction: column; gap: 10px; min-width: 0; }
.dm-conn-qr {
  position: relative; display: grid; place-items: center;
  min-height: 210px; padding: 12px;
  border: 1px dashed color-mix(in srgb, var(--line) 90%, transparent);
  border-radius: 16px; background: color-mix(in srgb, var(--panel) 92%, var(--tint));
  overflow: hidden;
}
.dm-conn-qr img {
  position: relative; z-index: 1;
  width: 100%; max-width: 210px; height: auto;
  border-radius: 8px; background: #fff; padding: 6px;
  image-rendering: pixelated;
}
.dm-conn-qr-empty { position: absolute; z-index: 0; max-width: 150px; color: var(--muted); font-size: 11.5px; text-align: center; line-height: 1.6; }
.dm-conn-qr.is-on { border-style: solid; border-color: color-mix(in srgb, var(--accent) 34%, var(--line)); background: color-mix(in srgb, var(--accent) 8%, var(--panel)); }
.dm-conn-qr-done { display: flex; flex-direction: column; align-items: center; gap: 6px; color: var(--accent); }
.dm-conn-qr-done strong { font-size: 30px; line-height: 1; }
.dm-conn-qr-done span { font-size: 11.5px; color: var(--muted); }
.dm-conn-bili {
  padding: 12px 14px; border: 1px solid var(--line); border-radius: 14px;
  background: color-mix(in srgb, var(--tint) 45%, var(--panel));
}
.dm-conn-bili strong { display: block; font-size: 12.5px; font-weight: 700; }
.dm-conn-bili p { margin: 4px 0 0; color: var(--muted); font-size: 11.5px; line-height: 1.65; }
.dm-conn-foot {
  padding: 11px 24px; border-top: 1px solid var(--line);
  color: var(--muted); font-size: 11px;
}

@media (max-width: 860px) {
  .dm-conn-body { grid-template-columns: minmax(0, 1fr); }
  .dm-conn-side { flex-direction: row; align-items: stretch; }
  .dm-conn-qr { flex: 0 0 180px; min-height: 180px; }
  .dm-conn-bili { flex: 1 1 auto; }
}
@media (max-width: 720px) {
  .dm-conn-dialog { width: 100vw; max-height: 100vh; border-radius: 0; }
  .dm-conn-body, .dm-conn-foot { padding-inline: 16px; }
  .dm-conn-side { flex-direction: column; }
  .dm-conn-qr { flex: none; }
}
@media (prefers-reduced-motion: reduce) {
  .dm-conn-dot.is-warn { animation: none; }
  .dm-conn-dialog { animation: none; }
}

@media (max-width: 999px) {
  .dm-suite-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
  .dm-suite-body { grid-template-columns: minmax(0, 1fr); }
}
@media (max-width: 720px) {
  .dm-suite-grid { grid-template-columns: minmax(0, 1fr); }
  .dm-suite-dialog { width: 100vw; max-height: 100vh; top: 50%; border-radius: 0; }
  .dm-suite-head, .dm-suite-body, .dm-suite-plan, .dm-suite-queue { padding-inline: 16px; }
}


/* ── B站登录 ──────────────────────────────────────────────── */
.dm-bili-mask {
  position: fixed;
  inset: 0;
  z-index: 84;
  background: rgba(21, 63, 50, 0.42);
  animation: dm-fade 0.16s ease-out;
}

.dm-bili-dialog {
  position: fixed;
  z-index: 85;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: min(720px, calc(100vw - 48px));
  max-height: 86vh;
  display: flex;
  flex-direction: column;
  background: var(--panel);
  border: 1px solid var(--line);
  border-radius: 22px;
  box-shadow: 0 30px 80px rgba(15, 25, 20, 0.24);
  overflow: hidden;
  animation: dm-dialog-in 0.26s cubic-bezier(0.2, 0.7, 0.3, 1) both;
}

.dm-bili-body {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 240px;
  gap: 22px;
  padding: 18px 22px 22px;
  overflow-y: auto;
}

.dm-bili-main {
  display: flex;
  flex-direction: column;
  gap: 12px;
  min-width: 0;
}

.dm-bili-pill {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  align-self: flex-start;
  padding: 5px 11px;
  border-radius: 999px;
  background: color-mix(in oklab, var(--accent) 12%, transparent);
  color: var(--accent);
  font-size: 12px;
}

.dm-bili-lead {
  margin: 0;
  font-size: 13px;
  line-height: 1.62;
  color: var(--muted);
}

.dm-bili-side { display: flex; }

.dm-bili-qr {
  flex: 1;
  display: grid;
  place-items: center;
  gap: 10px;
  min-height: 210px;
  padding: 12px;
  border: 1px solid var(--line);
  border-radius: 16px;
  background: color-mix(in oklab, var(--tint) 34%, transparent);
}

.dm-bili-qr img {
  width: 190px;
  height: 190px;
  padding: 6px;
  border-radius: 10px;
  background: #fff;
  object-fit: contain;
}

.dm-bili-qr.is-on strong { font-size: 34px; line-height: 1; color: var(--accent); }
.dm-bili-qr.is-on span { font-size: 13px; color: var(--text); }
.dm-bili-qr.is-idle span { font-size: 12px; color: var(--muted); }

.dm-bili-main > .dm-btn,
.dm-bili-form > .dm-btn {
  align-self: flex-start;
}

.dm-bili-form {
  display: flex;
  flex-direction: column;
  gap: 9px;
  max-width: 320px;
}

.dm-bili-form-title { font-size: 13px; }

.dm-bili-input {
  width: 100%;
  padding: 9px 12px;
  border: 1px solid var(--line);
  border-radius: 11px;
  background: var(--panel);
  color: var(--text);
  font: inherit;
  font-size: 13px;
}

.dm-bili-input:focus { outline: 2px solid color-mix(in oklab, var(--accent) 45%, transparent); outline-offset: 1px; }

.dm-bili-error { font-size: 12px; color: #b6463f; }
.dm-bili-note { font-size: 12px; color: var(--accent); }

.dm-bili-user { display: flex; align-items: center; gap: 10px; }
.dm-bili-avatar { width: 34px; height: 34px; border-radius: 50%; object-fit: cover; }

@media (max-width: 760px) {
  .dm-bili-body { grid-template-columns: minmax(0, 1fr); }
  .dm-bili-side { order: -1; }
}


.dm-bili-steps {
  margin: 2px 0 0;
  padding-left: 18px;
  display: flex;
  flex-direction: column;
  gap: 5px;
  font-size: 12.5px;
  line-height: 1.6;
  color: var(--muted);
}

.dm-bili-steps li::marker { color: var(--accent); }

.dm-bili-lock { font-size: 26px; line-height: 1; filter: grayscale(0.2); }

/* 只有 B站、没有 NapCat 时收成一栏，别留一大块空白 */
.dm-conn-body.is-slim { grid-template-columns: minmax(0, 1fr); }
.dm-conn-body.is-slim .dm-conn-side { flex-direction: row; }
.dm-conn-body.is-slim .dm-conn-bili { flex: 1 1 auto; }
.dm-need-manual {
  margin: 4px 0 2px;
  padding: 7px 9px;
  border-radius: 8px;
  background: color-mix(in srgb, var(--fg) 4%, transparent);
  font-size: 11px; line-height: 1.65;
  color: var(--muted);
}
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

    /* ── 版本兼容判断 ──────────────────────────────────────────────────────
     * 插件用 engines.dsh 声明「需要哪个 DSH 版本」。这里实现一小段 semver：
     * 支持精确版本、>= <= > < =、^ ~、x 通配 和 || 并列区间。
     * 不引第三方依赖，因为插件要在 DSH 里单文件加载。
     */

    const parseVersion = (text) => {
      const match = /^v?(\d+)\.(\d+)\.(\d+)(?:-([0-9A-Za-z.-]+))?(?:\+[0-9A-Za-z.-]+)?$/u.exec(String(text).trim())
      if (match === null) return undefined
      return {
        nums: [Number(match[1]), Number(match[2]), Number(match[3])],
        pre: match[4] === undefined ? [] : match[4].split('.')
      }
    }

    const comparePre = (left, right) => {
      if (left.length === 0 && right.length === 0) return 0
      if (left.length === 0) return 1   // 正式版比预发布版新
      if (right.length === 0) return -1
      for (let i = 0; i < Math.max(left.length, right.length); i += 1) {
        const a = left[i]
        const b = right[i]
        if (a === undefined) return -1
        if (b === undefined) return 1
        const aNum = /^\d+$/u.test(a)
        const bNum = /^\d+$/u.test(b)
        if (aNum && bNum) {
          const diff = Number(a) - Number(b)
          if (diff !== 0) return Math.sign(diff)
        } else if (aNum !== bNum) {
          return aNum ? -1 : 1
        } else if (a !== b) {
          return a < b ? -1 : 1
        }
      }
      return 0
    }

    const compareVersion = (left, right) => {
      const a = parseVersion(left)
      const b = parseVersion(right)
      if (a === undefined || b === undefined) return undefined
      for (let i = 0; i < 3; i += 1) {
        const diff = a.nums[i] - b.nums[i]
        if (diff !== 0) return Math.sign(diff)
      }
      return comparePre(a.pre, b.pre)
    }

    /** 把 ^ ~ x 展开成 >= 与 <。 */
    const expandComparator = (operator, version) => {
      const parsed = parseVersion(version)
      if (parsed === undefined) return []
      const [major, minor, patch] = parsed.nums
      if (operator === '^') {
        const upper = major > 0 ? `${String(major + 1)}.0.0` : minor > 0 ? `0.${String(minor + 1)}.0` : `0.0.${String(patch + 1)}`
        return [`>=${version}`, `<${upper}`]
      }
      if (operator === '~') return [`>=${version}`, `<${String(major)}.${String(minor + 1)}.0`]
      return [`${operator === '' ? '=' : operator}${version}`]
    }

    const wildcardToRange = (text, operator = '') => {
      if (/^[xX*]$/u.test(text)) return []
      const parts = text.split('.')
      if (parts.some((part) => /^[xX*]$/u.test(part))) {
        const fixed = []
        for (const part of parts) {
          if (/^[xX*]$/u.test(part)) break
          fixed.push(part)
        }
        if (fixed.length === 0) return []
        const lower = `${[...fixed, ...Array(3 - fixed.length).fill('0')].join('.')}`
        const upper = [...fixed]
        upper[upper.length - 1] = String(Number(upper[upper.length - 1]) + 1)
        if (upper.length === 1) upper.push('0')
        if (upper.length === 2) upper.push('0')
        return [`${operator === '' ? '>=' : operator}${lower}`, `<${upper.join('.')}`]
      }
      return expandComparator(operator, text)
    }

    /** 判断某个版本号是否满足 engines.dsh 的区间写法。 */
    function satisfiesRange(version, range) {
      if (range === undefined || range === null) return undefined
      const text = String(range).trim()
      if (text === '' || text === '*' || text === 'x') return true
      const candidates = text.split('||').map((part) => part.trim()).filter((part) => part !== '')
      return candidates.some((candidate) => {
        // 把 ">=0.2.0 <0.3.0" 拆成一个个比较式
        const tokens = candidate.replace(/(>=|<=|>|<|=|\^|~)\s+/gu, '$1').split(/\s+/u).filter(Boolean)
        return tokens.every((token) => {
          const match = /^(>=|<=|>|<|=|\^|~)?(.+)$/u.exec(token)
          if (match === null) return true
          const operator = match[1] ?? ''
          for (const comparator of wildcardToRange(match[2], operator)) {
            if (comparator === undefined) continue
            const inner = /^(>=|<=|>|<|=)(.+)$/u.exec(comparator)
            if (inner === null) continue
            const diff = compareVersion(version, inner[2])
            if (diff === undefined) continue
            if (inner[1] === '>=' && diff < 0) return false
            if (inner[1] === '<=' && diff > 0) return false
            if (inner[1] === '>' && diff <= 0) return false
            if (inner[1] === '<' && diff >= 0) return false
            if (inner[1] === '=' && diff !== 0) return false
          }
          return true
        })
      })
    }

    /** 当前 DSH 版本：启动注入 → meta → 本地接口 → 已装 bundle 版本。 */
    async function detectDshVersion() {
      const boot = globalThis.__DSH_BOOT__
      const fromBoot = boot?.version ?? boot?.app?.version ?? boot?.pkg?.version ?? boot?.runtime?.version
        ?? globalThis.__DSH__?.version ?? globalThis.__DSH_APP__?.version
      if (typeof fromBoot === 'string' && fromBoot !== '') return fromBoot
      const meta = typeof document === 'undefined' ? null : document.querySelector('meta[name="dsh-version"]')
      const fromMeta = meta?.getAttribute('content')
      if (typeof fromMeta === 'string' && fromMeta !== '') return fromMeta
      for (const path of ['/api/version', '/api/status', '/api/app']) {
        try {
          const response = await fetch(path, { headers: { accept: 'application/json' }, signal: AbortSignal.timeout(4000) })
          if (!response.ok) continue
          const doc = await response.json()
          const found = doc?.version ?? doc?.data?.version ?? doc?.app?.version ?? doc?.runtime?.version
            ?? doc?.dsh?.version ?? doc?.engines?.dsh
          if (typeof found === 'string' && found !== '') return found
        } catch {
          // 接着试下一个地址
        }
      }
      return undefined
    }

    /** 接口问不到时，从 DSH 自带的 bundle 版本反推（它们和运行时同版本）。 */
    function dshVersionFromBundles(bundles) {
      const list = Array.isArray(bundles) ? bundles : bundles?.bundles
      if (!Array.isArray(list)) return undefined
      const names = ['@deepseek-ai/dsh-base', '@deepseek-ai/dsh-web-app', '@deepseek-ai/dsh-desktop', '@deepseek-ai/dsh']
      for (const name of names) {
        const hit = list.find((item) => (item?.name ?? item?.id) === name)
        const version = hit?.version ?? hit?.manifest?.version
        if (typeof version === 'string' && version !== '') return version
      }
      return undefined
    }

    /**
     * 一个插件在当前 DSH 版本下能不能装。
     * versions 已经是「新的在前」，所以第一个满足条件的就是推荐版本。
     */
    function compatibilityOf(entry, dshVersion) {
      const versions = entry.versions ?? []
      if (dshVersion === undefined) return { known: false, versions, compatible: [], recommended: undefined }
      const judged = versions.map((version) => ({
        version,
        ok: satisfiesRange(dshVersion, version.engines?.dsh ?? entry.engines?.dsh)
      }))
      const compatible = judged.filter((item) => item.ok !== false).map((item) => item.version)
      const preferredVersion = entry.defaultVersion ?? versions[0]?.version
      const preferred = versions.find((version) => version.version === preferredVersion)
      const preferredOk = preferred === undefined
        ? true
        : satisfiesRange(dshVersion, preferred.engines?.dsh ?? entry.engines?.dsh) !== false
      return {
        known: true,
        versions: judged,
        compatible,
        recommended: compatible[0],
        defaultOk: preferredOk && compatible.length > 0
      }
    }

    /**
     * 发布前体检的结论（索引里的 metadata.check），只对「体检过的那个版本」有效：
     * 索引的 latest 换了、体检没跟上，就当没有结论，绝不拿旧结论吓人。
     */
    function checkOf(entry) {
      const check = entry?.metadata?.check
      if (check === null || typeof check !== 'object') return undefined
      if (check.version !== entry.defaultVersion) return undefined
      if (check.status !== 'ok' && check.status !== 'warn' && check.status !== 'fail') return undefined
      return check
    }

    const CHECK_REASONS = {
      'no-dsh-engine': { zh: '作者没声明支持哪些 DSH 版本', en: 'The author did not declare which DSH versions it supports' },
      'patch-mount': { zh: '挂载名写错了，DSH 找不到这个模块，装了也不会生效', en: 'The bundle patch names a module DSH cannot resolve, so it never mounts' },
      'patch-missing': { zh: '声明了 patch 文件，但包里没有', en: 'The declared patch file is missing from the package' },
      'client-missing': { zh: '声明了界面半边，但包里没有', en: 'The declared web half is missing from the package' },
      'client-duplicate': { zh: '同一个客户端 id 注册了两次，会让网页启动失败', en: 'The same client id registers twice, which breaks web boot' },
      'client-id-collision': { zh: '界面注册的 id 跟别的插件撞了', en: 'Its client id collides with another plugin' }
    }

    function checkReasonText(reason) {
      const known = CHECK_REASONS[reason?.code]
      if (known !== undefined) return pick(known, '')
      return typeof reason?.detail === 'string' ? reason.detail : ''
    }

    function checkSummary(check) {
      return (check?.reasons ?? []).map(checkReasonText).filter((text) => text !== '').join('；')
    }

    /** 快捷搜索用：名称、标题、简介、关键词、作者一起匹配。 */
    function searchEntries(entries, query, limit = 8) {
      const needle = query.trim().toLowerCase()
      const pool = needle === ''
        ? entries.slice().sort((left, right) => (right.metadata?.sortKeys?.downloads ?? 0) - (left.metadata?.sortKeys?.downloads ?? 0))
        : entries.filter((entry) => [
          entry.name,
          pick(entry.title, ''),
          pick(entry.description, ''),
          ...(entry.metadata?.keywords ?? []),
          entry.author ?? ''
        ].join(' ').toLowerCase().includes(needle))
      return pool.slice(0, limit)
    }

    /**
     * 安装前要准备的外部条件（NapCat、QQ 号、B站账号……）。
     * 和索引放在同一个静态目录，改数据不用重装插件。
     */
    const REQUIREMENTS_URL = 'https://xivie-a.github.io/dsh-market/requirements.json'

    /**
     * 内置副本：由 scripts/inline-requirements.mjs 从 requirements.json 注入。
     * 远端失败时用它，提示不会整块消失。
     */
    // #region requirements-fallback
    const REQUIREMENTS_FALLBACK = {
  "version": 1,
  "note": "插件装完还要自己准备的外部条件：不是 npm 依赖，装不上或者装上没反应，多半是这里缺了东西。",
  "items": {
    "dsh-onebot-qq": {
      "tag": "NapCat",
      "needs": [
        {
          "kind": "app",
          "name": "Windows QQ 9.9.36（不能是 9.9.37）",
          "why": {
            "zh": "NapCat 现在只适配到 9.9.36，9.9.37 一注入 QQ 就弹「文件已损坏」并退出——不是包坏了，是 QQ 检测到了。装完先登录一次，确认能正常用。注意 QQ 会自己升回 9.9.37，升上去就得再装回 9.9.36。",
            "en": "NapCat supports up to QQ 9.9.36. On 9.9.37 QQ refuses the injection with a \"file is corrupted\" dialog. QQ auto-updates itself back to 9.9.37 later, so this is a moving target."
          },
          "download": "https://github.com/a1515333102/QQ-Releases/releases/download/9.9.36%2B3.2.34/QQ_9.9.36_260924_x64_01.exe",
          "url": "https://github.com/a1515333102/QQ-Releases/releases/tag/9.9.36%2B3.2.34"
        },
        {
          "kind": "app",
          "name": "NapCat.Shell 包（约 35 MB）",
          "why": {
            "zh": "解压后以管理员身份运行 launcher.bat，它会把 NapCat 注入到上面那个 QQ 里。别用 OneKey 包里的旧启动器，那个会报 error code v2:-8。上游 NapCat 已经把 release 删了（README 只剩「到这里告一段落」），所以这里给的是社区归档的那一份；GitHub 直连慢的话，市场自己会在几个加速源之间换，也可以手动下好放到目录里。",
            "en": "Unzip and run launcher.bat as administrator; it injects NapCat into the QQ above. Do not use the older OneKey boot loader — it fails with error code v2:-8. Upstream NapCat has deleted its releases, so this points at the community archive; the market retries through several mirrors when GitHub is slow, and you can also drop the zip in by hand."
          },
          "download": "https://github.com/XingYunStar/NapCatQQ/releases/download/v4.18.42/NapCat.Shell.zip",
          "url": "https://github.com/XingYunStar/NapCatQQ/releases/tag/v4.18.42"
        },
        {
          "kind": "account",
          "name": "一个 QQ 号",
          "why": "NapCat 起来后打开 http://127.0.0.1:6099 扫码，这个号的消息才会转到 DSH。"
        },
        {
          "kind": "config",
          "name": "在「设置 → NapCat 桥」填 NapCat 目录",
          "why": "不填路径前缀，看门狗认不出进程，会一直卡在 dedupe-blocked，扫码页也不会出码。"
        }
      ]
    },
    "@zaofan/dsh-qqbot": {
      "tag": "QQ 机器人",
      "needs": [
        {
          "kind": "app",
          "name": "QQ 开放平台的机器人应用",
          "why": "去 q.qq.com 建一个机器人，拿到 AppID / AppSecret；它走官方 API，不需要 NapCat。"
        },
        {
          "kind": "account",
          "name": "机器人所在的群或好友",
          "why": "要先把这个机器人拉进群 / 加好友，它才收得到消息。"
        },
        {
          "kind": "config",
          "name": "把 OpenID 填进「允许操作的主人」",
          "why": "不填的话发图、撤消息、群管理这些指令会被拒。"
        }
      ]
    },
    "dsh-napcat-keeper": {
      "tag": "NapCat",
      "needs": [
        {
          "kind": "app",
          "name": "Windows QQ 9.9.36（不能是 9.9.37）",
          "why": {
            "zh": "这个插件只负责「掉线了把它拉回来」，协议实现全在 NapCat 里。而 NapCat 只适配到 9.9.36，9.9.37 注入会弹「文件已损坏」。QQ 之后可能自己升级，升级了就得装回来。",
            "en": "This plugin only restarts NapCat when it drops; the protocol lives in NapCat, which supports QQ up to 9.9.36."
          },
          "download": "https://github.com/a1515333102/QQ-Releases/releases/download/9.9.36%2B3.2.34/QQ_9.9.36_260924_x64_01.exe",
          "url": "https://github.com/a1515333102/QQ-Releases/releases/tag/9.9.36%2B3.2.34"
        },
        {
          "kind": "app",
          "name": "NapCat.Shell 包（约 35 MB）",
          "why": "解压后管理员运行 launcher.bat 注入；装完在「设置 → NapCat 桥」把目录填进去，看门狗才认得出。",
          "download": "https://github.com/XingYunStar/NapCatQQ/releases/download/v4.18.42/NapCat.Shell.zip",
          "url": "https://github.com/XingYunStar/NapCatQQ/releases/tag/v4.18.42"
        },
        {
          "kind": "account",
          "name": "一个 QQ 号",
          "why": "第一次要扫码，之后靠看门狗维持在线。"
        }
      ]
    },
    "@seiuna/dsh-bilibili-plugin": {
      "tag": "B站",
      "needs": [
        {
          "kind": "account",
          "name": "B 站账号",
          "why": {
            "zh": "在市场里点开「连接」→「B站登录」，扫码一次就行；之后抓字幕、看视频信息都用这份登录态。",
            "en": "In the market open Connect → Bilibili sign-in and scan once; video info and subtitles then use that session."
          }
        }
      ]
    },
    "dsh-bilibili-plugin": {
      "tag": "B站",
      "needs": [
        {
          "kind": "account",
          "name": "B 站账号",
          "why": "扫码登录后才能读字幕和视频信息。"
        },
        {
          "kind": "config",
          "name": "要装 0.2.0-rc.2 那版 DSH",
          "why": "它把 DSH 版本锁死在这个预发布版，版本对不上装上也跑不起来。"
        }
      ]
    },
    "dsh-bilibili-summary": {
      "tag": "B站",
      "needs": [
        {
          "kind": "account",
          "name": "B 站账号",
          "why": {
            "zh": "B 站对未登录客户端隐藏 AI 字幕；先在市场「连接」→「B站登录」扫一次码，否则只能退回本地转写。",
            "en": "Bilibili hides AI subtitles from signed-out clients; sign in from the market first, or fall back to local transcription."
          }
        },
        {
          "kind": "config",
          "name": "没字幕的视频要本地转写",
          "why": "第一次转写会下载语音模型，慢一点是正常的。"
        }
      ]
    },
    "dsh-qq-persona": {
      "tag": "QQ",
      "needs": [
        {
          "kind": "app",
          "name": "先有一个能用的 QQ 通道",
          "why": "人设和好感度是从聊天记录里长出来的，通道不通就没有数据。"
        }
      ]
    },
    "@xmanrui/dsh-im": {
      "tag": "IM 凭据",
      "needs": [
        {
          "kind": "app",
          "name": "各平台自己的机器人",
          "why": "Telegram 要 BotFather 的 token、Discord 要 Developer Portal 的 bot、Slack 要 App Manifest 生成的 token、企业微信要自建应用、WhatsApp 要手机扫码。"
        },
        {
          "kind": "config",
          "name": "在「设置 → IM机器人」逐个填凭据",
          "why": "一个平台一条通道，不填的平台不会启动。"
        }
      ]
    },
    "dsh-video-storyboard": {
      "tag": "ffmpeg",
      "needs": [
        {
          "kind": "app",
          "name": "ffmpeg + ffprobe",
          "why": "抽帧、读时长全靠它，没有的话第一步就报错。装完要重启 DSH 才会用上，也可以在设置里填路径。",
          "url": "https://ffmpeg.org/download.html"
        },
        {
          "kind": "config",
          "name": "贴 B站 / YouTube 链接才需要 yt-dlp",
          "why": "本地文件不用装。跑 pip install --user -U yt-dlp 就行。"
        }
      ]
    },
    "dsh-see-now": {
      "tag": "ffmpeg",
      "needs": [
        {
          "kind": "app",
          "name": "ffmpeg（只在喂视频文件 / 直播源时需要）",
          "why": "直接看屏幕不用它；插件会自己按 DSH_FFMPEG_PATH、~/.dsh/tools/ffmpeg/bin 这些位置找。",
          "url": "https://ffmpeg.org/download.html"
        }
      ]
    },
    "dsh-watch-together": {
      "tag": "ffmpeg",
      "needs": [
        {
          "kind": "app",
          "name": "ffmpeg",
          "why": "出分镜图要用它；没装时能看能写台词，但出不了图。",
          "url": "https://ffmpeg.org/download.html"
        },
        {
          "kind": "config",
          "name": "浏览器扩展 + 调试端口",
          "why": "陪看要从浏览器读真实播放位置和字幕，不装扩展就只能退化成纯音频。"
        }
      ]
    }
  }
}
    // #endregion requirements-fallback

    function normalizeRequirements(doc) {
      const items = doc?.items
      if (items === null || typeof items !== 'object') return new Map()
      const map = new Map()
      for (const [name, entry] of Object.entries(items)) {
        // 名称和原因允许写成 { zh, en }，这里统一压成当前语言的字符串，
        // 否则 React 遇到对象会直接抛 #31 把整个面板卸载掉
        const asText = (value) => (typeof value === 'string'
          ? value
          : value !== null && typeof value === 'object'
            ? pick(value, '')
            : '')
        const needs = Array.isArray(entry?.needs)
          ? entry.needs
            .map((item) => ({
              ...item,
              name: asText(item?.name),
              why: asText(item?.why)
            }))
            .filter((item) => item.name !== '')
          : []
        if (needs.length === 0) continue
        map.set(name, { tag: typeof entry.tag === 'string' ? entry.tag : '', needs, version: Number(doc?.version ?? 0) })
      }
      return map
    }

    async function loadRequirementsFile() {
      const builtin = normalizeRequirements(REQUIREMENTS_FALLBACK)
      try {
        const response = await fetch(`${REQUIREMENTS_URL}?t=${String(Date.now())}`, {
          headers: { accept: 'application/json', 'cache-control': 'no-cache' },
          cache: 'no-store',
          signal: AbortSignal.timeout(8000)
        })
        if (!response.ok) throw new Error(`HTTP ${String(response.status)}`)
        const map = normalizeRequirements(await response.json())
        if (map.size === 0) throw new Error('远端 requirements.json 为空')
        return map.size < builtin.size ? builtin : map
      } catch (error) {
        console.warn(LOG, 'requirements fetch failed, using built-in copy:', messageOf(error))
        return builtin
      }
    }

    /** 场景套装：跟索引放在同一个静态目录里，改数据不用重装插件。 */
    const SUITES_URL = 'https://xivie-a.github.io/dsh-market/suites.json'

    /**
     * 内置副本：由 scripts/inline-suites.mjs 从 suites.json 注入。
     * 远端拉不到（离线、CSP 拦截跨域请求）时用它，保证套装不会整块消失。
     */
    // #region suites-fallback
    const SUITES_FALLBACK = {
  "version": 9,
  "suites": [
    {
      "id": "big-fish",
      "glyph": "◍",
      "label": "让人设活在聊天里",
      "title": {
        "zh": "大肥鱼套装",
        "en": "Big Fish bundle"
      },
      "desc": {
        "zh": "把 DSH 变成一条活在社区里的大肥鱼：有人设、记得住人、能自己去 B 站翻东西。通道按你混的社区选，选一个就够。",
        "en": "Turn DSH into a persona living inside your chat apps: it knows who it talks to, remembers them, and can browse Bilibili on its own."
      },
      "groups": [
        {
          "id": "channel",
          "min": 1,
          "title": {
            "zh": "社区通道",
            "en": "Chat channel"
          },
          "hint": {
            "zh": "至少选一个 —— QQ、微信、B站 都在这里，混哪个选哪个，也可以都要",
            "en": "Pick at least one — QQ, WeChat or Bilibili, or take several"
          }
        },
        {
          "id": "memory",
          "min": 0,
          "title": {
            "zh": "记忆与压缩",
            "en": "Memory & context"
          },
          "hint": {
            "zh": "让它记得住人、记得住事。不选也能跑，只是每句话都从零开始",
            "en": "So it remembers people and threads. Optional, but without it every chat starts from scratch"
          }
        },
        {
          "id": "video",
          "min": 0,
          "preselect": false,
          "title": {
            "zh": "看片与分镜",
            "en": "Video & storyboards"
          },
          "hint": {
            "zh": "让它看得懂视频：长片切成几张分镜图、陪你同步看片。要自备 ffmpeg，不需要就别勾",
            "en": "So it can read a video: long films cut into storyboards, or watching along with you. Needs ffmpeg"
          }
        }
      ],
      "items": [
        {
          "name": "dsh-onebot-qq",
          "group": "channel",
          "note": "QQ 私聊与群聊，NapCat / OneBot 11，支持图片语音"
        },
        {
          "name": "dsh-plugin-wechat-agent",
          "group": "channel",
          "note": "微信个人号，人设、陪聊、记忆、定时提醒一体"
        },
        {
          "name": "@xmanrui/dsh-im",
          "group": "channel",
          "note": "一个包覆盖微信/飞书/钉钉/QQ/Telegram/Slack 等 10 个平台"
        },
        {
          "name": "@seiuna/dsh-bilibili-plugin",
          "group": "channel",
          "note": "B 站：扫码登录后看视频、评论与私信，兼容性好"
        },
        {
          "name": "dsh-napcat-keeper",
          "note": "随 DSH 启动自动拉起 NapCat，省掉每次手动开机"
        },
        {
          "name": "dsh-qq-persona",
          "note": "人物画像、好感度、心情；人设存在 ~/.dsh/qq-persona，可手改",
          "group": "memory"
        },
        {
          "name": "billion-context",
          "note": "压缩上下文，聊一天也不会把窗口撑爆",
          "group": "memory"
        },
        {
          "name": "@huai_xin/dsh-memory",
          "note": "跨会话长期记忆，YAML 存，可按会话套预设",
          "group": "memory"
        },
        {
          "name": "dsh-pet",
          "note": "桌面上那条吃白饭的蓝色大肥鱼，纯装饰"
        },
        {
          "name": "dsh-bilibili-summary",
          "note": "B 站视频理解：转写加关键帧，产出可引用的总结"
        },
        {
          "name": "dsh-video-storyboard",
          "required": false,
          "group": "video",
          "note": {
            "zh": "把长视频压成几张分镜图，一个镜头一格，带时间点",
            "en": "Pack a long video into a few storyboard images, one cell per shot"
          }
        },
        {
          "name": "dsh-watch-together",
          "required": false,
          "group": "video",
          "note": {
            "zh": "跟着真实播放位置一起看片，悬浮窗里能出声",
            "en": "Watch along in sync with real playback, with a talking floating window"
          }
        }
      ]
    },
    {
      "id": "fresh-look",
      "glyph": "✳",
      "label": "每天打开的界面",
      "title": {
        "zh": "界面焕新",
        "en": "Fresh look"
      },
      "desc": {
        "zh": "换一套主题，给侧栏和组件补上细节，让每天打开的界面顺眼一点。",
        "en": "A theme plus a few finishing touches for the sidebar and widgets."
      },
      "items": [
        {
          "name": "dsh-dream-skin",
          "required": true,
          "note": "主题基础包，其余组件都基于它换色"
        },
        {
          "name": "@linxin666/dsh-client-ui-skin-center",
          "note": "在一个面板里挑皮肤、预览、切换"
        },
        {
          "name": "dsh-better-sidebar",
          "note": "侧栏常驻文件和任务入口"
        },
        {
          "name": "dsh-whale-widget",
          "note": "悬浮挂件显示账户余额与用量"
        }
      ]
    },
    {
      "id": "memory-search",
      "glyph": "∞",
      "label": "让上一次接得上",
      "title": {
        "zh": "记忆与检索",
        "en": "Memory & search"
      },
      "desc": {
        "zh": "把长对话压住、把历史搜出来，让上一次的结论能直接接到这一次。",
        "en": "Compress long sessions and search history so earlier conclusions carry over."
      },
      "items": [
        {
          "name": "billion-context",
          "required": true,
          "note": "上下文压缩内核，长对话的基础"
        },
        {
          "name": "misakanet",
          "note": "检索带证据评级的失败经验"
        },
        {
          "name": "dsh-plugin-session-fulltext",
          "note": "跨会话全文搜索，支持中文短词"
        },
        {
          "name": "dsh-mnemon",
          "note": "分层记忆，自动保存项目知识"
        }
      ]
    },
    {
      "id": "remote-collab",
      "glyph": "⊞",
      "label": "离开这台机器",
      "title": {
        "zh": "远程与协作",
        "en": "Remote & collaboration"
      },
      "desc": {
        "zh": "在手机上接管这台机器，或者让 agent 通过 SSH 去别的机器干活。",
        "en": "Drive this machine from a phone, or let the agent work over SSH."
      },
      "items": [
        {
          "name": "@linxin666/dsh-ssh",
          "required": true,
          "note": "SSH 通道，其余远程能力依赖它"
        },
        {
          "name": "@linxin666/dsh-remote-web-ui",
          "note": "用局域网或隧道在手机上打开同一界面"
        },
        {
          "name": "@linxin666/dsh-client-ui-task-board",
          "note": "把 agent 任务放到看板上追踪"
        }
      ]
    }
  ]
}
    // #endregion suites-fallback

    /** 统一成内部形状：支持 items / 旧版 plugins 两种写法。 */
    function normalizeSuites(doc) {
      if (!Array.isArray(doc?.suites)) return []
      return doc.suites
        .map((suite) => {
          const items = Array.isArray(suite?.items)
            ? suite.items
            : Array.isArray(suite?.plugins)
              ? suite.plugins.map((name) => ({ name }))
              : []
          return { ...suite, items }
        })
        .filter((suite) => suite.items.length > 1)
    }

    async function loadSuitesFile() {
      const builtin = normalizeSuites(SUITES_FALLBACK)
      try {
        // 加时间戳绕开 CDN / 代理缓存，否则改完数据可能还在读旧文件
        const response = await fetch(`${SUITES_URL}?t=${String(Date.now())}`, {
          headers: { accept: 'application/json', 'cache-control': 'no-cache' },
          cache: 'no-store',
          signal: AbortSignal.timeout(8000)
        })
        if (!response.ok) throw new Error(`HTTP ${String(response.status)}`)
        const doc = await response.json()
        const list = normalizeSuites(doc)
        if (list.length === 0) throw new Error('远端 suites.json 为空')
        // 远端版本比内置旧（缓存没刷），就用内置的，别把新套装吞掉
        const remoteVersion = Number(doc?.version ?? 0)
        const builtinVersion = Number(SUITES_FALLBACK?.version ?? 0)
        if (list.length < builtin.length && remoteVersion < builtinVersion) {
          console.warn(LOG, `suites 远端版本较旧（${String(remoteVersion)} < ${String(builtinVersion)}），用内置副本`)
          return builtin
        }
        return list
      } catch (error) {
        console.warn(LOG, 'suites fetch failed, using built-in copy:', messageOf(error))
        return builtin
      }
    }

    const FAV_KEY = 'dsh-market-xivie:favs'

    function readFavs() {
      try {
        const raw = JSON.parse(window.localStorage.getItem(FAV_KEY) ?? '[]')
        return new Set(Array.isArray(raw) ? raw.filter((name) => typeof name === 'string') : [])
      } catch {
        return new Set()
      }
    }

    function saveFavs(set) {
      try {
        window.localStorage.setItem(FAV_KEY, JSON.stringify([...set]))
      } catch {
        // 存不下就只在这个会话里生效
      }
    }

    const THEME_KEY = 'dsh-market-xivie:theme'

    function readTheme() {
      try {
        const saved = window.localStorage.getItem(THEME_KEY)
        if (saved === 'dark' || saved === 'light') return saved
      } catch {
        // 存储不可用时跟随系统
      }
      return window.matchMedia?.('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
    }

    function saveTheme(value) {
      try {
        window.localStorage.setItem(THEME_KEY, value)
      } catch {
        // 存不下就只在这个会话里生效
      }
    }

    /**
     * 每日精选：按「最近更新 + 热度」打分，再从当天名次开始错位取 3 个，
     * 同一份索引每天换一批，不需要人手维护。
     */
    function todayFeatured(entries, count = 3) {
      const pool = entries.filter((entry) => entry.icon !== undefined)
      if (pool.length === 0) return []
      const now = Date.now() / 1000
      const ranked = pool.map((entry) => {
        const latest = Math.max(0, ...(entry.versions ?? []).map((version) => version.publishTimestamp ?? 0))
        const days = latest === 0 ? 365 : Math.max(0, (now - latest) / 86400)
        const freshness = Math.max(0, 1 - days / 120)
        const popularity = Math.log10(1 + (entry.metadata?.sortKeys?.downloads ?? 0)) / 6
        const reach = Math.log10(1 + (entry.metadata?.sortKeys?.stars ?? 0)) / 4
        return { entry, score: freshness * 1.8 + popularity + reach * 0.6 }
      }).sort((left, right) => right.score - left.score)
      const top = ranked.slice(0, 12).map((item) => item.entry)
      const day = Math.floor(Date.now() / 86400000)
      const start = day % top.length
      const picks = []
      for (let index = 0; index < count; index += 1) picks.push(top[(start + index * 4) % top.length])
      return [...new Map(picks.map((entry) => [entry.name, entry])).values()]
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
    /* ── 连接助手 ────────────────────────────────────────────────
       有些插件装完还要扫码或填路径才真能用。这里只驱动能同源查状态的：
       NapCat 桥把 /qr-state 挂在 DSH 自己的地址下，所以不用跨域也能读到。 */
    const CONNECT_BUNDLE = 'dsh-napcat-keeper'
    const CONNECT_STATE = '/dsh-napcat-keeper/qr-state'
    const CONNECT_QR = '/dsh-napcat-keeper/qr.png'
    const CONNECT_RESTART = '/dsh-napcat-keeper/qr-restart'
    const CONNECT_PAGE = '/dsh-napcat-keeper/qr'
    const CONNECT_PHASES = {
      idle: ['待机', 'idle'],
      launching: ['正在拉起 QQ', 'launching QQ'],
      starting: ['正在启动', 'starting'],
      'need-scan': ['等你扫码', 'waiting for scan'],
      'need-scan-giveup': ['扫码超时', 'scan timed out'],
      'reverse-wait': ['等反向连接', 'waiting for the link'],
      online: ['已上线', 'online'],
      dead: ['没跑起来', 'not running'],
      'dedupe-blocked': ['进程重复，被拦下', 'blocked by duplicates']
    }

    /** 读 NapCat 桥的状态；桥没跑或读不到都算 missing，界面按「没连上」显示。 */
    async function readConnectState() {
      try {
        const response = await fetch(`${CONNECT_STATE}?t=${Date.now()}`, {
          cache: 'no-store',
          headers: { accept: 'application/json' },
          signal: AbortSignal.timeout(4000)
        })
        if (!response.ok) return { status: 'missing' }
        const value = await response.json()
        if (value?.ok !== true) return { status: 'missing' }
        return { status: 'ready', ...value }
      } catch {
        return { status: 'missing' }
      }
    }

    /** 「重新拉起」：让看门狗重开一条链，出码后页面自己会刷新。 */
    async function restartConnect() {
      try {
        await fetch(CONNECT_RESTART, { method: 'POST', signal: AbortSignal.timeout(8000) })
        return true
      } catch {
        return false
      }
    }

    /* ── 一键接通 ──────────────────────────────────────────────────
       市场的宿主侧有 /dsh-market/napcat/*：探测 → 下载解压 → 对齐版本 → 写三份配置 → 拉起。
       前端只负责一件事：把用户填的号发过去，然后把返回的步骤和二维码画出来。 */
    const SETUP_API = '/dsh-market/napcat'

    async function setupState() {
      try {
        const response = await fetch(`${SETUP_API}/state?t=${Date.now()}`, {
          cache: 'no-store',
          headers: { accept: 'application/json' },
          signal: AbortSignal.timeout(15_000)
        })
        if (!response.ok) return undefined
        const value = await response.json()
        return value?.ok === true ? value : undefined
      } catch {
        return undefined
      }
    }

    async function setupPrepare(body) {
      try {
        const response = await fetch(`${SETUP_API}/prepare`, {
          method: 'POST',
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify(body),
          signal: AbortSignal.timeout(600_000)
        })
        if (!response.ok) return { ok: false, steps: [{ status: 'fail', text: `市场接口返回 ${response.status}` }] }
        return await response.json()
      } catch (error) {
        return { ok: false, steps: [{ status: 'fail', text: `连不上市场自己的接口：${error?.message ?? error}` }] }
      }
    }

    const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

    /** 「装完顺便接通」：把要做的事写进 profile，重启后 host 自己续上。 */
    async function queueSetup(body) {
      try {
        const response = await fetch(`${SETUP_API}/pending`, {
          method: 'POST',
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify(body ?? {}),
          signal: AbortSignal.timeout(15_000)
        })
        return response.ok
      } catch {
        return false
      }
    }

    async function readPending() {
      try {
        const response = await fetch(`${SETUP_API}/pending?t=${Date.now()}`, {
          cache: 'no-store',
          headers: { accept: 'application/json' },
          signal: AbortSignal.timeout(10_000)
        })
        if (!response.ok) return undefined
        return await response.json()
      } catch {
        return undefined
      }
    }

    /* ── B站登录 ──────────────────────────────────────────────────
       @seiuna/dsh-bilibili-plugin 把登录入口放在会话标题栏，有的版本挂不上。
       它自己的 HTTP API 就挂在同源 /api/bilibili 下，所以在市场里也能直接走完扫码。 */
    const BILI_BUNDLE = '@seiuna/dsh-bilibili-plugin'
    const BILI_API = '/api/bilibili'
    const BILI_STEP = {
      loading: ['正在申请二维码', 'Requesting a code'],
      idle: ['还没登录', 'Not signed in'],
      scan: ['扫码登录', 'Scan to sign in'],
      scanned: ['已扫码，等手机确认', 'Scanned — confirm on your phone'],
      expired: ['二维码过期了', 'That code expired'],
      password: ['设一个本地密码', 'Set a local password'],
      ready: ['已登录', 'Signed in'],
      locked: ['账号已加密', 'Account is locked'],
      missing: ['没找到 B站插件', 'Bilibili plugin not found'],
      error: ['出了点问题', 'Something went wrong']
    }

    /** 阶段文案：和 CONNECT_PHASES 一样走 pick，省得再引一份语言判断 */
    const biliPhaseText = (phase) => {
      const row = BILI_STEP[phase]
      return row === undefined ? '' : pick({ zh: row[0], en: row[1] }, '')
    }

    /** 统一包一层：插件没装、接口没挂上都返回 {missing:true}，界面就能给一句人话。 */
    async function biliCall(path, init) {
      try {
        const response = await fetch(`${BILI_API}${path}`, {
          credentials: 'same-origin',
          signal: AbortSignal.timeout(9000),
          ...init
        })
        if (response.status === 404 || response.status === 401) return { missing: true }
        const value = await response.json()
        if (value === null || typeof value !== 'object') return { missing: true }
        return value
      } catch {
        return { missing: true }
      }
    }

    const biliStatus = () => biliCall('/auth/status')
    const biliGenerate = () => biliCall('/auth/qrcode/generate', { method: 'POST' })
    const biliPoll = key => biliCall(`/auth/qrcode/poll?key=${encodeURIComponent(key)}`)
    const biliSecure = (tempToken, password) => biliCall('/vault/setup-pwd', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ tempToken, password, remember: true })
    })
    const biliUnlock = password => biliCall('/vault/unlock', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ password, remember: true })
    })

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
      const [dshVersion, setDshVersion] = React.useState(undefined)
      const [notice, setNotice] = React.useState(undefined)
      const [bundles, setBundles] = React.useState(new Map())
      const [connectOpen, setConnectOpen] = React.useState(false)
      const [connectState, setConnectState] = React.useState({ status: 'idle' })
      const [connectStamp, setConnectStamp] = React.useState(0)
      const [connectBusy, setConnectBusy] = React.useState(false)
      // 「一键接通」：市场自己把 NapCat 装好、配置写对、拉起来，用户只填自己的 QQ 号再扫码
      const [setupOpen, setSetupOpen] = React.useState(false)
      const [setupQq, setSetupQq] = React.useState('')
      const [setupDir, setSetupDir] = React.useState('')
      const [setupSource, setSetupSource] = React.useState('')
      const [setupBusy, setSetupBusy] = React.useState(false)
      const [setupSteps, setSetupSteps] = React.useState([])
      const [setupQr, setSetupQr] = React.useState(undefined)
      const [setupDone, setSetupDone] = React.useState(undefined)
      const [selected, setSelected] = React.useState(undefined)
      const [theme, setTheme] = React.useState(readTheme)
      const [slide, setSlide] = React.useState(0)
      const [mineOnly, setMineOnly] = React.useState(false)
      const [layout, setLayout] = React.useState(() => {
        try {
          return window.localStorage.getItem('dsh-market-xivie:layout') === 'list' ? 'list' : 'grid'
        } catch {
          return 'grid'
        }
      })
      const setLayoutAndSave = (next) => {
        setLayout(next)
        try {
          window.localStorage.setItem('dsh-market-xivie:layout', next)
        } catch {
          // 存不下就只在这个会话里生效
        }
      }
      const [paletteOpen, setPaletteOpen] = React.useState(false)
      const [paletteQuery, setPaletteQuery] = React.useState('')
      const [paletteIndex, setPaletteIndex] = React.useState(0)
      const [suites, setSuites] = React.useState([])
      const [suiteId, setSuiteId] = React.useState(undefined)
      const [suiteJobs, setSuiteJobs] = React.useState({})
      const [suiteRunning, setSuiteRunning] = React.useState(false)
      const [suitePicked, setSuitePicked] = React.useState(new Set())
      // 套装里勾「装完顺便接通」：装完插件写一个标记，重启后 host 自己把 NapCat 那套续上
      // 默认不勾——自动下载 35MB 并在后台改配置，得是用户自己按下去的
      const [suiteConnect, setSuiteConnect] = React.useState(false)
      const [suiteBotQQ, setSuiteBotQQ] = React.useState('')
      const [suiteAdmin, setSuiteAdmin] = React.useState('')
      const [favs, setFavs] = React.useState(readFavs)
      const [favOnly, setFavOnly] = React.useState(false)
      // 安装前要准备的东西（NapCat / QQ / B站账号…），远端优先，内置兜底
      const [needs, setNeeds] = React.useState(() => normalizeRequirements(REQUIREMENTS_FALLBACK))
      const [gate, setGate] = React.useState(undefined)
      const gateBypass = React.useRef(false)
      // 需要下载的软件默认勾选；ackedApps 记下这次会话里已经看过提示的插件
      const [prepApps, setPrepApps] = React.useState({})
      const ackedApps = React.useRef(new Set())
      // B站登录：在市场里把扫码、设密码这两步走完，不用去找插件自己的入口
      const biliInstalled = bundles.has(BILI_BUNDLE)
      const [biliOpen, setBiliOpen] = React.useState(false)
      const [bili, setBili] = React.useState({ phase: 'idle' })
      const [biliPwd, setBiliPwd] = React.useState({ one: '', two: '', error: '', busy: false })
      const biliRegister = React.useRef({})
      /** 打开面板时先问一句：已登录 / 已加密待解锁 / 还没登录 / 插件不在 */
      const biliProbe = async () => {
        const doc = await biliStatus()
        if (doc.missing === true) {
          setBili({ phase: 'missing' })
          return
        }
        const user = doc.user ?? doc.accountSummary ?? undefined
        if (doc.hasVault === true && doc.isUnlocked === true && user !== undefined) {
          setBili({ phase: 'ready', user })
          return
        }
        if (doc.hasVault === true && doc.isUnlocked !== true) {
          setBili({ phase: 'locked', user })
          return
        }
        setBili({ phase: 'idle' })
      }

      const biliStart = async () => {
        setBili({ phase: 'loading' })
        setBiliPwd({ one: '', two: '', error: '', busy: false })
        const doc = await biliGenerate()
        if (doc.missing === true) {
          setBili({ phase: 'missing' })
          return
        }
        if (typeof doc.qrcodeKey !== 'string' || doc.qrcodeKey === '') {
          setBili({ phase: 'error' })
          return
        }
        setBili({ phase: 'scan', key: doc.qrcodeKey, img: doc.qrcodeDataUrl })
      }

      const biliSubmitPassword = async (event) => {
        event?.preventDefault?.()
        const token = biliRegister.current.tempToken
        const one = biliPwd.one.trim()
        if (token === undefined) return
        if (one.length < 6) {
          setBiliPwd((current) => ({ ...current, error: pick({ zh: '至少 6 位', en: 'At least 6 characters' }, '') }))
          return
        }
        if (one !== biliPwd.two.trim()) {
          setBiliPwd((current) => ({ ...current, error: pick({ zh: '两次输入不一样', en: 'The two do not match' }, '') }))
          return
        }
        setBiliPwd((current) => ({ ...current, busy: true, error: '' }))
        const doc = await biliSecure(token, one)
        if (doc.missing === true || doc.ok === false) {
          setBiliPwd((current) => ({ ...current, busy: false, error: pick({ zh: '保存失败，再试一次', en: 'Could not save, try again' }, '') }))
          return
        }
        setBiliPwd({ one: '', two: '', error: '', busy: false })
        biliRegister.current = {}
        await biliProbe()
      }

      const biliSubmitUnlock = async (event) => {
        event?.preventDefault?.()
        const one = biliPwd.one.trim()
        if (one === '') return
        setBiliPwd((current) => ({ ...current, busy: true, error: '' }))
        const doc = await biliUnlock(one)
        if (doc.missing === true || doc.ok === false) {
          setBiliPwd((current) => ({ ...current, busy: false, error: pick({ zh: '密码不对', en: 'Wrong password' }, '') }))
          return
        }
        setBiliPwd({ one: '', two: '', error: '', busy: false })
        await biliProbe()
      }

      /** 扫码期间每 2 秒问一次；扫上就停，过期就停，拿到 tempToken 就转去设密码 */
      React.useEffect(() => {
        if (biliOpen !== true || bili.phase !== 'scan') return undefined
        let stopped = false
        const timer = window.setInterval(async () => {
          if (stopped) return
          const doc = await biliPoll(bili.key)
          if (stopped || doc.missing === true) return
          if (doc.status === 'success') {
            window.clearInterval(timer)
            if (typeof doc.tempToken === 'string' && doc.tempToken !== '') {
              biliRegister.current = { tempToken: doc.tempToken }
              setBili({ phase: 'password', user: doc.user })
            } else {
              await biliProbe()
            }
            return
          }
          if (doc.status === 'expired' || doc.status === 'error') {
            window.clearInterval(timer)
            setBili({ phase: doc.status === 'expired' ? 'expired' : 'error' })
            return
          }
          if (doc.status === 'scanned') setBili((current) => (current.phase === 'scan' ? { ...current, scanned: true } : current))
        }, 2000)
        return () => {
          stopped = true
          window.clearInterval(timer)
        }
      }, [biliOpen, bili.phase, bili.key])

      React.useEffect(() => {
        if (biliOpen !== true) return undefined
        void biliProbe()
        return undefined
      }, [biliOpen])

      React.useEffect(() => {
        if (biliOpen !== true) return undefined
        const onKey = (event) => {
          if (event.key === 'Escape') {
            setBiliOpen(false)
            setBili({ phase: 'idle' })
          }
        }
        window.addEventListener('keydown', onKey)
        return () => window.removeEventListener('keydown', onKey)
      }, [biliOpen])

      const needsOf = (entry) => needs.get(entry?.name)?.needs ?? []
      const needsTag = (entry) => needs.get(entry?.name)?.tag ?? ''
      const toggleFav = (name, event) => {
        event.stopPropagation()
        const adding = !favs.has(name)
        if (adding && event.currentTarget?.classList) {
          const button = event.currentTarget
          button.classList.remove('dm-fav--pop')
          void button.offsetWidth
          button.classList.add('dm-fav--pop')
        }
        setFavs((current) => {
          const next = new Set(current)
          if (next.has(name)) next.delete(name)
          else next.add(name)
          saveFavs(next)
          return next
        })
      }
      // 鼠标位置驱动的倾斜与光晕：按帧合并，粗指针/减少动态时直接跳过
      let pointerFrame = 0
      let pending = null
      const skipPointer = () => window.matchMedia?.('(hover: hover) and (pointer: fine)').matches === false
        || window.matchMedia?.('(prefers-reduced-motion: reduce)').matches === true
      const trackPointer = (event) => {
        if (skipPointer()) return
        const card = event.currentTarget
        pending = { card, x: event.clientX, y: event.clientY }
        if (pointerFrame !== 0) return
        pointerFrame = window.requestAnimationFrame(() => {
          pointerFrame = 0
          if (pending === null) return
          const { card: target, x: clientX, y: clientY } = pending
          pending = null
          const rect = target.getBoundingClientRect()
          const x = (clientX - rect.left) / rect.width
          const y = (clientY - rect.top) / rect.height
          target.style.setProperty('--mx', `${(x * 100).toFixed(1)}%`)
          target.style.setProperty('--my', `${(y * 100).toFixed(1)}%`)
          target.style.setProperty('--ry', `${((x - 0.5) * 3).toFixed(2)}deg`)
          target.style.setProperty('--rx', `${((0.5 - y) * 3).toFixed(2)}deg`)
        })
      }
      const resetPointer = (event) => {
        event.currentTarget.style.setProperty('--rx', '0deg')
        event.currentTarget.style.setProperty('--ry', '0deg')
      }
      // 按钮点击涟漪
      const ripple = (event) => {
        const button = event.target.closest('.dm-btn')
        if (button === null) return
        const rect = button.getBoundingClientRect()
        const size = Math.max(rect.width, rect.height)
        const dot = document.createElement('span')
        dot.className = 'dm-ripple'
        dot.style.width = `${size}px`
        dot.style.height = `${size}px`
        dot.style.left = `${event.clientX - rect.left - size / 2}px`
        dot.style.top = `${event.clientY - rect.top - size / 2}px`
        button.appendChild(dot)
        window.setTimeout(() => dot.remove(), 600)
      }
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
            // 兜底：拿不到启动注入的版本时，用 DSH 自带 bundle 的版本号顶上
            setDshVersion((current) => current ?? dshVersionFromBundles(list))
          }
        } catch {
          // 没有插件管理服务时，安装状态就按索引里给的显示
        }
      }, [])

      React.useEffect(() => { void load() }, [load])

      // 版本兼容判断要用当前 DSH 版本，启动时探一次
      React.useEffect(() => {
        let alive = true
        void detectDshVersion().then((version) => { if (alive) setDshVersion(version) })
        return () => { alive = false }
      }, [])

      // 套装数据单独拉一次；拉不到就整块不显示
      React.useEffect(() => {
        let alive = true
        void loadSuitesFile().then((list) => { if (alive) setSuites(list) })
        return () => { alive = false }
      }, [])

      // 安装前提示数据；拉不到就用内置那份
      React.useEffect(() => {
        let alive = true
        void loadRequirementsFile().then((map) => { if (alive) setNeeds(map) })
        return () => { alive = false }
      }, [])

      const hasNapcat = bundles.has(CONNECT_BUNDLE)
      const hasConnector = hasNapcat || biliInstalled

      // 「装完顺便接通」的结果：重启后 host 自己跑完了，回来第一次打开连接弹窗时告诉用户
      const [resume, setResume] = React.useState(undefined)
      React.useEffect(() => {
        if (!connectOpen || resume !== undefined) return undefined
        let alive = true
        void readPending().then((value) => {
          if (alive && value?.result !== undefined && value?.result !== null) setResume(value.result)
        })
        return () => {
          alive = false
        }
      }, [connectOpen])

      // NapCat 桥的状态：面板开着时 3 秒一刷，平时 15 秒；页面在后台就跳过
      React.useEffect(() => {
        if (!hasConnector) return undefined
        let alive = true
        const tick = async () => {
          if (document.visibilityState === 'hidden') return
          const next = await readConnectState()
          if (!alive) return
          setConnectState(next)
          setConnectStamp(Date.now())
        }
        void tick()
        const timer = window.setInterval(() => void tick(), connectOpen ? 3000 : 15000)
        return () => {
          alive = false
          window.clearInterval(timer)
        }
      }, [hasConnector, connectOpen])

      // 装好但还没连上：每天第一次进市场自动弹一次，连上就不再打扰
      React.useEffect(() => {
        if (!hasConnector) return undefined
        if (connectState.status === 'idle' || connectState.online === true) return undefined
        const key = 'dsh-market-xivie:connect-pop'
        const stamp = new Date().toLocaleDateString('sv-SE')
        try {
          if (window.localStorage.getItem(key) === stamp) return undefined
          window.localStorage.setItem(key, stamp)
        } catch {
          return undefined
        }
        const timer = window.setTimeout(() => setConnectOpen(true), 1400)
        return () => window.clearTimeout(timer)
      }, [hasConnector, connectState.status, connectState.online])

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

      // Esc 关闭连接助手
      React.useEffect(() => {
        if (!connectOpen) return undefined
        const onKeyDown = (event) => { if (event.key === 'Escape') setConnectOpen(false) }
        window.addEventListener('keydown', onKeyDown)
        return () => window.removeEventListener('keydown', onKeyDown)
      }, [connectOpen])

      const entries = catalog.entries ?? []
      const categories = catalog.metadata?.categories ?? {}
      const needle = query.trim().toLowerCase()
      const paletteResults = paletteOpen ? searchEntries(entries, paletteQuery) : []
      const filtered = entries.filter((entry) => {
        if (mineOnly) {
          const installed = bundles.get(entry.name)?.installed === true || entry.installation?.status === 'installed'
          if (!installed) return false
        }
        if (favOnly && !favs.has(entry.name)) return false
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

      /** 装一个插件；失败抛错，交给调用方决定怎么提示。 */
      async function installEntry(entry, versionOverride) {
        const version = versionOverride === undefined
          ? entry.versions?.find((item) => item.version === entry.defaultVersion) ?? entry.versions?.[0]
          : entry.versions?.find((item) => item.version === versionOverride)
        const target = version?.install
        if (!target?.spec) throw new Error(t('noTarget'))
        const manager = managerRef.current?.pluginManager
        if (!manager?.inspect || !manager?.installBundle) throw new Error(t('inspectFailed'))
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
          // 装是装上了，只是没当场加载起来（DSH 要重启才会挂新 bundle）。
          // 这种情况报「失败」会让人以为插件坏了，改判成「重启生效」。
          const listed = await manager.listBundles?.()
          const list = Array.isArray(listed) ? listed : listed?.ok ? listed.value : []
          const landed = Array.isArray(list) && list.some((bundle) => bundle.name === entry.name)
          if (landed) return { ...value, application: 'restart-required' }
          const pending = Array.isArray(value.pendingBuilds) && value.pendingBuilds.length > 0
          throw new Error(pending ? t('needsApproval') : (value.error?.message ?? t('installFailed')))
        }
        return value
      }

      /**
       * 卸载已安装的插件。
       * 各版本 DSH 的接口名和参数个数都不一样（removeBundle 只收 1 个参数），
       * 所以按「方法名 × 参数个数」逐个试，只有参数个数不对才换下一个，其它错误直接抛。
       */
      async function removeEntry(entry) {
        const manager = managerRef.current?.pluginManager
        if (!manager) throw new Error(t('inspectFailed'))
        const callWith = async (method) => {
          const attempts = [[entry.name], [entry.name, { requestId: crypto.randomUUID() }]]
          let lastError
          for (const args of attempts) {
            try {
              return await manager[method](...args)
            } catch (error) {
              lastError = error
              const text = messageOf(error)
              if (/expected\s+\d+\s+argument/iu.test(text)) continue
              throw error
            }
          }
          throw lastError ?? new Error(t('removeUnsupported'))
        }
        for (const method of ['removeBundle', 'uninstallBundle', 'uninstall']) {
          if (typeof manager[method] !== 'function') continue
          const result = await callWith(method)
          if (result?.ok === false) throw new Error(result.error?.message ?? t('installFailed'))
          return 'removed'
        }
        if (typeof manager.setBundleEnabled === 'function') {
          const change = await manager.setBundleEnabled(entry.name, false)
          if (change?.application === 'failed') throw new Error(change.error?.message ?? t('installFailed'))
          return 'disabled'
        }
        throw new Error(t('removeUnsupported'))
      }

      /**
       * 装之前先拦一下：这些插件要靠外部软件 / 账号 / 设置才能跑，
       * 不提示的话用户装完只会觉得「装了没用」。
       * 返回 true 表示已经弹出提示，调用方应直接 return。
       */
      const askFirst = (rows, run) => {
        if (rows.length === 0) return false
        if (gateBypass.current) {
          gateBypass.current = false
          return false
        }
        setGate({ rows, run })
        return true
      }
      const gateRowsFor = (list) => list
        .map((entry) => ({ entry, needs: needsOf(entry), tag: needsTag(entry) }))
        .filter((row) => row.needs.length > 0 && !ackedApps.current.has(row.entry.name))
      /** 需要下载的软件默认不勾：勾上＝「我自己装，帮我开下载页」；不勾＝交给市场在「连接」里下。 */
      const prepOn = (name, index) => prepApps[`${name}#${String(index)}`] === true
      const togglePrep = (name, index) => {
        const key = `${name}#${String(index)}`
        setPrepApps((prev) => ({ ...prev, [key]: prev[key] !== true }))
      }
      /** 只有勾了「我自己装」的才代开下载页，避免一装就弹一堆标签页。 */
      const queueDownloads = (list) => {
        const urls = new Set()
        for (const entry of list) {
          needsOf(entry).forEach((need, index) => {
            if ((need.kind ?? 'app') !== 'app') return
            if (need.url === undefined) return
            if (!prepOn(entry.name, index)) return
            urls.add(`${entry.name}#${String(index)}|${need.url}`)
          })
        }
        for (const item of urls) {
          const url = item.slice(item.indexOf('|') + 1)
          try {
            window.open(url, '_blank', 'noopener,noreferrer')
          } catch {
            // 弹窗被拦就算了，详情里还有链接
          }
        }
      }
      /** 一条「还缺什么」：软件类带勾选框和下载按钮。 */
      const needRow = (entry, need, index, key) => {
        // 勾了「装完顺便接通」之后，这几条下载链接就没用了——市场会自己下，
        // 留着反而让人以为要手动点，还会把浏览器弹开。
        const autoHandled = suiteConnect && entry.name === 'dsh-onebot-qq' && need.download !== undefined
        // 提示只写一次，挂在 NapCat 那条上
        const autoNote = autoHandled && /napcat/i.test(String(need.name ?? ''))
        return h('div', { className: 'dm-suite-need', key }, 
        (need.kind ?? 'app') !== 'app' ? null : h('input', {
          type: 'checkbox',
          className: 'dm-need-check',
          checked: prepOn(entry.name, index),
          onChange: () => togglePrep(entry.name, index),
          'aria-label': `${need.name} · ${t('iInstallItMyself')}`
        }),
        h('span', { className: `dm-gate-kind dm-gate-kind--${need.kind ?? 'app'}` },
          need.kind === 'account' ? t('needsKindAccount') : need.kind === 'config' ? t('needsKindConfig') : t('needsKindApp')),
        h('div', { className: 'dm-suite-need-body' },
          h('strong', null, need.name),
          need.why === undefined ? null : h('p', null, need.why),
          autoNote ? h('p', { className: 'dm-need-auto' }, t('suiteAutoNote')) : null,
          autoHandled ? null : need.download === undefined || need.url === undefined ? null : h('a', {
            className: 'dm-gate-link dm-need-alt',
            href: need.url,
            target: '_blank',
            rel: 'noreferrer noopener'
          }, `${t('releasePage')} ↗`)),
        autoHandled ? null : need.url === undefined && need.download === undefined ? null : h('a', {
          className: 'dm-gate-link dm-need-dl',
          href: need.download ?? need.url,
          target: '_blank',
          rel: 'noreferrer noopener'
        }, `${need.download === undefined ? t('needsOpen') : t('download')} ↗`))
      }

      async function install(entry, versionOverride) {
        if (askFirst(gateRowsFor([entry]), () => void install(entry, versionOverride))) return
        queueDownloads([entry])
        setBusy(entry.name)
        setNotice(undefined)
        try {
          const value = await installEntry(entry, versionOverride)
          setNotice({
            kind: 'ok',
            text: `${pick(entry.title, entry.name)} · ${value.application === 'restart-required' || value.application === 'reload-required' ? t('restart') : t('installedOk')}`
          })
          await load()
        } catch (error) {
          setNotice({ kind: 'error', text: `${pick(entry.title, entry.name)} · ${messageOf(error)}` })
        } finally {
          setBusy('')
        }
      }

      async function uninstall(entry) {
        setBusy(entry.name)
        setNotice(undefined)
        try {
          const how = await removeEntry(entry)
          setNotice({
            kind: 'ok',
            text: `${pick(entry.title, entry.name)} · ${how === 'disabled' ? t('disabled') : t('removed')}`
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

      const connectDot = connectState.status !== 'ready' ? 'is-off' : connectState.online === true ? 'is-on' : 'is-warn'

      const actions = h('div', { style: { display: 'flex', alignItems: 'center', gap: 10 } },
        h('span', { className: 'dm-total', title: dshVersion === undefined ? t('compatUnknown') : `${t('compatDsh')} ${dshVersion}` },
          `${entries.length} ${t('plugins')}`,
          dshVersion === undefined ? null : h('em', null, ` · DSH ${dshVersion}`)),
        hasConnector ? h('button', {
          className: 'dm-ghost dm-conn-btn',
          type: 'button',
          'aria-pressed': connectOpen,
          title: t('connectHint'),
          onClick: () => setConnectOpen(true)
        }, h('span', { className: `dm-conn-dot ${connectDot}` }), t('connect')) : null,
        h('button', {
          className: 'dm-ghost',
          type: 'button',
          'aria-pressed': theme === 'dark',
          onClick: () => {
            const next = theme === 'dark' ? 'light' : 'dark'
            setTheme(next)
            saveTheme(next)
          }
        }, theme === 'dark' ? '☀' : '◐', t('appearance')),
        h('button', { className: 'dm-ghost', type: 'button', onClick: () => void load(true) },
          h(RefreshIcon), t('refresh')))

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
          h('option', { value: 'name' }, t('sortName'))),
        h('div', { className: 'dm-layout' },
          h('button', {
            type: 'button',
            'aria-pressed': layout === 'grid',
            'aria-label': t('layoutGrid'),
            title: t('layoutGrid'),
            onClick: () => setLayoutAndSave('grid')
          }, '▦'),
          h('button', {
            type: 'button',
            'aria-pressed': layout === 'list',
            'aria-label': t('layoutList'),
            title: t('layoutList'),
            onClick: () => setLayoutAndSave('list')
          }, '☰')))

      const mineCount = entries.filter((entry) => {
        const installed = bundles.get(entry.name)?.installed === true || entry.installation?.status === 'installed'
        return installed
      }).length

      const chips = Object.keys(categories).length === 0 ? null : h('div', { className: 'dm-chips' },
        h('button', {
          className: 'dm-chip', type: 'button', 'aria-pressed': category === '' && !favOnly && !mineOnly,
          onClick: () => { setCategory(''); setFavOnly(false); setMineOnly(false) }
        }, t('all'), h('span', { className: 'dm-chip-count' }, entries.length)),
        h('button', {
          className: 'dm-chip', type: 'button', 'aria-pressed': mineOnly,
          title: t('myPlugins'),
          onClick: () => { setMineOnly(!mineOnly); setFavOnly(false) }
        }, t('myPlugins'), h('span', { className: 'dm-chip-count' }, mineCount)),
        h('button', {
          className: 'dm-chip', type: 'button', 'aria-pressed': favOnly,
          title: t('favorites'),
          onClick: () => { setFavOnly(!favOnly); setMineOnly(false) }
        }, t('favorites'), ' ♥', h('span', { className: 'dm-chip-count' }, favs.size)),
        ...Object.entries(categories).map(([id, declaration]) => h('button', {
          key: id,
          className: 'dm-chip',
          type: 'button',
          'aria-pressed': category === id,
          onClick: () => setCategory(category === id ? '' : id)
        }, pick(declaration?.title, id))))

      // 筛选变化时换 key，让卡片重新挂载，入场错峰动画才会重放
      const filterKey = `${category}|${favOnly ? 1 : 0}|${mineOnly ? 1 : 0}|${sort}`
      const cardOf = (entry, index, hero = false) => {
        const status = statusOf(entry)
        const settled = status === 'installed' || status === 'provided'
        const downloads = sortKeyOf(entry, 'downloads')
        const stars = sortKeyOf(entry, 'stars')
        const version = entry.defaultVersion ?? entry.versions?.[0]?.version
        const title = pick(entry.title, entry.name)
        // 版本兼容：默认版本装不了但有别的能装，就直接给推荐版本
        const compat = compatibilityOf(entry, dshVersion)
        const fallback = compat.known && !compat.defaultOk ? compat.recommended : undefined
        // 体检说这版装不上，就不给装：装完用不了，比装不上更让人窝火
        const check = settled ? undefined : checkOf(entry)
        const checkBad = check?.status === 'fail'
        const checkText = checkBad ? checkSummary(check) : ''
        const blocked = (compat.known && !settled && compat.compatible.length === 0) || checkBad
        const compatBadge = !compat.known || settled
          ? null
          : checkBad
            ? h('span', { className: 'dm-compat dm-compat--bad', title: checkText }, t('checkFail'))
            : blocked
              ? h('span', { className: 'dm-compat dm-compat--bad', title: t('compatNone') }, t('incompatible'))
              : fallback === undefined
                ? null
                : h('span', { className: 'dm-compat dm-compat--ok', title: `${t('compatUse')} v${fallback.version}` }, `${t('compatUse')} v${fallback.version}`)
        // 装之前要准备外部东西的插件，卡片上先透个口风
        const needTag = needsTag(entry)
        const needsBadge = needTag === '' || settled
          ? null
          : h('span', {
            className: 'dm-needs',
            title: needsOf(entry).map((need) => need.name).join(' / ')
          }, `${t('needsTag')} ${needTag}`)
        const label = busy === entry.name
          ? t('installing')
          : status === 'installed' ? t('installed')
            : status === 'update' ? t('update')
              : status === 'provided' ? t('provided')
                : blocked ? (checkBad ? t('checkFail') : t('incompatible'))
                  : t('get')
        const action = settled
          ? h('span', { className: 'dm-installed' }, `✓ ${t('added')}`)
          : h('button', {
            className: 'dm-btn dm-btn--primary',
            type: 'button',
            disabled: busy !== '' || blocked,
            title: blocked ? (checkBad ? checkText : t('compatNone')) : undefined,
            onClick: () => void install(entry, fallback?.version)
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
          className: 'dm-card dm-appear', key: `${entry.name}|${filterKey}`, style: delay,
          'aria-current': current, onClick: open, role: 'button', tabIndex: 0,
          onMouseMove: trackPointer, onMouseLeave: resetPointer,
          onKeyDown: (event) => {
            if (event.target !== event.currentTarget) return
            if (event.key !== 'Enter' && event.key !== ' ') return
            event.preventDefault()
            setSelected(entry)
          }
        },
          h('div', { className: 'dm-card-top' },
            thumb,
            h('div', { className: 'dm-titles' },
              h('h3', { className: 'dm-title', title: `${title} · ${entry.name}` }, title),
              h('div', { className: 'dm-cat' }, categoryLabel, compatBadge, needsBadge)),
            h('button', {
              className: 'dm-fav',
              type: 'button',
              'aria-pressed': favs.has(entry.name),
              'aria-label': t('favorites'),
              title: favs.has(entry.name) ? t('unfavorite') : t('favorite'),
              onClick: (event) => toggleFav(entry.name, event)
            }, favs.has(entry.name) ? '♥' : '♡')),
          h('p', { className: 'dm-desc' }, pick(entry.description, '')),
          h('div', { className: 'dm-foot' }, meta, action))
      }

      // 只有没筛选时才展示精选，否则会和下面结果重复
      const featured = needle === '' && category === '' && !favOnly && !mineOnly && entries.length > 0
        ? todayFeatured(entries)
        : []
      const gridEntries = filtered
        .slice()
        .sort((left, right) => {
          if (sort === 'downloads') return (sortKeyOf(right, 'downloads') ?? 0) - (sortKeyOf(left, 'downloads') ?? 0)
          if (sort === 'stars') return (sortKeyOf(right, 'stars') ?? 0) - (sortKeyOf(left, 'stars') ?? 0)
          if (sort === 'name') return pick(left.title, left.name).localeCompare(pick(right.title, right.name), 'zh-Hans-CN')
          return 0
        })

      const top = featured[Math.min(slide, featured.length - 1)] ?? featured[0]
      const banner = top === undefined ? null : h('section', { className: 'dm-banner', 'data-slide': String(slide),
        // 高光跟着鼠标走：只改 CSS 变量，不触发布局
        onMouseMove: (event) => {
          const rect = event.currentTarget.getBoundingClientRect()
          if (rect.width === 0 || rect.height === 0) return
          event.currentTarget.style.setProperty('--mx', `${Math.round(((event.clientX - rect.left) / rect.width) * 100)}%`)
          event.currentTarget.style.setProperty('--my', `${Math.round(((event.clientY - rect.top) / rect.height) * 100)}%`)
        } },
        h('div', { className: 'dm-banner-body', key: top.name },
          h('div', { className: 'dm-banner-label' }, h('i'), `EDITOR'S PICK / ${t('featuredShort')}`),
          h('h2', null,
            t('bannerLeadPrefix'), ' ',
            h('em', null, top.metadata?.category === undefined
              ? t('community')
              : pick(categories[top.metadata.category]?.title, top.metadata.category)),
            ' ',
            t('bannerLeadSuffix')),
          h('p', null, h('strong', null, pick(top.title, top.name)), ' · ', pick(top.description, '')),
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
            ` ${(top.versions?.length ?? 0)} ${t('versions')}`)),
        featured.length < 2 ? null : h('div', { className: 'dm-banner-nav' },
          h('button', {
            className: 'dm-arrow', type: 'button', 'aria-label': t('prev'),
            onClick: () => setSlide((current) => (current - 1 + featured.length) % featured.length)
          }, '‹'),
          h('div', { className: 'dm-dots' }, ...featured.map((entry, index) => h('button', {
            key: entry.name,
            className: 'dm-dot',
            type: 'button',
            'aria-current': index === slide ? 'true' : undefined,
            'aria-label': pick(entry.title, entry.name),
            onClick: () => setSlide(index)
          }))),
          h('button', {
            className: 'dm-arrow', type: 'button', 'aria-label': t('next'),
            onClick: () => setSlide((current) => (current + 1) % featured.length)
          }, '›')))

      const miniOf = (glyph, title, sub, cat) => h('button', {
        className: 'dm-mini', type: 'button', onClick: () => setCategory(cat)
      },
        h('span', { className: 'dm-mini-icon' }, glyph),
        h('div', null, h('strong', null, title), h('p', null, sub)),
        h('span', { className: 'dm-mini-arrow' }, '↗'))

      const minis = h('section', { className: 'dm-minis' },
        miniOf('✳', t('miniTheme'), t('miniThemeSub'), 'appearance'),
        miniOf('⌘', t('miniWorkflow'), t('miniWorkflowSub'), 'workflow'))

      // 套装：按场景把几个插件打包，点开可以逐个或一次装齐
      const suiteOf = (id) => suites.find((suite) => suite.id === id)
      /** 条目支持 "包名" 或 { name, required, note, group }。group 里的项是「几选一」。 */
      const suiteItemsOf = (suite) => (suite?.items ?? []).map((item) => {
        const spec = typeof item === 'string' ? { name: item } : item
        const entry = entries.find((candidate) => candidate.name === spec.name)
        if (entry === undefined) return undefined
        return {
          entry,
          name: entry.name,
          required: spec.required === true,
          note: pick(spec.note, ''),
          group: spec.group ?? ''
        }
      }).filter(Boolean)

      /** 默认勾选：必需项 + 未装的可选项 + 每个分组里的第一个。 */
      const defaultPick = (items, suite) => {
        const picked = new Set(items.filter((item) => item.required
          || (item.group === '' && !isInstalled(item.entry))).map((item) => item.name))
        for (const group of suite?.groups ?? []) {
          // 每组先替你点第一个；preselect:false 的组除外（比如要自备 ffmpeg 的那组）
          if (group.preselect === false) continue
          const first = items.find((item) => item.group === group.id && !isInstalled(item.entry))
          if (first !== undefined) picked.add(first.name)
        }
        return picked
      }

      /** 分组是否都满足了「至少选 N 个」。 */
      const missingGroups = (items, suite, picked) => (suite?.groups ?? []).filter((group) => {
        const chosen = items.filter((item) => item.group === group.id
          && (item.required || picked.has(item.name))).length
        return chosen < (group.min ?? 1)
      })

      const isInstalled = (entry) => bundles.get(entry.name)?.installed === true
        || entry.installation?.status === 'installed'

      const installMany = async (list) => {
        if (suiteRunning) return
        if (askFirst(gateRowsFor(list.map((item) => item.entry)), () => void installMany(list))) return
        queueDownloads(list.map((item) => item.entry))
        setSuiteRunning(true)
        const pending = list.filter((item) => !isInstalled(item.entry))
        for (const item of pending) {
          setSuiteJobs((current) => ({ ...current, [item.name]: 'running' }))
          try {
            const value = await installEntry(item.entry)
            const later = value?.application === 'restart-required' || value?.application === 'reload-required'
            setSuiteJobs((current) => ({ ...current, [item.name]: later ? 'restart' : 'done' }))
          } catch (error) {
            setSuiteJobs((current) => ({ ...current, [item.name]: 'error', [`${item.name}:error`]: messageOf(error) }))
          }
        }
        setSuiteRunning(false)
        await load()
        // 勾了「顺便接通」就留个标记：重启后 host 自己把 NapCat 那套跑完，
        // 用户回来只要扫码，不用再从头点一遍。
        const wantsQq = suiteConnect && list.some((item) => item.name === 'dsh-onebot-qq')
        if (wantsQq) {
          const queued = await queueSetup({ botQQ: suiteBotQQ.trim(), adminUser: suiteAdmin.trim() })
          setNotice({ kind: queued ? 'ok' : 'error', text: queued ? t('suitePending') : t('suitePendingFail') })
        } else {
          setNotice({ kind: 'ok', text: t('suiteDone') })
        }
      }

      const suiteSection = suites.length === 0 ? null : h('section', { className: 'dm-section dm-suites' },
        h('div', { className: 'dm-catalog-head' },
          h('h2', null, t('suites'), h('small', null, t('suitesSub')))),
        h('div', { className: 'dm-suite-grid' }, ...suites.map((suite) => {
          const items = suiteItemsOf(suite)
          const ready = items.filter((item) => isInstalled(item.entry)).length
          return h('button', {
            key: suite.id,
            className: 'dm-suite-card',
            type: 'button',
            onClick: () => {
              setSuiteId(suite.id)
              setSuiteJobs({})
              setSuitePicked(defaultPick(items, suite))
            }
          },
            h('span', { className: 'dm-suite-glyph' }, suite.glyph ?? '◈'),
            h('strong', null, pick(suite.title, suite.id)),
            h('span', { className: 'dm-suite-label' }, suite.label ?? ''),
            h('span', { className: 'dm-suite-desc' }, pick(suite.desc, '')),
            h('span', { className: 'dm-suite-foot' },
              `${items.length} ${t('plugins')}`,
              h('span', null, ready > 0 ? `${ready} ${t('added')}` : '↗')))
        })))

      // 空结果也要保留搜索框和分类，用户才能自己改回来
      const gridContent = filtered.length === 0
        ? h('div', { className: 'dm-state' },
          h('span', null, t('empty')),
          h('button', {
            type: 'button',
            onClick: () => { setQuery(''); setCategory(''); setFavOnly(false); setMineOnly(false) }
          }, t('clearFilters')))
        : h('div', { className: layout === 'list' ? 'dm-grid dm-list' : 'dm-grid' },
          ...gridEntries.map((entry, index) => cardOf(entry, index)))

      const catalogSection = h('section', { className: 'dm-section', onClick: ripple },
        h('div', { className: 'dm-catalog-head' },
          h('h2', null, t('catalogTitle'), h('small', null, `${filtered.length} ${t('plugins')}`)),
          tools),
        chips,
        gridContent)

      // ⌘K / Ctrl+K 打开快捷搜索；/ 也打开；↑↓ 选择，Enter 进详情
      React.useEffect(() => {
        const onKeyDown = (event) => {
          if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
            event.preventDefault()
            setPaletteOpen((open) => !open)
            setPaletteQuery('')
            setPaletteIndex(0)
            return
          }
          if (!paletteOpen) {
            const tag = event.target?.tagName ?? ''
            if (event.key === '/' && !/^(INPUT|TEXTAREA|SELECT)$/u.test(tag)) {
              event.preventDefault()
              setPaletteOpen(true)
              setPaletteQuery('')
              setPaletteIndex(0)
            }
            return
          }
          if (event.key === 'Escape') {
            setPaletteOpen(false)
            return
          }
          const results = searchEntries(entries, paletteQuery)
          if (event.key === 'ArrowDown') {
            event.preventDefault()
            setPaletteIndex((current) => Math.min(current + 1, Math.max(results.length - 1, 0)))
          } else if (event.key === 'ArrowUp') {
            event.preventDefault()
            setPaletteIndex((current) => Math.max(current - 1, 0))
          } else if (event.key === 'Enter') {
            const target = results[paletteIndex]
            if (target !== undefined) {
              event.preventDefault()
              setSelected(target)
              setPaletteOpen(false)
            }
          }
        }
        window.addEventListener('keydown', onKeyDown)
        return () => window.removeEventListener('keydown', onKeyDown)
      }, [paletteOpen, paletteQuery, paletteIndex, entries])

      // 精选自动轮播：尊重「减少动态」
      React.useEffect(() => {
        if (featured.length < 2) return undefined
        if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) return undefined
        const timer = window.setInterval(() => {
          setSlide((current) => (current + 1) % featured.length)
        }, 7000)
        return () => window.clearInterval(timer)
      }, [featured.length])

      let body
      if (catalog.status === 'loading' && entries.length === 0) {
        body = h('div', { className: 'dm-grid' },
          ...Array.from({ length: 6 }, (_, index) => h('div', { className: 'dm-skel', key: index })))
      } else if (catalog.status === 'error') {
        body = h('div', { className: 'dm-state' },
          h('span', null, `${t('error')}：${catalog.error ?? ''}`),
          h('button', { type: 'button', onClick: () => void load(true) }, t('retry')))
      } else {
        body = h(React.Fragment, null, banner, minis, suiteSection, catalogSection)
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
          needsOf(entry).length === 0 ? null : h('div', { className: 'dm-needs-box' },
            h('strong', { className: 'dm-needs-title' }, t('needsDrawer')),
            ...needsOf(entry).map((need, index) => h('div', { className: 'dm-needs-row', key: String(index) },
              h('span', { className: `dm-gate-kind dm-gate-kind--${need.kind ?? 'app'}` },
                need.kind === 'account' ? t('needsKindAccount') : need.kind === 'config' ? t('needsKindConfig') : t('needsKindApp')),
              h('div', { className: 'dm-needs-body' },
                h('strong', null, need.name),
                need.why === undefined ? null : h('p', null, need.why),
                need.download === undefined || need.url === undefined ? null : h('a', {
                  className: 'dm-gate-link dm-need-alt',
                  href: need.url,
                  target: '_blank',
                  rel: 'noreferrer noopener'
                }, `${t('releasePage')} ↗`),
                need.url === undefined && need.download === undefined ? null : h('a', {
                  className: 'dm-gate-link',
                  href: need.download ?? need.url,
                  target: '_blank',
                  rel: 'noreferrer noopener'
                }, `${need.download === undefined ? t('needsOpen') : t('download')} ↗`))))),
          (() => {
            const compat = compatibilityOf(entry, dshVersion)
            if (!compat.known || compat.defaultOk) return null
            const requirement = versions.find((version) => version.version === entry.defaultVersion)?.engines?.dsh
              ?? entry.engines?.dsh
            return h('div', { className: 'dm-compat-bar' },
              h('div', null,
                h('strong', null, compat.compatible.length === 0 ? t('compatNone') : t('compatMismatch')),
                h('span', null, compat.compatible.length === 0
                  ? `${t('compatDsh')} ${dshVersion}`
                  : `${t('compatNeed')} ${requirement ?? '—'} · ${t('compatDsh')} ${dshVersion}`)),
              compat.compatible.length === 0 ? null : h('button', {
                className: 'dm-btn dm-btn--primary',
                type: 'button',
                disabled: busy !== '',
                onClick: () => void install(entry, compat.recommended.version)
              }, `${t('installCompat')} v${compat.recommended.version}`))
          })(),
          (() => {
            // 发布前体检的结论：装之前就把话说清楚，别等装完用不了
            const check = checkOf(entry)
            if (check === undefined || check.status === 'ok') return null
            const summary = checkSummary(check)
            const bad = check.status === 'fail'
            return h('div', { className: `dm-check${bad ? ' dm-check--bad' : ''}` },
              h('div', null,
                h('strong', null, bad ? t('checkFail') : t('checkWarn')),
                h('span', null, summary === '' ? `${t('checkLine')} · v${check.version}` : summary)))
          })(),
          h('div', { className: 'dm-detail-rows' },
            row(t('author'), entry.author),
            row(t('category'), categories[entry.metadata?.category] ? pick(categories[entry.metadata.category].title, entry.metadata.category) : undefined),
            link(t('repo'), entry.repository?.url),
            link(t('homepage'), entry.homepage),
            row(t('compatDsh'), dshVersion === undefined ? t('compatUnknown') : dshVersion),
            row(t('versionLabel'), `${versions.length}`),
            row(t('updated'), versions[0]?.publishTimestamp
              ? new Date(versions[0].publishTimestamp * 1000).toLocaleDateString('zh-CN')
              : undefined)),
          versions.length === 0 ? null : (() => {
            const compat = compatibilityOf(entry, dshVersion)
            const judged = compat.known
              ? compat.versions
              : versions.map((version) => ({ version, ok: undefined }))
            // 兼容的版本排在前面，其余保持「新 → 旧」
            const ordered = judged
              .map((item, index) => ({ ...item, index }))
              .sort((left, right) => {
                const leftBad = left.ok === false ? 1 : 0
                const rightBad = right.ok === false ? 1 : 0
                return leftBad === rightBad ? left.index - right.index : leftBad - rightBad
              })
            return h('div', { className: 'dm-versions' },
              ...ordered.slice(0, 10).map(({ version, ok }) => {
                // 体检点名的是哪个版本，版本列表里也把它标掉，别让人从这儿绕过去
                const verdict = checkOf(entry)
                const checked = verdict?.status === 'fail' && verdict.version === version.version
                return h('div', {
                  className: `dm-version${ok === false || checked ? ' is-bad' : ''}`,
                  key: version.version
                },
                  h('span', null, `v${version.version}${ok === false ? ` · ${t('incompatible')}` : checked ? ` · ${t('checkFail')}` : ''}`),
                  h('span', { className: 'dm-version-side' },
                    h('em', null, version.publishTimestamp
                      ? new Date(version.publishTimestamp * 1000).toLocaleDateString('zh-CN')
                      : ''),
                    settled || ok === false || checked ? null : h('button', {
                      className: 'dm-version-install',
                      type: 'button',
                      disabled: busy !== '',
                      onClick: () => void install(entry, version.version)
                    }, t('install'))))
              }))
          })(),
          (() => {
            const related = entries
              .filter((item) => item.name !== entry.name
                && item.metadata?.category !== undefined
                && item.metadata.category === entry.metadata?.category)
              .sort((left, right) => (sortKeyOf(right, 'downloads') ?? 0) - (sortKeyOf(left, 'downloads') ?? 0))
              .slice(0, 4)
            return related.length === 0 ? null : h('div', { className: 'dm-related' },
              h('div', { className: 'dm-related-title' }, t('related')),
              ...related.map((item) => h('button', {
                key: item.name,
                className: 'dm-related-item',
                type: 'button',
                onClick: () => setSelected(item)
              }, thumbOf(item), h('div', { className: 'dm-related-name' },
                h('strong', null, pick(item.title, item.name)),
                h('small', null, pick(categories[item.metadata.category]?.title, item.metadata.category))))))
          })(),
          h('div', { className: 'dm-detail-foot' },
            h('span', { className: 'dm-meta' },
              sortKeyOf(entry, 'stars') !== undefined ? h('span', { className: 'dm-tag' }, `★ ${formatCount(sortKeyOf(entry, 'stars'))}`) : null,
              sortKeyOf(entry, 'downloads') !== undefined ? h('span', { className: 'dm-tag' }, `↓ ${formatCount(sortKeyOf(entry, 'downloads'))}`) : null),
            settled
              ? h(React.Fragment, null,
                h('span', { className: 'dm-installed' }, `✓ ${t('installed')}`),
                entry.name === BILI_BUNDLE
                  ? h('button', {
                    className: 'dm-btn',
                    type: 'button',
                    onClick: () => setBiliOpen(true)
                  }, t('biliLogin'))
                  : null,
                h('button', {
                  className: 'dm-btn dm-btn--danger',
                  type: 'button',
                  disabled: busy !== '',
                  onClick: () => void uninstall(entry)
                }, busy === entry.name ? t('working') : t('remove')))
              : (() => {
                const compat = compatibilityOf(entry, dshVersion)
                const fallback = compat.known && !compat.defaultOk ? compat.recommended : undefined
                // 体检没过的是「最新版」；有兼容的旧版本可以装时就不拦
                const check = checkOf(entry)
                const checkBad = check?.status === 'fail' && fallback === undefined
                const blocked = (compat.known && compat.compatible.length === 0) || checkBad
                return h('button', {
                  className: 'dm-btn dm-btn--primary',
                  type: 'button',
                  disabled: busy !== '' || blocked,
                  title: blocked ? (checkBad ? checkSummary(check) : t('compatNone')) : undefined,
                  onClick: () => void install(entry, fallback?.version)
                }, busy === entry.name
                  ? t('installing')
                  : blocked
                    ? (checkBad ? t('checkFail') : t('incompatible'))
                    : t('install'))
              })()))
      })()

      // 背景预设已并入品牌主题，这里只在用户设了自定义图片时才覆盖
      const rootProps = { className: 'dm-root', 'data-theme': theme }
      if (bg.kind === 'image' && bg.url !== '') {
        const scrim = scrimOf()
        rootProps.style = {
          backgroundImage: `linear-gradient(${scrim}, ${scrim}), url("${bg.url}")`,
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }
      }

      return h('div', rootProps,
        header,
        h('div', { className: 'dm-main' }, body),
        h('footer', { className: 'dm-footer' },
          h('strong', null, 'DSH 插件市场'),
          h('span', null, '·'),
          h('a', {
            href: 'https://github.com/xivie-a/dsh-market',
            target: '_blank',
            rel: 'noopener noreferrer'
          }, 'github.com/xivie-a/dsh-market'),
          h('span', null, '· 由 xivie-a 维护，索引与界面版权归其所有')),
        detail === null ? null : h(React.Fragment, null,
          h('div', { className: 'dm-mask', onClick: () => setSelected(undefined) }),
          detail),
        suiteId === undefined ? null : (() => {
          const suite = suiteOf(suiteId)
          if (suite === undefined) return null
          const items = suiteItemsOf(suite)
          const picked = items.filter((item) => item.required || suitePicked.has(item.name))
          const pending = picked.filter((item) => !isInstalled(item.entry))
          const closeSuite = () => { setSuiteId(undefined); setSuiteJobs({}) }
          const toggle = (name) => {
            setSuitePicked((current) => {
              const next = new Set(current)
              if (next.has(name)) next.delete(name)
              else next.add(name)
              return next
            })
          }
          const doneCount = items.filter((item) => isInstalled(item.entry)
          || suiteJobs[item.name] === 'done'
          || suiteJobs[item.name] === 'restart').length
          const groups = suite.groups ?? []
          const missing = missingGroups(items, suite, new Set(picked.map((item) => item.name)))
          const canInstall = missing.length === 0 && pending.length > 0 && !suiteRunning
          const blocks = [
            ...groups.map((group) => ({
              group,
              items: items.filter((item) => item.group === group.id)
            })),
            { group: undefined, items: items.filter((item) => !groups.some((group) => group.id === item.group)) }
          ].filter((block) => block.items.length > 0)
          /** 单个插件卡片；分组和散装都用它渲染。 */
          const tileOf = (item) => {
            const installed = isInstalled(item.entry)
            const state = suiteJobs[item.name]
            const on = item.required || suitePicked.has(item.name)
            const status = state === 'error' ? t('failed')
              : installed || state === 'done' ? `✓ ${t('added')}`
                : state === 'running' ? t('installing')
                  : item.required ? `${t('required')} · ${t('autoIncluded')}`
                    : item.group === '' ? t('optional') : t('pickable')
            return h('label', {
              key: item.name,
              className: `dm-suite-tile${on ? ' is-picked' : ''}${item.required ? ' is-required' : ''}`
            },
              h('div', { className: 'dm-suite-tile-top' },
                thumbOf(item.entry),
                h('div', { className: 'dm-suite-tile-name' },
                  h('strong', null, pick(item.entry.title, item.entry.name)),
                  h('small', null, item.note !== ''
                    ? item.note
                    : (pick(item.entry.description, '')
                      || (item.entry.metadata?.category === undefined
                        ? t('community')
                        : pick(categories[item.entry.metadata.category]?.title, item.entry.metadata.category))))),
                h('input', {
                  type: 'checkbox',
                  checked: on,
                  disabled: item.required || suiteRunning,
                  'aria-label': pick(item.entry.title, item.entry.name),
                  onChange: () => toggle(item.name)
                })),
              h('div', { className: 'dm-suite-tile-foot' },
                h('span', null, item.required ? t('required') : ''),
                h('span', { className: state === 'error' ? 'dm-suite-state dm-suite-state--error' : 'dm-suite-state' }, status)))
          }
          /** 选中后原地展开：这个插件装之前还缺什么（NapCat、账号、路径…）。 */
          const needsOfItem = (item) => {
            const list = needsOf(item.entry)
            if (list.length === 0) return null
            const needsManual = list.some((row) => (row.kind ?? 'app') === 'app')
            return h('div', { className: 'dm-suite-needs' },
              h('div', { className: 'dm-suite-needs-head' },
                h('span', null, t('needsInline')),
                h('em', null, needsTag(item.entry))),
              needsManual ? h('p', { className: 'dm-need-manual' }, t('needsManualHint')) : null,
              ...list.map((need, index) => needRow(item.entry, need, index, String(index))))
          }
          /** 卡片 + 选中时展开的补充说明，绑在一起免得错位。 */
          const pairOf = (item) => {
            const on = item.required || suitePicked.has(item.name)
            const done = isInstalled(item.entry) || suiteJobs[item.name] === 'done'
            const detail = on && !done ? needsOfItem(item) : null
            return h('div', { className: `dm-suite-pair${detail === null ? '' : ' is-open'}`, key: `${item.name}-pair` },
              tileOf(item),
              detail)
          }
          return h(React.Fragment, null,
            h('div', { className: 'dm-suite-mask', onClick: closeSuite }),
            h('div', {
              className: 'dm-suite-dialog',
              role: 'dialog',
              'aria-modal': 'true',
              'aria-label': pick(suite.title, suite.id)
            },
              h('div', { className: 'dm-suite-head' },
                h('div', null,
                  h('span', { className: 'dm-suite-eyebrow' }, `${t('curatedBundle')} / ${suite.label ?? t('suites')}`),
                  h('h2', null, pick(suite.title, suite.id))),
                h('button', {
                  className: 'dm-close', type: 'button', 'aria-label': t('close'), onClick: closeSuite
                }, '×')),
              h('div', { className: 'dm-suite-body' },
                h('div', { className: 'dm-suite-intro' },
                  h('span', { className: 'dm-suite-symbol' }, suite.glyph ?? '◈'),
                  h('h3', null, t('suiteCompose')),
                  h('p', null, pick(suite.desc, '')),
                  h('div', { className: 'dm-suite-stats' },
                    h('span', null, `${items.length} ${t('plugins')}`),
                    h('span', null, `${items.filter((item) => item.required).length} ${t('required')}`),
                    h('span', null, `${doneCount} ${t('added')}`)),
                  items.some((item) => item.name === 'dsh-onebot-qq')
                    ? h('div', { className: 'dm-suite-connect' },
                      h('label', { className: 'dm-suite-connect-head' },
                        h('input', {
                          type: 'checkbox',
                          checked: suiteConnect,
                          disabled: suiteRunning,
                          onChange: () => setSuiteConnect((value) => !value)
                        }),
                        h('span', null, t('suiteConnect'))),
                      suiteConnect
                        ? h('div', { className: 'dm-suite-connect-fields' },
                          h('input', {
                            className: 'dm-setup-input',
                            type: 'text',
                            inputMode: 'numeric',
                            placeholder: t('suiteBotQQPlaceholder'),
                            value: suiteBotQQ,
                            disabled: suiteRunning,
                            onChange: (event) => setSuiteBotQQ(event.target.value)
                          }),
                          h('input', {
                            className: 'dm-setup-input',
                            type: 'text',
                            inputMode: 'numeric',
                            placeholder: t('suiteAdminPlaceholder'),
                            value: suiteAdmin,
                            disabled: suiteRunning,
                            onChange: (event) => setSuiteAdmin(event.target.value)
                          }),
                          h('p', { className: 'dm-suite-connect-hint' }, t('suiteConnectHint')))
                        : h('p', { className: 'dm-suite-connect-hint' }, t('suiteConnectOff')))
                    : null,
                  h('div', { className: 'dm-suite-actions' },
                    h('button', {
                      className: 'dm-btn dm-btn--primary',
                      type: 'button',
                      disabled: !canInstall,
                      // 展开面板里已经逐条讲过了，这里不再弹一次确认
                      onClick: () => {
                        for (const item of picked) ackedApps.current.add(item.name)
                        void installMany(picked)
                      }
                    }, suiteRunning ? t('suiteInstalling') : `${t('installSelected')} · ${pending.length}`),
                    // 有分组时「全部获取」会把所有通道都装上，没意义，只留按选择安装
                    groups.length > 0 ? null : h('button', {
                      className: 'dm-btn',
                      type: 'button',
                      disabled: suiteRunning || items.every((item) => isInstalled(item.entry)),
                      onClick: () => void installMany(items)
                    }, t('installAll')),
                    missing.length === 0
                      ? null
                      : h('div', { className: 'dm-suite-warn' }, t('mustPickOne')))),
                h('div', { className: 'dm-suite-picker' },
                  h('div', { className: 'dm-suite-picker-head' },
                    h('span', null, t('pickCombo')),
                    h('div', { className: 'dm-suite-links' },
                      h('button', {
                        type: 'button',
                        disabled: suiteRunning,
                        onClick: () => setSuitePicked(new Set(items.map((item) => item.name)))
                      }, t('selectAll')),
                      h('button', {
                        type: 'button',
                        disabled: suiteRunning,
                        onClick: () => setSuitePicked(defaultPick(items, suite))
                      }, t('keepRequired')))),
                  h('div', { className: 'dm-suite-tiles' }, ...blocks.map((block) => {
                    // 没有分组的套装就平铺；有分组时每组一个框，层级才看得见
                    const head = block.group === undefined
                      ? h('div', { className: 'dm-suite-block-head' },
                        h('strong', null, t('optionalGroup')),
                        h('em', null, `${block.items.length} ${t('plugins')}`))
                      : h('div', { className: 'dm-suite-block-head' },
                        h('strong', null, pick(block.group.title, block.group.id)),
                        (block.group.min ?? 1) <= 0
                          ? null
                          : h('span', { className: 'dm-suite-block-min' }, `≥ ${String(block.group.min ?? 1)}`),
                        h('em', null, `${block.items.length} ${t('plugins')}`))
                    const hint = block.group?.hint === undefined
                      ? null
                      : h('div', { className: 'dm-suite-block-hint' }, pick(block.group.hint, ''))
                    const body = h('div', { className: 'dm-suite-block-body' }, ...block.items.map(pairOf))
                    if (groups.length === 0) return h('div', { className: 'dm-suite-block-body', key: 'flat' }, ...block.items.map(pairOf))
                    return h('div', {
                      className: `dm-suite-block${block.group === undefined ? ' is-plain' : ''}`,
                      key: block.group === undefined ? 'rest' : `g-${block.group.id}`
                    }, head, hint, body)
                  })),
                )),
              h('div', { className: 'dm-suite-plan' },
                h('strong', null, `${t('selected')} ${picked.length} · ${t('pending')} ${pending.length}`),
                h('span', null, t('suiteOrderHint'))),
              suiteRunning || Object.keys(suiteJobs).length > 0
                ? h('div', { className: 'dm-suite-queue' },
                  h('div', { className: 'dm-suite-queue-head' },
                    h('strong', null, suiteRunning ? t('suiteBuilding') : t('suiteReady')),
                    h('span', null, `${doneCount} / ${items.length}`)),
                  h('div', { className: 'dm-suite-meter' },
                    h('span', { style: { width: `${items.length === 0 ? 0 : Math.round(doneCount / items.length * 100)}%` } })),
                  ...items.filter((item) => suiteJobs[item.name] !== undefined).map((item) => {
                    const state = suiteJobs[item.name]
                    const reason = suiteJobs[`${item.name}:error`]
                    return h('div', { key: item.name, className: 'dm-suite-job', 'data-state': state },
                      h('span', { className: 'dm-suite-job-icon' },
                        state === 'done' ? '✓' : state === 'restart' ? '↻' : state === 'error' ? '!' : '◌'),
                      h('span', { className: 'dm-suite-job-name' }, pick(item.entry.title, item.entry.name)),
                      h('span', { className: 'dm-suite-job-status' },
                        state === 'done' ? t('added')
                          : state === 'restart' ? t('restartShort')
                            : state === 'error' ? t('failed')
                              : t('onlyRunning')),
                      state === 'error' && reason !== undefined
                        ? h('span', { className: 'dm-suite-job-note', title: reason }, reason)
                        : null)
                  }))
                : null))
        })(),
        connectOpen ? (() => {
          const ready = connectState.status === 'ready'
          const online = ready && connectState.online === true
          const phase = CONNECT_PHASES[connectState.phase]
          const blocked = ready && connectState.phase === 'dedupe-blocked'
          const sms = connectState.sms?.needSms === true && !online
          const label = online
            ? [t('connOnline'), connectState.nickname || String(connectState.userId || '')].filter(Boolean).join(' · ')
            : ready
              ? (phase === undefined ? t('connWaiting') : pick({ zh: phase[0], en: phase[1] }, ''))
              : t('connNotRunning')
          const qrSrc = window.__DM_QR_MOCK__ ?? `${CONNECT_QR}?t=${connectStamp}`
          const appNeeds = (needs.get(CONNECT_BUNDLE)?.needs ?? [])
            .filter((need) => (need.kind ?? 'app') === 'app' && need.download !== undefined)
          const napcatHref = (appNeeds.find((need) => /napcat/i.test(String(pick(need.name, '')))) ?? appNeeds[0])?.download
          const refresh = async () => {
            const next = await readConnectState()
            setConnectState(next)
            setConnectStamp(Date.now())
          }
          // 一键接通：发请求 → 等它拉起 → 二维码一出来就贴上去 → 登录后再补齐 OneBot 配置
          const runSetup = async () => {
            const mine = setupQq.replace(/\D/gu, '')
            setSetupBusy(true)
            setSetupDone(undefined)
            setSetupQr(undefined)
            setSetupSteps([{ status: 'run', text: t('setupDetecting') }])
            const first = await setupPrepare({ adminUser: mine, napcatDir: setupDir.trim() })
            setSetupSteps(Array.isArray(first.steps) ? first.steps : [])
            if (first.ok !== true) {
              setSetupBusy(false)
              return
            }
            for (let tick = 0; tick < 40; tick += 1) {
              await sleep(3000)
              const state = await setupState()
              if (typeof state?.qr?.dataUrl === 'string') setSetupQr(state.qr.dataUrl)
              if (state?.online?.online === true) {
                const qq = String(state.online.qq ?? '')
                const second = await setupPrepare({ adminUser: mine, botQQ: qq, napcatDir: setupDir.trim(), launch: false })
                setSetupSteps((rows) => [...rows, ...(Array.isArray(second.steps) ? second.steps : [])])
                setSetupDone({ qq, nickname: String(state.online.nickname ?? '') })
                break
              }
            }
            setSetupBusy(false)
            await refresh()
          }
          return h(React.Fragment, null,
            h('div', { className: 'dm-suite-mask', onClick: () => setConnectOpen(false) }),
            h('div', {
              className: 'dm-conn-dialog',
              role: 'dialog',
              'aria-modal': 'true',
              'aria-label': t('connectTitle')
            },
              h('div', { className: 'dm-suite-head' },
                h('div', null,
                  h('span', { className: 'dm-suite-eyebrow' }, t('connectEyebrow')),
                  h('h2', null, t('connectTitle'))),
                h('button', {
                  className: 'dm-close', type: 'button', 'aria-label': t('close'), onClick: () => setConnectOpen(false)
                }, '×')),
              h('div', { className: `dm-conn-body${hasNapcat ? '' : ' is-slim'}` },
                h('div', { className: 'dm-conn-intro' },
                  hasNapcat ? h(React.Fragment, null,
                  h('div', { className: `dm-conn-pill${online ? ' is-on' : ready ? ' is-warn' : ' is-off'}` },
                    h('span', { className: 'dm-conn-dot' }), label),
                  h('p', { className: 'dm-conn-lead' }, t('connectIntro')),
                  // 重启后 host 已经自动跑过一遍「顺便接通」，结果直接摆在这里
                  resume === undefined ? null : h('div', {
                    className: `dm-conn-resume${resume.ok === true ? ' is-ok' : ' is-bad'}`
                  },
                  resume.ok === true
                    ? `✓ ${t('connResumeOk')}`
                    : `! ${t('connResumeFail')}：${String(resume.error ?? (resume.steps ?? []).find((row) => row.status === 'fail')?.text ?? '')}`),
                  online
                    ? h('p', { className: 'dm-conn-ok' }, t('connQrTip'))
                    : setupOpen
                      ? h('div', { className: 'dm-setup' },
                        h('div', { className: 'dm-setup-row' },
                          h('input', {
                            className: 'dm-setup-input',
                            type: 'text',
                            inputMode: 'numeric',
                            placeholder: t('setupQqPlaceholder'),
                            value: setupQq,
                            disabled: setupBusy,
                            onChange: (event) => setSetupQq(event.target.value)
                          }),
                          h('button', {
                            className: 'dm-btn dm-btn--primary',
                            type: 'button',
                            disabled: setupBusy || setupQq.replace(/\D/gu, '').length < 5,
                            onClick: () => void runSetup()
                          }, setupBusy ? t('working') : t('setupStart'))),
                        h('label', { className: 'dm-setup-path' },
                          h('span', null, t('setupPathLabel')),
                          h('input', {
                            className: 'dm-setup-input dm-setup-input--path',
                            type: 'text',
                            spellCheck: false,
                            placeholder: t('setupPathPlaceholder'),
                            value: setupDir,
                            disabled: setupBusy,
                            onChange: (event) => setSetupDir(event.target.value)
                          })),
                        setupDir === ''
                          ? null
                          : h('p', { className: 'dm-setup-hint' },
                            setupSource === 'keeper' ? t('setupReuseHint') : t('setupPathHint')),
                        setupSteps.length === 0
                          ? h('p', { className: 'dm-setup-hint' }, t('setupHint'))
                          : h('ul', { className: 'dm-setup-steps' },
                            ...setupSteps.map((row, index) => h('li', {
                              key: `${index}-${String(row.text ?? '')}`,
                              'data-state': row.status ?? 'run'
                            },
                            h('span', { className: 'dm-setup-mark' },
                              row.status === 'ok' ? '✓' : row.status === 'fail' ? '!' : '◌'),
                            h('span', null, String(row.text ?? ''))))),
                        setupDone === undefined ? null : h('div', { className: 'dm-setup-done' },
                          '✓ ', [t('connOnline'), setupDone.nickname || setupDone.qq].filter(Boolean).join(' · ')),
                        setupSteps.some((row) => row.status === 'fail') && napcatHref !== undefined
                          ? h('a', {
                            className: 'dm-conn-dl',
                            href: napcatHref,
                            target: '_blank',
                            rel: 'noreferrer noopener'
                          }, `${t('setupManual')} ↗`)
                          : null,
                        setupQr === undefined ? null : h('div', { className: 'dm-setup-qr' },
                          h('img', { src: setupQr, alt: t('connQrWait') }),
                          h('span', null, t('setupScanTip'))))
                      : h(React.Fragment, null,
                        h('strong', { className: 'dm-conn-step-title' }, t('connStepsTitle')),
                        h('ol', { className: 'dm-conn-steps' },
                          h('li', null, t('connStep1')),
                          h('li', null, t('connStep2')),
                          h('li', null, t('connStep3'))),
                        h('button', {
                          className: 'dm-btn dm-btn--primary',
                          type: 'button',
                          onClick: () => {
                            setSetupOpen(true)
                            // 把「装到哪」先问出来：宁可多一行路径，也别让用户不知道文件去了哪
                            void setupState().then((row) => {
                              const dir = row?.state?.napcat?.dir
                              if (typeof dir === 'string') setSetupDir(dir)
                              setSetupSource(String(row?.state?.napcat?.source ?? ''))
                            })
                          }
                        }, t('setupOpenOne'))),
                  blocked ? h('div', { className: 'dm-conn-warn' }, t('connBlocked')) : null,
                  // 向导开着的时候别放「下载 NapCat.Shell」——那会让人以为还得自己去下，
                  // 真下载不通时向导里会单独给这条链接。
                  online || setupOpen || napcatHref === undefined ? null : h('a', {
                    className: 'dm-conn-dl',
                    href: napcatHref,
                    target: '_blank',
                    rel: 'noreferrer noopener'
                  }, `${t('connGetNapcat')} ↗`),
                  sms ? h('div', { className: 'dm-conn-warn' }, t('connSms')) : null,
                  h('div', { className: 'dm-conn-actions' },
                    h('button', {
                      className: 'dm-btn dm-btn--primary',
                      type: 'button',
                      disabled: connectBusy || !ready,
                      onClick: async () => {
                        setConnectBusy(true)
                        await restartConnect()
                        await refresh()
                        setConnectBusy(false)
                      }
                    }, connectBusy ? t('working') : t('connRepull')),
                    h('button', {
                      className: 'dm-btn',
                      type: 'button',
                      onClick: () => window.open(CONNECT_PAGE, '_blank', 'noopener')
                    }, t('connOpenPage')),
                    h('button', { className: 'dm-btn', type: 'button', onClick: () => void refresh() }, t('connRefresh'))))
                    : h('p', { className: 'dm-conn-lead' }, t('connOnlyBili'))),
                h('div', { className: 'dm-conn-side' },
                  // 向导自己会贴二维码，这时候右侧就别再放一张，免得用户以为扫哪个都行
                  hasNapcat && !setupOpen ? h('div', { className: `dm-conn-qr${online ? ' is-on' : ''}` },
                    online
                      ? h('div', { className: 'dm-conn-qr-done' },
                        h('strong', null, '✓'),
                        h('span', null, connectState.nickname || String(connectState.userId || '')))
                      : h(React.Fragment, null,
                        h('span', { className: 'dm-conn-qr-empty' }, t('connQrWait')),
                        h('img', {
                          key: connectStamp,
                          src: qrSrc,
                          alt: t('connQrWait'),
                          onError: (event) => { event.currentTarget.style.display = 'none' }
                        }))) : null,
                  h('div', { className: 'dm-conn-bili' },
                    h('strong', null, t('connBiliTitle')),
                    h('p', null, t('connBiliHint')),
                    biliInstalled
                      ? h('button', {
                        className: 'dm-btn', type: 'button', onClick: () => setBiliOpen(true)
                      }, t('biliLogin'))
                      : null))),
              h('div', { className: 'dm-conn-foot' }, t('connAutoNote'))))
        })() : null,
        biliOpen ? (() => {
          const step = { get phase() { return biliPhaseText(bili.phase) } }
          const close = () => {
            setBiliOpen(false)
            setBili({ phase: 'idle' })
            setBiliPwd({ one: '', two: '', error: '', busy: false })
          }
          const nickname = bili.user?.name ?? bili.user?.nickname ?? ''
          const avatar = bili.user?.avatarUrl ?? bili.user?.face ?? ''
          const field = (key, placeholder) => h('input', {
            className: 'dm-bili-input',
            type: 'password',
            autoComplete: 'off',
            value: biliPwd[key],
            placeholder,
            onChange: (event) => setBiliPwd((current) => ({ ...current, [key]: event.target.value }))
          })
          return h(React.Fragment, null,
            h('div', { className: 'dm-bili-mask', onClick: close }),
            h('div', {
              className: 'dm-bili-dialog',
              role: 'dialog',
              'aria-modal': 'true',
              'aria-label': t('biliLogin')
            },
              h('div', { className: 'dm-suite-head' },
                h('div', null,
                  h('span', { className: 'dm-suite-eyebrow' }, 'BILIBILI'),
                  h('h2', null, t('biliLogin'))),
                h('button', { className: 'dm-close', type: 'button', 'aria-label': t('close'), onClick: close }, '×')),
              h('div', { className: 'dm-bili-body' },
                h('div', { className: 'dm-bili-main' },
                  h('div', { className: 'dm-bili-pill' },
                    h('span', { className: 'dm-conn-dot' }), step.phase === '' ? biliPhaseText('idle') : step.phase),
                  bili.phase === 'ready'
                    ? h(React.Fragment, null,
                      h('p', { className: 'dm-bili-lead' }, t('biliReadyHint')),
                      h('p', { className: 'dm-bili-note' }, nickname === '' ? t('biliDone') : nickname))
                    : null,
                  bili.phase === 'idle' ? h(React.Fragment, null,
                    h('p', { className: 'dm-bili-lead' }, t('biliIntro')),
                    h('button', {
                      className: 'dm-btn dm-btn--primary', type: 'button', onClick: () => void biliStart()
                    }, t('biliScanNow'))) : null,
                  bili.phase === 'loading' ? h('p', { className: 'dm-bili-lead' }, biliPhaseText('loading')) : null,
                  bili.phase === 'missing' ? h(React.Fragment, null,
                    h('p', { className: 'dm-bili-lead' }, biliInstalled ? t('biliStuckHint') : t('biliMissingHint')),
                    h('button', {
                      className: 'dm-btn', type: 'button', onClick: () => void biliProbe()
                    }, t('connRefresh'))) : null,
                  bili.phase === 'error' || bili.phase === 'expired'
                    ? h(React.Fragment, null,
                      h('p', { className: 'dm-bili-lead' }, bili.phase === 'expired' ? t('biliExpiredHint') : t('biliErrorHint')),
                      h('button', {
                        className: 'dm-btn dm-btn--primary', type: 'button', onClick: () => void biliStart()
                      }, t('biliRefreshCode')))
                    : null,
                  bili.phase === 'scan' ? h(React.Fragment, null,
                    h('p', { className: 'dm-bili-lead' }, t('biliScanTip')),
                    h('ol', { className: 'dm-bili-steps' },
                      h('li', null, pick({ zh: '手机打开 B站 App', en: 'Open the Bilibili app' }, '')),
                      h('li', null, pick({ zh: '右上角「扫一扫」', en: 'Tap “Scan” at the top right' }, '')),
                      h('li', null, pick({ zh: '确认登录，回来这里等进度', en: 'Confirm, then watch this panel' }, ''))),
                    h('p', { className: 'dm-bili-note' }, pick({
                      zh: '扫完会让你设一个本地密码，登录凭证加密存在这台机器上。',
                      en: 'Then you set a local password — the credential is stored encrypted on this machine.'
                    }, '')),
                    bili.scanned === true ? h('div', { className: 'dm-bili-note' }, biliPhaseText('scanned')) : null) : null,
                  bili.phase === 'password' ? h('form', {
                    className: 'dm-bili-form',
                    onSubmit: (event) => void biliSubmitPassword(event)
                  },
                    h('strong', { className: 'dm-bili-form-title' }, t('biliPwdTitle')),
                    h('p', { className: 'dm-bili-lead' }, t('biliPwdHint')),
                    field('one', t('biliPwdOne')),
                    field('two', t('biliPwdTwo')),
                    biliPwd.error === '' ? null : h('div', { className: 'dm-bili-error' }, biliPwd.error),
                    h('button', {
                      className: 'dm-btn dm-btn--primary', type: 'submit', disabled: biliPwd.busy
                    }, biliPwd.busy ? t('working') : t('biliSave'))) : null,
                  bili.phase === 'locked' ? h('form', {
                    className: 'dm-bili-form',
                    onSubmit: (event) => void biliSubmitUnlock(event)
                  },
                    h('strong', { className: 'dm-bili-form-title' }, biliPhaseText('locked')),
                    h('p', { className: 'dm-bili-lead' }, t('biliLockedHint')),
                    field('one', t('biliPwdOne')),
                    biliPwd.error === '' ? null : h('div', { className: 'dm-bili-error' }, biliPwd.error),
                    h('button', {
                      className: 'dm-btn dm-btn--primary', type: 'submit', disabled: biliPwd.busy
                    }, biliPwd.busy ? t('working') : t('biliUnlock'))) : null),
                h('div', { className: 'dm-bili-side' },
                  bili.phase === 'ready' || bili.phase === 'password'
                    ? h('div', { className: 'dm-bili-qr is-on' },
                      h('strong', null, '✓'),
                      h('span', null, nickname === '' ? biliPhaseText(bili.phase) : nickname))
                    : bili.phase === 'locked'
                      ? h('div', { className: 'dm-bili-qr is-idle' },
                        h('strong', { className: 'dm-bili-lock' }, '🔒'),
                        h('span', null, biliPhaseText('locked')))
                      : bili.phase === 'scan'
                      ? h('div', { className: 'dm-bili-qr' },
                        h('img', { src: bili.img, alt: t('biliScanTip') }),
                        h('button', {
                          className: 'dm-btn', type: 'button', onClick: () => void biliStart()
                        }, t('biliRefreshCode')))
                      : h('div', { className: 'dm-bili-qr is-idle' }, h('span', null, t('biliScanNow')))))))
        })() : null,
        paletteOpen ? h(React.Fragment, null,
          h('div', { className: 'dm-palette-mask', onClick: () => setPaletteOpen(false) }),
          h('div', { className: 'dm-palette', role: 'dialog', 'aria-modal': 'true', 'aria-label': t('quickSearch') },
            h('input', {
              autoFocus: true,
              value: paletteQuery,
              placeholder: t('quickSearchPlaceholder'),
              'aria-label': t('quickSearch'),
              onChange: (event) => {
                setPaletteQuery(event.target.value)
                setPaletteIndex(0)
              }
            }),
            h('div', { className: 'dm-palette-list' },
              paletteResults.length === 0
                ? h('div', { className: 'dm-palette-empty' }, t('empty'))
                : paletteResults.map((item, index) => h('button', {
                  key: item.name,
                  type: 'button',
                  className: 'dm-palette-item',
                  'aria-selected': index === paletteIndex,
                  onMouseEnter: () => setPaletteIndex(index),
                  onClick: () => {
                    setSelected(item)
                    setPaletteOpen(false)
                  }
                }, thumbOf(item),
                  h('div', { className: 'dm-palette-name' },
                    h('strong', null, pick(item.title, item.name)),
                    h('small', null, item.metadata?.category === undefined
                      ? t('community')
                      : pick(categories[item.metadata.category]?.title, item.metadata.category)))))),
            h('div', { className: 'dm-palette-hint' },
              h('span', null, h('kbd', null, '↑↓'), ' ', t('paletteNavigate')),
              h('span', null, h('kbd', null, 'Enter'), ' ', t('paletteOpen')),
              h('span', null, h('kbd', null, 'Esc'), ' ', t('paletteClose')))))
          : null,
        gate === undefined ? null : h('div', {
          className: 'dm-suite-mask',
          onClick: (event) => { if (event.target === event.currentTarget) setGate(undefined) }
        },
        h('div', { className: 'dm-dialog dm-gate', role: 'dialog', 'aria-modal': 'true' },
          h('div', { className: 'dm-suite-head' },
            h('div', null,
              h('span', { className: 'dm-suite-eyebrow' }, t('needsEyebrow')),
              h('h2', null, t('needsTitle'))),
            h('button', {
              className: 'dm-close', type: 'button', 'aria-label': t('close'), onClick: () => setGate(undefined)
            }, '×')),
          h('p', { className: 'dm-gate-note' }, t('needsNote')),
          h('div', { className: 'dm-gate-list' }, ...gate.rows.map((row) => h('div', { className: 'dm-gate-item', key: row.entry.name },
            h('div', { className: 'dm-gate-item-head' },
              thumbOf(row.entry, pick(row.entry.title, row.entry.name)),
              h('strong', null, pick(row.entry.title, row.entry.name)),
              row.tag === '' ? null : h('span', { className: 'dm-gate-tag' }, row.tag)),
            ...row.needs.map((need, index) => h('div', { className: 'dm-gate-need', key: `${row.entry.name}:${String(index)}` },
              (need.kind ?? 'app') !== 'app' ? null : h('input', {
                type: 'checkbox',
                className: 'dm-need-check',
                checked: prepOn(row.entry.name, index),
                onChange: () => togglePrep(row.entry.name, index),
                'aria-label': `${need.name} · ${t('downloadHint')}`
              }),
              h('span', { className: 'dm-gate-kind dm-gate-kind--' + (need.kind ?? 'app') },
                need.kind === 'account' ? t('needsKindAccount') : need.kind === 'config' ? t('needsKindConfig') : t('needsKindApp')),
              h('div', { className: 'dm-gate-need-body' },
                h('strong', null, need.name),
                need.why === undefined ? null : h('p', null, need.why)),
              need.url === undefined ? null : h('a', {
                className: 'dm-gate-link dm-need-dl',
                href: need.url,
                target: '_blank',
                rel: 'noreferrer noopener'
              }, `${t('download')} ↗`))))),
          h('div', { className: 'dm-gate-foot' },
            h('span', null, gate.rows.length > 1 ? `${gate.rows.length} ${t('plugins')}` : ''),
            h('div', { className: 'dm-gate-actions' },
              h('button', {
                className: 'dm-btn', type: 'button', onClick: () => setGate(undefined)
              }, t('needsCancel')),
              h('button', {
                className: 'dm-btn dm-btn--primary',
                type: 'button',
                onClick: () => {
                  const run = gate.run
                  gateBypass.current = true
                  setGate(undefined)
                  if (run !== undefined) run()
                }
              }, t('needsConfirm'))))))),
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
