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

当前收录 **114** 个插件、**3968** 个版本，覆盖外观、界面、工具、记忆、开发与运维、技能、集成、用量与费用、工作流与协作、模型供应商、知识与研究十一类。

## 安装前准备

有些插件装上去只是「空壳」，真正要跑起来还缺外部条件 —— 比如 QQ 通道要 NapCat.Shell
和一个 QQ 号，B 站工具包要扫一次码。市场会把这些写在根目录的
[requirements.json](requirements.json) 里，并在两个地方提醒：

- 卡片分类后的小角标，例如 `集成 需 B站`
- 点安装时先弹一层确认：逐条列出缺什么（软件 / 账号 / 设置）、为什么需要、去哪儿下，
  可以「先不装」，也可以「我准备好了，继续安装」

详情抽屉里同样有一块「安装前准备」，装完再忘了要配什么可以回来查。

套装（比如「大肥鱼套装」）里还有一类**必装但市场装不了**的东西，写在
[suites.json](suites.json) 的 `prereqs` 里，出现在弹窗顶部的「开始之前」：
NapCat.Shell 就属于这种 —— 它不是 npm 插件，得你自己下一次 Windows 包。

数据跟索引一起发布，所以补一条也不需要重发插件：

```text
https://xivie-a.github.io/dsh-market/requirements.json
```

## 版本兼容提示

插件在 `engines.dsh` 里声明自己支持的 DSH 版本区间，市场打开时会读取你当前的 DSH
版本逐条判断：

- 默认版本装得上 —— 卡片正常显示，页眉标出 `114 个插件 · DSH x.y.z`
- 默认版本装不上、但有旧版本能装 —— 卡片标 `兼容 vX.Y.Z`，按钮直接装那个版本
- 一个都装不上 —— 标 `不兼容`，按钮置灰（例如 `dsh-bilibili-plugin` 把 peer 锁死在 0.2.0-rc.2）

详情页里兼容的版本排在前面，每个版本右侧都能单独点「安装」。
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

本仓库与 DeepSeek 官方无隶属关系；各插件的版权与许可证归原作者所有，
`icons/` 里的图标同样归各插件作者（直接从各自 npm 包中取出）。
数据来源与处理方式见 [NOTICE.md](NOTICE.md)。
