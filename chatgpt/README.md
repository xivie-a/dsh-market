# DSH Market · 视觉与交互原型

双击 `index.html` 即可预览。所有样式、脚本和 60 个插件数据已内嵌，不需要安装依赖或启动服务。

## 修改入口

| 文件 | 修改内容 |
| --- | --- |
| `concept.html` | 基础页面结构、文案、基础 CSS。模板，不是最终预览页。 |
| `enhancements.css` | 收藏、快捷搜索、列表模式、详情标签和响应式样式。 |
| `motion.css` | 卡片抬升与光晕、按钮反馈、悬停和动效曲线。 |
| `market-app.js` | 搜索、分类、排序、收藏、演示添加、撤销、精选切换、详情和本地保存。 |
| `motion.js` | 鼠标倾斜、跟随光晕、点击涟漪、收藏弹跳、滚动入场及面板动画。 |
| `catalog.json` | 独立的 60 个插件数据，可直接增删、修改。 |
| `build-preview.py` | 将模板、交互所需结构、CSS、JS 和插件数据合并成自包含预览页。 |
| `check-interactions.cjs` | 不依赖第三方包的交互逻辑检查，需要 Node.js。 |
| `index.html` | 生成的最终预览页。不要把长期修改只写在此文件中，重新构建会覆盖。 |
| `preview-check.js` | 生成的合并脚本，供语法检查使用，不需要手动编辑。 |

基础布局在 `concept.html`；收藏按钮、快捷搜索框、轮播控制等补充结构由 `build-preview.py` 注入，修改这些结构时编辑构建脚本对应的替换片段。

## 修改后生成预览

在本文件夹终端执行（需要 Python 3，无第三方 Python 依赖）：

```powershell
python .\build-preview.py
```

然后重新打开 `index.html`，或在浏览器按 Ctrl+F5 刷新。

可选检查（需要 Node.js，无 npm 依赖）：

```powershell
node --check .\preview-check.js
node .\check-interactions.cjs
```

检查覆盖应用状态和交互逻辑，不代替浏览器视觉、布局和动画实测。

## 体验功能

- 卡片悬停抬升、轻倾斜、光晕跟随；按钮按压与涟漪；收藏爱心反馈。
- 三套精选内容、主题切换、网格/列表、分类和关键词搜索。
- Ctrl/Command+K 快捷搜索，方向键选择，Enter 打开详情；按 `/` 聚焦页面搜索。
- 收藏与演示添加在浏览器 localStorage 中保存；支持移除、撤销和重置。
- 详情抽屉提供版本记录、相关推荐、复制包名与项目仓库入口。
- 触屏按压反馈；遵循 `prefers-reduced-motion` 关闭动态效果。

添加/移除仅为本地原型交互，没有连接 DSH 插件安装接口。迁入真实 DSH 前，需要接入宿主数据、主题与安装 API。

## 已有文件

`index-before-interactions.html`、`index-before-motion.html` 是历史预览备份，已保留。
目录里原有的 `market-styles.js` 属于更早的 CSS 替换方案，不参与此全新原型的构建，本次未覆盖。
