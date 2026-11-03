# 自己做一个 DSH 插件市场

dshopen.org 那种市场，本质不是网站、不是服务端，而是**一个 JSON 文件 + 一份静态托管**。
DSH 的「发现」页是内置 UI，你只要给它一个索引地址，它就能浏览、搜索、安装里面列的插件。

这个目录是一个可以直接跑的最小实现：零依赖生成器 + 校验器 + 示例索引 + GitHub Pages 工作流。

> **只想上线？直接看 [START-HERE.md](START-HERE.md)** —— 五步，照着点，不用读这篇。
> 这篇是给想知道原理、或者要改造成自己形态的人看的。

已经按「公开市场 + 人工审核」配好了：收录申请表、审核清单、审核记录、PR 校验、自动发布。
日常流程是 **别人提 issue → 你按 [审核规则](docs/review-policy.md) 看一遍 → 在
[plugins.txt](plugins.txt) 加一行、在 [审核记录](docs/review-log.md) 记一行 → 合并 →
6 小时内自动上线**。

---

## 1. 原理：一条链路看明白

```
插件页 →「发现」→ 你添加的索引源 URL
   ↓  DSH 主进程（Host，不是浏览器）fetch
index.json（format 1）
   ↓  校验（格式、SemVer、声明过的 category/label/sortKey）
卡片列表 → 点安装 → 确认框显示真实来源
   ↓
pnpm add name@version（npm 源）或 git+https://…#<commit>（git 源）装进当前 profile
```

来自 DSH 0.2.1-rc.5 源码的实际限制：

| 行为 | 值 | 对你的影响 |
| --- | --- | --- |
| 谁去下载索引 | Host 进程（Node `fetch`） | **不需要配 CORS**，纯静态托管就够 |
| 超时 | 15 秒 | 索引别太大、别依赖慢接口 |
| 大小上限 | 128 MiB | 上千插件也够，但别塞 base64 大图 |
| 重定向 | `redirect: "error"` | 301/302 会直接失败，URL 必须精确到能 200 |
| 缓存 | 10 分钟 | 改了索引要等，或在「管理索引源」里重新添加 |
| 协议 | 必须 http(s)，不带账号密码和 `#` | 生产环境用 https |

**最重要的一条**：索引里写什么，DSH 就装什么。安装 spec（`name@version` 或 git commit）
完全由索引决定，所以索引本身就是供应链 —— 见第 5 节。

---

## 2. 三种做法，按投入选

### A. 官方参考生成器（正式做，推荐）

DSH 仓库自带 [`apps/plugin-market-generator`](https://github.com/deepseek-ai/deepseek-harness/blob/master/apps/plugin-market-generator/README.zh.md)：

```sh
git clone --depth 1 https://github.com/deepseek-ai/deepseek-harness
cd deepseek-harness
pnpm install
pnpm --filter @deepseek-ai/dsh-plugin-market-generator start \
  --input plugins.txt --output site/index.json --title "我的插件市场"
```

支持 npm 包和 Git 仓库（含 monorepo 子目录）、自动提取图标、读 `locale/*.json` 做多语言、
按标签/默认分支收集版本、本地缓存、产物确定性。**它只下载和读取文件，从不安装或运行包里
的代码。** 缺点是得先有 DSH 仓库和 pnpm 环境。

### B. 本目录的零依赖生成器（个人 / 团队小市场）

不用 clone、不用装依赖，Node ≥ 20 直接跑：

```sh
node scripts/build-index.mjs \
  --input plugins.txt \
  --output dist/index.json \
  --title "我的插件市场" \
  --overrides overrides.json \
  --downloads
```

只支持 npm 源（Git 源请走 A）。它会：拉 registry 元数据 → 只保留声明了 `dsh.bundle`、
未弃用、有发布时间的版本 → 推 `engines.dsh`（取包自己的声明，或唯一的 `@deepseek-ai/dsh*`
peer 范围）→ 生成索引 → 用内置校验器过一遍再写文件。

### C. 纯手写

[`examples/index.json`](examples/index.json) 就是一份可以直接对照改的最小索引，20 行起。
插件少、更新不频繁时最省事。

> 还有一种「像 dsh-open-market 那样把 UI 也搬进 DSH」的做法：写一个 Cordis 插件，在
> 「插件」页注册一个标签页，自己去拉索引渲染。成本高一个数量级，而且官方「发现」页已经
> 覆盖了浏览、搜索、筛选、安装的完整流程 —— 除非你要做分组收藏、点赞这类额外功能，否则不建议。

---

## 3. 四步上线

**1）准备列表。** 改 [`plugins.txt`](plugins.txt)，每行一个 npm 包名。
只有声明了 `dsh.bundle.patch` 的包才会出现在市场里 —— 普通 npm 包会被跳过并提示。

**2）生成并校验。**

```sh
node scripts/build-index.mjs --input plugins.txt --output dist/index.json --title "我的插件市场"
node scripts/check-index.mjs dist/index.json https://example.com/market/index.json
```

要加图标就往 `dist/icons/` 放 `<包名>.svg`（`@scope/name` 写成 `scope__name.svg`），
生成器会自动引用成相对路径。没有图标也能用，卡片显示包名首字。

**3）本地先试一遍。** 起个静态服务器，在 DSH 里加 `http://127.0.0.1:8000/index.json`：

```sh
python -m http.server 8000 --directory dist
# 或 npx serve dist
```

前置条件：**插件 → 实验性插件 →（更多）→ 自定义插件市场** 打开，才会出现「发现」标签；
关闭它会同时移除「发现」和 Creator 模式下的 `plugin_market` 工具。

**4）发布。** 把 `dist/` 传到任意静态主机（GitHub Pages、Cloudflare Pages、OSS/COS 的 https
自定义域名、公司内网 https 站点都行），然后在 **发现 → 添加索引源** 粘贴 `.../index.json`。

[`.github/workflows/market.yml`](.github/workflows/market.yml) 已经写好：每 6 小时重建一次，
校验后发布到 Pages。仓库 Settings → Pages → Source 选 GitHub Actions 即可。
去掉 `--downloads` 可以少打一次 npm 下载量接口。

---

## 4. 格式速查 + 七个坑

完整规格见[官方格式说明](https://github.com/deepseek-ai/deepseek-harness/blob/master/.agents/notes/implemented/feature/2026-10-02-plugin-market-index-format.zh.md)，
这里只列会踩的：

| 层级 | 必填 | 说明 |
| --- | --- | --- |
| `format` | 是 | 必须是 `1` |
| `title` | 是 | 字符串或 `{ "en": …, "zh": … }`；对象必须含 `en` |
| `description` | 否 | 同上 |
| `metadata.categories / labels / sortKeys` | 否 | 先在这里声明 id，插件里才能引用 |
| `plugins` | 是 | 顺序即市场默认顺序 |
| `plugins[].name` | 是 | 合法 npm 包名，索引内唯一 |
| `plugins[].versions` | 是 | 至少一个；每条含 `version`、`publishTimestamp`、`source` |

1. **重定向会失败。** `redirect: "error"` 是硬要求。GitHub Pages 在大小写、末尾斜杠上会 301，
   索引 URL 一定要用浏览器打开返回 200 的那个地址。
2. **版本必须精确。** `"version": "1.0.0"` 对，`"^1.0.0"` 不行；`publishTimestamp` 是 Unix
   **秒**，不是毫秒。
3. **引用未声明的 id 会整份索引被拒。** `metadata.category: "tools"` 之前，`metadata.categories`
   里必须先有 `tools`；labels、sortKeys 一样。
4. **图标规则。** 相对路径按索引 URL 解析（`icons/foo.svg` → `<索引目录>/icons/foo.svg`）；
   跨源的绝对地址必须 `https:`；内联 `data:` URL 解码后 ≤ 32 KiB。
5. **`engines.dsh` 要和包自己的一致。** 它只影响「这个版本在卡片上是否可装」，安装时 DSH 还会
   按包自身再查一次，写错了只是显示不一致或干脆装不上。
6. **`name` 必须真的是那个包。** 校验器无法验证 `name`、版本、时间、图标是否与包相符 ——
   它只查你写的东西自洽不自洽。
7. **没有预览或草稿机制。** 索引一加就能装。想灰度就维护两份列表、两个索引地址。

---

## 5. 权限与信任：市场真正危险的地方

### 插件不是配置，是代码

DSH 插件是 Cordis 插件：Host 侧是跑在 DSH 主进程里的 Node 代码，Client 侧是注入网页的浏览器
代码。安装 = 往当前 profile 里 `pnpm add` 一个包，下次启动时被加载执行。

**没有插件沙箱。** 你的 DSH 有文件沙箱（`read-only` / `workspace-write` /
`danger-full-access`），但它约束的是**工具调用**（比如我执行命令、写文件），不是插件。
插件拿的是你的用户身份，能做你账号能做的一切：

- 读写任意文件（包括 `~/.ssh`、项目源码、浏览器数据）
- 任意网络请求（把数据发出去）
- 起子进程、执行命令
- 读 DSH 凭据服务里的东西 —— **包括你的模型 API key**

### 市场只是索引，DSH 不审计

DSH 校验的是格式：JSON 结构、SemVer、id 声明、图标协议。它**不**验证这个包是谁写的、描述是否
属实、代码有没有后门。官方文档的原话：

> 市场是第三方内容。每个插件的标题、描述、图标、作者和来源都由市场决定；DSH 检查文件格式，
> 但不验证这些声明。只添加你信任的索引源，并在安装前核对确认框中的来源。

### 索引就是供应链

安装 spec 来自索引：npm 的 `name@version`，或 git 的 `git+https://…git#<40 位 commit>`。

- 索引走 `http:` → 同网络的人可以把它改成任意仓库/包，你点安装就中招。**用 https。**
- 索引作者能随时把某个版本指向别处；pin 到 commit 的 git 源比 npm 的 tag 更抗改。
- 包名投毒（`dsh-drem-skin` 这种）在插件生态里最容易得手，因为大家靠名字找东西。

### 三类插件的风险不一样

| 类型 | 例子 | 风险 |
| --- | --- | --- |
| 纯外观 | 主题、壁纸 | 低，但 client 代码仍在页面里跑，能读页面数据和 token |
| 模型供应商 | 接订阅、接第三方 API | 高：要经手你的 key，或把请求转发到它自己的服务器 |
| 工具 / 记忆 / 集成 | 浏览器控制、命令执行、MCP | 最高：几乎等于把 shell 交出去 |

### 给市场运营者的清单

- 只收录能追到源码仓库、有明确许可证、有真实 npm 版本的包；抄 README 不可信。
- 发布前跑 `scripts/check-index.mjs`；CI 里每个来源失败都要能看到。
- 别把索引放在会被别人改的地方；`plugins.txt` 的每次改动都要 review。
- 想标「已审查」，就真的读一遍代码 —— 标签是给别人的安全承诺。

### 给使用者的清单

- 只加你信任的索引源，安装前看确认框里的来源是不是你以为的那个仓库。
- 装完可以卸：`dsh plugin --profile desktop remove <包名>`。
- 插件出问题时，先关掉「自定义插件市场」或卸掉可疑插件，再看 `~/.dsh/logs`。

---

## 6. 本目录的限制

- 生成器只支持 npm 源；Git / monorepo 请用官方生成器。
- 不抓 star、不自动分类、不合并 `locale/*.json` 的多语言标题；需要就在 `overrides.json` 里写。
- 校验器是轻量重写版，可能放过 DSH 会拒的边角情况；以 DSH 报错里的 JSON 路径为准。
- DSH 端有 10 分钟缓存，改完索引不会立刻全端生效。

## 文件

| 文件 | 作用 |
| --- | --- |
| [`START-HERE.md`](START-HERE.md) | **五步上线**，不想读原理就看这个 |
| [`plugins.txt`](plugins.txt) | 收录列表，一行一个 npm 包名 |
| [`overrides.json`](overrides.json) | 人工覆盖：分类、标签、卡片标题 |
| [`overrides.example.json`](overrides.example.json) | 同一份配置的模板，可删 |
| [`docs/review-policy.md`](docs/review-policy.md) | 收录标准、审核步骤、下架规则 |
| [`docs/review-log.md`](docs/review-log.md) | 每条收录/下架的审核记录 |
| [`.github/ISSUE_TEMPLATE/`](.github/ISSUE_TEMPLATE) | 收录申请、下架申请表单 |
| [`.github/PULL_REQUEST_TEMPLATE.md`](.github/PULL_REQUEST_TEMPLATE.md) | 合并前的检查清单 |
| [`scripts/build-index.mjs`](scripts/build-index.mjs) | 生成索引 |
| [`scripts/check-index.mjs`](scripts/check-index.mjs) | 发布前校验 |
| [`scripts/format-1.mjs`](scripts/format-1.mjs) | format 1 校验器 + SemVer 比较 |
| [`examples/index.json`](examples/index.json) | 手写最小索引，直接可对照 |
| [`.github/workflows/market.yml`](.github/workflows/market.yml) | 每 6 小时重建并发布到 Pages |
| [`.github/workflows/check-pr.yml`](.github/workflows/check-pr.yml) | PR 里先跑一遍生成器，不合规就红叉 |

## 参考

- [插件市场 · DSH 文档](https://deepseek-harness.github.io/deepseek-harness/guide/plugin-market.html)
- [索引格式 Agent Note](https://github.com/deepseek-ai/deepseek-harness/blob/master/.agents/notes/implemented/feature/2026-10-02-plugin-market-index-format.zh.md)
- [参考生成器](https://github.com/deepseek-ai/deepseek-harness/blob/master/apps/plugin-market-generator/README.zh.md)
- [进程沙箱](https://deepseek-harness.github.io/deepseek-harness/reference/subsystems/sandbox.html)
- 现成例子：[dshopen.org](https://dshopen.org/zh/)（[索引](https://dshopen.org/index.json)）
