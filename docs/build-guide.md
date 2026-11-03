# 索引是怎么生成的

这份文档给想改生成器、或者想自己搭一个市场的人看。普通使用者不需要读。

## 链路

```
插件页 →「发现」→ 索引源 URL
   ↓  DSH 主进程（Node，不是浏览器）fetch
index.json（format 1）
   ↓  格式校验
卡片列表 → 安装 → pnpm add name@version 装进当前 profile
```

DSH 端的实际限制（来自 0.2.1-rc.5 源码）：

| 行为 | 值 |
| --- | --- |
| 谁来下载索引 | Host 进程，所以**不需要 CORS** |
| 超时 | 15 秒 |
| 大小上限 | 128 MiB |
| 重定向 | `redirect: "error"`，301/302 直接失败 |
| 缓存 | 10 分钟 |
| 协议 | http(s)，不带凭据和 `#` 片段 |

## 本仓库的做法

```
plugins.txt ──┐
overrides.json┼─→ scripts/build-index.mjs ─→ dist/index.json ─→ Pages
icons/*.svg ──┘         │
                        └→ scripts/format-1.mjs（发布前自校验）
```

- [`scripts/build-index.mjs`](../scripts/build-index.mjs)：读列表 → 拉 npm registry 元数据 →
  只保留声明了 `dsh.bundle`、未弃用、带发布时间的版本 → 推 `engines.dsh` → 合并 overrides →
  校验 → 写出。
- [`scripts/check-index.mjs`](../scripts/check-index.mjs)：单独校验一份索引，报错带 JSON 路径。
- [`scripts/format-1.mjs`](../scripts/format-1.mjs)：format 1 的校验规则和 SemVer 比较。

只读公开元数据和下载量，从不下载 tarball、不安装、不运行被列出的代码。

## 本地跑

```sh
node scripts/build-index.mjs \
  --input plugins.txt \
  --output dist/index.json \
  --title "DSH 插件市场" \
  --overrides overrides.json \
  --downloads

node scripts/check-index.mjs dist/index.json "https://example.github.io/market/index.json"

python -m http.server 8000 --directory dist   # 本地试用
```

`--downloads` 会额外请求 `api.npmjs.org` 拿近 30 天下载量，作为可排序的 sortKey。
失败的来源只警告、不中断；一个都拿不到才报错退出。

## 格式速查

| 层级 | 必填 | 说明 |
| --- | --- | --- |
| `format` | 是 | 必须是 `1` |
| `title` | 是 | 字符串或 `{ "en": …, "zh": … }`，对象必须含 `en` |
| `metadata.categories / labels / sortKeys` | 否 | 先声明 id，插件里才能引用 |
| `plugins[].name` | 是 | 合法 npm 包名，索引内唯一 |
| `plugins[].versions[]` | 是 | `version`（精确 SemVer）、`publishTimestamp`（Unix 秒）、`source` |

完整规格见 [官方格式说明](https://github.com/deepseek-ai/deepseek-harness/blob/master/.agents/notes/implemented/feature/2026-10-02-plugin-market-index-format.zh.md)。

## 七个坑

1. **重定向会失败**：URL 必须直接返回 200。
2. **版本必须精确**：`^1.0.0` 不行；时间是 Unix **秒**。
3. **引用未声明的 id**：整份索引被拒，报错会给出 JSON 路径。
4. **图标**：相对路径按索引 URL 解析；跨源绝对地址必须 https；`data:` 内联解码后 ≤ 32 KiB。
5. **`engines.dsh`** 要和包本身一致，安装时 DSH 还会再查一次。
6. **`directory: "."`**（npm 上常见写法）格式不接受，生成器会自动忽略。
7. **没有预览机制**：索引一加就能装，想灰度就维护两份列表、两个索引地址。

## 限制

- 生成器只支持 npm 源；Git / monorepo 包请用官方参考生成器
  [`apps/plugin-market-generator`](https://github.com/deepseek-ai/deepseek-harness/blob/master/apps/plugin-market-generator/README.zh.md)。
- 不抓 GitHub star、不自动分类、不合并 `locale/*.json`；需要在 `overrides.json` 里手写。
- 校验器是轻量重写版，极端边角情况以 DSH 的报错为准。
- DSH 端有 10 分钟缓存，改完索引不会立刻全端生效。
