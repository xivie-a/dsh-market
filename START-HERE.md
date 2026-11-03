# 从零上线：照着点就行

你已经决定了三件事：**公开给所有人**、**你人工审核**、**有 GitHub 账号**。
下面五步做完，你就有一个真正能用的市场地址了。整个过程不需要写代码。

---

## 第 1 步：建仓库

GitHub 右上角 **+ → New repository**

- 名字：`dsh-market`（随便起）
- 可见性：**Public**
- 勾选 **Add a README file**（避免空仓库）
- 创建

## 第 2 步：把文件传上去

最简单的方式（不用装 Git）：

1. 在仓库页点 **Add file → Upload files**
2. 把这个文件夹里的东西**全部**拖进去
   - 包括 `.github` 文件夹（里面有审核表单和自动发布）
   - 上传时如果浏览器提示隐藏文件，直接把 `.github` 文件夹整个拖进浏览器窗口即可
3. 下面填一句说明，点 **Commit changes**

> 装了 Git 的话：`git init && git add . && git commit -m "init" && git remote add origin <你的仓库地址> && git push -u origin main`

## 第 3 步：打开自动发布

仓库 **Settings → Pages → Build and deployment**

- Source 选 **GitHub Actions**（不要选 Deploy from a branch）

## 第 4 步：手动跑一次

仓库 **Actions → 构建插件市场索引 → Run workflow → Run workflow**

等 1～2 分钟，它会：抓 npm 数据 → 生成 `index.json` → 校验 → 发布到 Pages。

绿勾之后，你的市场地址就是：

```
https://<你的用户名>.github.io/<仓库名>/index.json
```

（在 Actions 里那次运行的 deploy 步骤能看到确切网址）

## 第 5 步：贴进 DSH

DSH → **插件 → 实验性插件 → 更多 → 自定义插件市场**（打开开关）
→ **发现 → 添加索引源** → 粘贴上面的地址。

搞定。之后每 6 小时它会自动更新一次。

---

## 日常怎么运转

```
别人提 issue（用「申请收录插件」表单）
        ↓
你审核（清单见 docs/review-policy.md）
        ↓
在 plugins.txt 加一行 + 在 docs/review-log.md 记一行
        ↓
合并 → 6 小时内自动重建 → 所有用户看到
```

你审核时只看四件事：

1. 包在 npm 上真的存在，且 `package.json` 里有 `dsh.bundle`
2. 源码仓库公开、许可证明确
3. 扫一眼代码：有没有偷偷读文件、发数据、执行命令
4. 描述没吹牛（卡片上的字会直接展示给所有人）

## 想改东西

| 想改 | 改哪个文件 |
| --- | --- |
| 收录哪些插件 | [`plugins.txt`](plugins.txt)，一行一个 npm 包名 |
| 市场标题、描述 | [`.github/workflows/market.yml`](.github/workflows/market.yml) 里 `--title` / `--description` |
| 分类、标签、卡片标题 | [`overrides.json`](overrides.json) |
| 收录标准、下架规则 | [`docs/review-policy.md`](docs/review-policy.md) |

改完提交，Actions 会自动重建，不用手动发布。

## 常见问题

**Q：示例里的 6 个插件要留着吗？**
不用。把 [`plugins.txt`](plugins.txt) 换成你自己审核过的包，然后删掉 [`overrides.json`](overrides.json) 里对应的那几条（不删也没关系，只是多余的配置）。

**Q：怎么加图标？**
在仓库里建 `icons/` 目录，放 `<包名>.svg`（`@scope/name` 写成 `scope__name.svg`），构建时会自动引用。

**Q：插件下架怎么办？**
从 `plugins.txt` 删掉那一行即可，下次构建后市场里就没有了。已经装了的用户不受影响。

**Q：一定要有网站吗？**
不用。DSH 只读 `index.json`。等你想让人在网页上逛的时候，再加一个静态页面。

**Q：审核要花多久？**
第一次收录一个插件，5～10 分钟（读一遍 package.json + 扫一眼 index.js）。熟练后 2 分钟。
