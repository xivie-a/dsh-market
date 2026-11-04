# DSH 插件市场

[DeepSeek Harness](https://deepseek-harness.github.io/deepseek-harness/)（DSH）的社区插件索引。
每一条收录都经过人工阅读源码后放行 —— 不是自动抓取。

## 在 DSH 里使用

1. 打开 **插件 → 实验性插件 → 更多**，打开 **自定义插件市场**
2. 到 **发现** 标签，点 **添加索引源**
3. 粘贴：

```text
https://xivie-a.github.io/dsh-market/index.json
```

之后「发现」里就能搜索、按分类筛选、看详情、直接安装。

## 收录情况

当前收录 **6** 个插件、**157** 个版本，覆盖外观、界面、工具、记忆四类。
完整的实时列表就是这个索引文件本身：

```text
https://xivie-a.github.io/dsh-market/index.json
```

## 提交插件

**前提**：你的包已经发布到 npm，且 `package.json` 里声明了 `dsh.bundle`。
没有这声明的包，DSH 装不进去，市场也收不了。

然后点仓库的 **Issues → New issue → 申请收录插件**，填表即可。
表单会问：包名、源码仓库、许可证、一句话介绍、分类，以及**它会碰什么权限**
（读文件 / 联网 / 执行命令 / 访问凭据）。

审核标准写在 [docs/review-policy.md](docs/review-policy.md)，硬性条件只有五条：

1. npm 上有发布版本，且声明了 `dsh.bundle`
2. 源码公开、许可证明确
3. 提交者是作者本人，或已获作者同意
4. 描述属实，不夸大
5. 没有明显恶意行为

## 标签的意思

| 标签 | 含义 |
| --- | --- |
| ✅ 已审查 | 维护者读过这个版本的代码，没发现问题 |
| 🆕 新收录 | 刚进市场，还没有使用反馈 |
| ⚠️ 慎用 | 功能需要高权限（执行命令、读写文件、访问凭据），或维护状况差 |

## 关于安全

**这个市场只做索引，不审计代码。** DSH 会校验索引格式，但不会验证插件的描述、
作者或代码内容。

插件是代码，运行在 DSH 主进程里，拥有和你账号同等的权限：能读写文件、发起网络
请求、执行命令，也能读到你配置的模型凭据。安装前请确认：

- 确认框里的来源是不是你信任的仓库
- 插件的 `package.json` 是不是声明了它需要的权限
- 不确定就先别装，或者先读一遍源码

## 下架

插件作者可以要求下架；发现安全问题、包被弃用或描述严重失实时，维护者会主动移除。
请在 **Issues → 申请下架插件** 里说明原因。下架只影响市场索引，已经安装的插件需要
在本地自行卸载。

## 仓库结构

| 路径 | 用途 |
| --- | --- |
| [`plugins.txt`](plugins.txt) | 收录列表，一行一个 npm 包名 |
| [`overrides.json`](overrides.json) | 卡片标题、简介、分类、标签 |
| [`docs/review-policy.md`](docs/review-policy.md) | 收录标准与下架规则 |
| [`docs/review-log.md`](docs/review-log.md) | 每条收录的审核记录 |
| [`docs/build-guide.md`](docs/build-guide.md) | 索引是怎么生成的（技术说明） |
| [`scripts/`](scripts) | 生成器与校验器，零依赖 Node 脚本 |
| [`.github/workflows/`](.github/workflows) | 每 6 小时重建并发布 |

索引在每次构建时自动生成，格式为 DSH 的
[插件市场索引 format 1](https://deepseek-harness.github.io/deepseek-harness/guide/plugin-market.html)。

本仓库与 DeepSeek 官方无隶属关系，与 dshopen.org（开放插件市场）也无隶属或合作关系。
早期收录列表从公开数据导入起步，来源与处理方式写在 [NOTICE.md](NOTICE.md)；
各插件的版权与许可证归原作者所有，`icons/` 内的图标同样归各插件作者。
