from pathlib import Path
import json
import re

root = Path(__file__).parent
page = (root / 'concept.html').read_text(encoding='utf-8-sig')
styles = (root / 'enhancements.css').read_text(encoding='utf-8-sig') + '\n' + (root / 'motion.css').read_text(encoding='utf-8-sig')
app = (root / 'market-app.js').read_text(encoding='utf-8-sig') + '\n' + (root / 'motion.js').read_text(encoding='utf-8-sig')
marker = 'window.__INDEX__ = '
catalog = json.loads((root / 'catalog.json').read_text(encoding='utf-8-sig'))
page = page.replace('</style>', styles + '\n</style>', 1)
page = page.replace('<div class="sidebottom">', '<button class="nav" data-nav="favorites">♡ <span class="navtext">我的收藏</span><span id="favoriteCount">0</span></button><div class="sidebottom">', 1)
page = page.replace('<button id="theme"', '<button id="quickSearch" class="quiet" aria-label="快捷搜索，Ctrl K">⌕ <span class="quicklabel">快捷搜索</span> <kbd>⌘ K</kbd></button><button id="theme"', 1)
page = page.replace('<section class="heading">', '<nav class="mobile-nav" aria-label="市场导航"><button data-nav="discover">◈ 探索插件</button><button data-nav="installed">▦ 我的插件</button><button data-nav="favorites">♡ 我的收藏</button></nav><section class="heading">', 1)
page = page.replace('<span class="heroindex">', '<div class="hero-controls" aria-label="切换精选"><button data-direction="-1" aria-label="上一张精选">‹</button><button class="dot" data-slide="0" aria-label="精选：上下文压缩" aria-pressed="true"></button><button class="dot" data-slide="1" aria-label="精选：梦幻皮肤" aria-pressed="false"></button><button class="dot" data-slide="2" aria-label="精选：任务看板" aria-pressed="false"></button><button data-direction="1" aria-label="下一张精选">›</button></div><span class="heroindex">', 1)
page = page.replace('<input id="search"', '<div class="searchbox"><input id="search"', 1)
page = page.replace('aria-label="搜索插件"><select', 'aria-label="搜索插件"><kbd>/</kbd></div><select', 1)
page = page.replace('</select></div></div><div class="chips"', '</select><div class="view-toggle" aria-label="显示方式"><button data-layout="grid" aria-label="网格视图" aria-pressed="true">▦</button><button data-layout="list" aria-label="列表视图" aria-pressed="false">☰</button></div></div></div><div class="chips"', 1)
page = page.replace('<div class="grid" id="grid">', '<div class="filter-summary" id="filterSummary" aria-live="polite"></div><div class="grid" id="grid">', 1)
page = page.replace('<dialog id="detail">', '<dialog id="detail" aria-label="插件详情">', 1)
page = page.replace('<button class="install" id="drawerInstall"></button>', '<button class="install" id="drawerInstall"></button><button class="install remove hidden" id="removePlugin">移除</button>', 1)
page = page.replace('<script>/*__CATALOG__*/</script>', '<dialog id="command" class="command" aria-label="快捷搜索"><div class="commandhead"><span aria-hidden="true">⌕</span><input id="commandSearch" role="combobox" aria-label="搜索插件" aria-autocomplete="list" aria-expanded="true" aria-controls="commandResults" placeholder="寻找你的下一件工具…" autocomplete="off"><button id="commandClose" aria-label="关闭快捷搜索">ESC</button></div><div id="commandResults" class="commandresults" role="listbox" aria-label="搜索结果"></div><div class="commandhint">↑ ↓ 选择 · Enter 查看详情 · Esc 关闭</div></dialog><button class="backtop hidden" id="backtop" aria-label="返回顶部">↑</button><script>/*__CATALOG__*/</script>', 1)
page = re.sub(r'(<script>/\*__CATALOG__\*/</script>\s*<script>).*?(</script>)', lambda m: m[1] + '\n' + app + '\n' + m[2], page, count=1, flags=re.S)
page = page.replace('/*__CATALOG__*/', marker + json.dumps(catalog, ensure_ascii=False).replace('</', '<\\/') + ';')
(root / 'index.html').write_text(page, encoding='utf-8')
scripts = re.findall(r'<script>(.*?)</script>', page, re.S)
(root / 'preview-check.js').write_text('\n'.join(scripts), encoding='utf-8')
print(f'Built standalone index.html: {len(catalog["plugins"])} plugins, {len(page):,} characters')
