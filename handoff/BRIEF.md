# 交给 ChatGPT / 其他模型改前端时，用这段作为提示词

把本目录整个上传给 ChatGPT（或 Claude），然后把下面「提示词」整段粘进去。
它给出的东西拿回来给我，我负责集成和截图验证。

---

## 提示词（整段复制）

```
我在做一个 DeepSeek Harness（DSH）的插件市场前端，现在需要你重新设计视觉样式。

【素材】
- client.js：完整的组件源码。样式是文件里的 `const STYLES = \`...\`` 这一段（纯 CSS 字符串），
  渲染逻辑是 React.createElement 手写，不要改。
- preview.html：可以直接用浏览器打开的自包含预览页（真实组件 + 假数据 + 60 个插件）。
- grid.png / drawer.png：当前效果的截图。

【硬性约束】
1. 只改 CSS。不要改 JS、不要改 class 名、不要改 DOM 结构。
2. 不引入任何外部资源：不许用 Google Fonts、图标库、Tailwind、图片、web font。
3. 必须自动适配深色主题：不要写死 #fff / #000 背景或文字色。
   可用的主题变量：--dsh-accent（强调色）、--dsh-border（描边色），都当它们"可能存在也可能不存在"，
   所以要给 fallback，例如 color: var(--dsh-accent, #4d6bfe)。
4. 用系统字体栈，不要指定字体文件。
5. 响应式：窗口 1000px 以上是 3 列卡片网格；详情面板是固定在右侧、宽 440px 的抽屉。
6. 不要用 CSS 框架的写法（比如 @apply），要能在浏览器里直接生效。
7. 动画要克制，且尊重 prefers-reduced-motion。

【当前结构（class 名，不能改）】
- .dm-root 页面容器（含顶部渐层背景，可保留或重做）
- .dm-hero 头部（h1 + 数量胶囊 .dm-pill + 副标题 .dm-sub + 右侧按钮 .dm-ghost）
- .dm-tools 工具栏（.dm-search-wrap > .dm-search、.dm-select 排序）
- .dm-chips / .dm-chip / .dm-chip-count 分类胶囊
- .dm-section / .dm-section-head 分区标题（「精选」「全部插件」）
- .dm-featured / .dm-hero-card / .dm-hero-main / .dm-hero-side 精选横幅（左内容右按钮）
- .dm-grid / .dm-card / .dm-card-top / .dm-thumb / .dm-titles / .dm-title / .dm-pkg
  / .dm-desc / .dm-foot / .dm-meta / .dm-tag / .dm-btn / .dm-installed
- .dm-detail 右侧抽屉（.dm-detail-head / .dm-detail-desc / .dm-detail-rows / .dm-versions
  / .dm-detail-foot / .dm-close）、.dm-mask 遮罩
- .dm-toast 右下角提示、.dm-skel 骨架屏
- 状态类：.dm-appear（入场动画）、[aria-current="true"]（选中的卡片）、
  [aria-pressed="true"]（选中的胶囊/色卡）

【我想要的效果】
（在这里写你的偏好，例如：更像 App Store 的克制感 / 更有活力的卡片 / 想要柔和阴影 / 想要更紧凑……）

【交付格式】
只输出一段完整的替换代码，格式严格如下，不要额外解释、不要 Markdown 代码块以外的内容：

const STYLES = `
...完整的 CSS...
`

【验收标准】
- 把这张 CSS 放回文件后，页面不能出现看不清的文字（浅色/深色主题下都要能读）。
- 卡片网格在 1200px 宽时是 3 列，不能溢出。
- 抽屉宽 440px，内容可滚动，不遮挡关闭按钮。
```

---

## 拿到答复之后

1. 把 ChatGPT 给的 `const STYLES = ...` 整段发我。
2. 我替换进 `plugin/client.js`，用无头 Edge 截图（浅色 + 打开抽屉两版），对比后再决定用不用。
3. 如果它顺手改了 JS 或结构，我会指出哪里不能要 —— 结构改动会影响 DSH 里的真实行为。

## 为什么不建议让它「直接重写组件」

- 它看不到 DSH 真实渲染（主题变量、字体、滚动容器都由 DSH 决定）
- 它不知道 `ctx.inject(['remote.pluginMarket'])` 这类运行约束，改 JS 很可能把插件改坏
- CSS 是纯函数式的，改坏了只影响外观；JS 改坏了插件直接不工作
