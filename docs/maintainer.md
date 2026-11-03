# 维护者手册

这份文档只给仓库维护者看：怎么收一个插件、怎么下架、怎么改市场信息。

## 日常：收一个插件

```
1. 有人提 issue（「申请收录插件」表单）
2. 按 docs/review-policy.md 审核（5～10 分钟）
3. 在 plugins.txt 加一行
4. 在 overrides.json 补标题 / 简介 / 分类 / 标签
5. 在 docs/review-log.md 记一行
6. 合并 → 触发构建 → 6 小时内全端生效
```

审核时重点看四件事：

- `package.json` 里有没有 `dsh.bundle`（没有就装不进去）
- 有没有 `postinstall` 脚本（安装即执行，最容易被塞东西）
- 代码里有没有 `child_process`、静默外发 `fetch`、读凭据
- 卡片上的简介是不是替代了 npm 上那段又长又杂的原始描述

## 简介怎么写

`overrides.json` 里的 `description` 会**替换** npm 上的原始描述。建议：

- 中文一句话，20～40 字，说清「它帮你做什么」
- 不写营销词（「革命性」「最强」），不写版本号
- 英文可选，填了就中英双语

```json
"dsh-web-mobile": {
  "title": { "en": "Mobile Web Layout", "zh": "网页移动端适配" },
  "description": { "en": "Adapts the web interface to portrait screens.", "zh": "让网页界面适配竖屏和手机。" },
  "category": "interface"
}
```

## 改市场标题和描述

在 [`.github/workflows/market.yml`](../.github/workflows/market.yml) 里改这两行：

```yaml
--title "DSH 插件市场" \
--description "社区插件索引，每条人工审核后收录" \
```

## 加图标

在仓库建 `icons/` 目录，放 `<包名>.svg`（`@scope/name` 写成 `scope__name.svg`），
构建时自动引用成相对路径。没有图标也不影响使用，卡片会显示占位。

## 下架

1. 从 `plugins.txt` 删掉那一行（不删 `overrides.json` 也没关系，多余条目会被忽略）
2. 在 `docs/review-log.md` 记一条 `removed` 和原因
3. 有安全问题的，同时在 issue 里回复提醒已安装的用户自行卸载

## 重建

- 自动：每次推送到 `main`（改了 `plugins.txt`、`overrides.json`、`icons/`、`scripts/` 时）
- 定时：每 6 小时一次（`.github/workflows/market.yml` 的 cron）
- 手动：Actions → 构建插件市场索引 → Run workflow

> 一个例外：**新增工作流文件的那次提交不会触发它自己**。仓库建好第一次推送时
> Actions 可能没跑，之后每次都正常。遇到刚建仓库没跑的情况，手动 Run 一次即可。

## 如果构建失败

先看 Actions 里 `生成索引` 那步的日志：

- `HTTP 404` / `没有未弃用…的版本` → 包名写错，或者这个包没声明 `dsh.bundle`
- `生成的索引不合规：$...` → 格式问题，报错里给了具体路径
- `deploy` 报 `Pages is not enabled` → 去 Settings → Pages 把 Source 设成 GitHub Actions

本地复现：

```sh
node scripts/build-index.mjs --input plugins.txt --output dist/index.json --title "测试" --overrides overrides.json
node scripts/check-index.mjs dist/index.json
```
