# dsh-market-xivie

给 DSH 加一个自己的插件市场入口：**插件页多一个「我的市场」标签**，**左侧导航多一行「我的市场」**。
数据和「发现」用的是同一份索引，所以装插件、已安装状态、版本信息都是现成的。

## 安装

DSH 桌面版目前只能用本地目录装（还没发 npm）：

1. **插件 → 添加插件**
2. 输入这个目录的绝对路径：

```
D:\DSH\workplace\project-chajianshichang\plugin
```

3. 安装 → **重启 DSH**

重启后「插件」页应该多出「我的市场」标签，左侧导航多一行。

## 它在做什么

- **Host 半边**（`index.js`）：把索引地址补进「发现」的索引源，并提供 `/my-market` 命令（被删掉后可以加回来）。
- **Client 半边**（`client.js`）：往 `plugins.tab` 和 `sidebar.panellist` 两个槽位注册界面，读索引、画卡片、调内置的安装流程。

## 改样式

样式单独放在 [`styles.css`](styles.css)，`client.js` 里的 `const STYLES` 是它内联后的副本（DSH 只加载 `client.js` 一个文件，样式必须以字符串形式带上）。

所以流程是：

```sh
# 1. 改 styles.css
# 2. 内联进 client.js
node ../scripts/inline-styles.mjs
# 3. 本地看效果（可选）
node ../scripts/build-preview.mjs
```

不要直接改 `client.js` 里的那份 CSS —— 下次内联会被覆盖。

索引地址写在 `index.js` 和 `client.js` 各一处常量里：

```
https://xivie-a.github.io/dsh-market/index.json
```

改市场地址要同时改这两处。

## 依赖

- 建议打开 **插件 → 实验性插件 → 自定义插件市场**：开了就用内置的市场服务（分页、搜索、安装状态都准）。
- 没开也能用：client 会直接 `fetch` 索引文件，自己拼安装地址，功能少一点。

## 卸载

插件页找到 **dsh-market-xivie**，关掉开关或卸载，重启 DSH 即恢复原样。
索引源不会自动删（那是「发现」里的数据），要清就去「发现 → 管理索引源…」删掉。

## 已知限制

- 只有列表 + 搜索 + 分类 + 安装，没有点赞、推荐轮播、自更新。
- 安装不带确认弹窗的版本差异：目前用 `window.confirm` 确认，走 `manager.inspect` + `installBundle`。
- 还没发到 npm，别人要用只能拿目录或 fork 自己发。
