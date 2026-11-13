# 从零把 QQ 接进 DSH

这份是重装时照抄的流程。2026-11-13 实际走过一遍，每一步都是踩坑后定下来的，别省。

涉及两个插件：`dsh-onebot-qq`（OneBot 11 通道）和 `dsh-napcat-keeper`（看门狗 + 二维码面板）。
NapCat 是 QQ 的 OneBot 11 适配层——它挂进 QQ 进程，把消息收发暴露成 HTTP / 反向 WebSocket；二维码就是手机 QQ 扫码登录那个号。

---

## 阶段 0：卸载与清理

**0.1 先停链**

- DSH 设置 →「napcat 桥」→ 关开关
- 杀 `QQ.exe` 和 `NapCatWinBootMain.exe`：按 pid 精确杀。`Get-Process QQ | Stop-Process` 会把整条命令打断（返回 `exit code 4294967295`）

**0.2 卸插件**

设置 → 插件 → 卸载 `dsh-onebot-qq`、`dsh-napcat-keeper`（要重来的人设插件一并卸）。

**0.3 删软件**

| 删什么 | 路径 |
|---|---|
| NapCat | `D:\NapCat` |
| OneKey 那套（含便携 QQ） | `D:\DSH\ruanjian\NapCat.Shell.Windows.OneKey` |
| QQ 本体 | 先跑 `Uninstall.exe`，再删安装目录 |
| QQ 数据（彻底重来才删） | `%APPDATA%\QQ`、`Documents\Tencent Files` |

**0.4 清残留配置**

- `%USERPROFILE%\.dsh\dsh-napcat-keeper\`（`config.json` / `state.json` / `keeper.log`）
- `%USERPROFILE%\.dsh\media\onebot\chat-sessions.json`
- `%USERPROFILE%\.dsh\profiles\desktop\cordis.patch.yml` 里的 `- id: dsh-onebot` 段
- `%USERPROFILE%\.dsh\sessions\--C-Users-Administrator-.dsh-profiles-desktop--\onebot-*`（旧 QQ 会话）

---

## 阶段 1：装 QQ —— 必须是 9.9.36

NapCat 4.18.42 的 QQ 版本适配表最高到 `9.9.36-53644`。**9.9.37 一定不行**：一注入，QQ 就弹「文件已损坏，请重新安装 QQ。」然后退出。那是 QQ 检测到注入后的自我保护，不是包坏了（签名查过，全部 Valid）。

- 安装包走镜像（腾讯 CDN 直链会 403）：
  `https://github.com/a1515333102/QQ-Releases/releases/download/9.9.36%2B3.2.34/QQ_9.9.36_260924_x64_01.exe`
- 静默安装：`Start-Process '<安装包>' -ArgumentList '/S'`
- 装完打开 QQ，扫码登录一次，确认能正常用
- ⚠️ QQ 自带更新器会把它升回 9.9.37。发现版本变了就重装回 9.9.36，否则第二天注入又失败

---

## 阶段 2：装 NapCat.Shell

1. 下载 `https://github.com/XingYunStar/NapCatQQ/releases/download/v4.18.42/NapCat.Shell.zip`（约 35 MB），解压到 `D:\NapCat`
   - 上游 `NapNeko/NapCatQQ` 在 2026-11 把 release 全删了（README 只剩「## Ending / 到这里告一段落」），原来的 `releases/latest/download/NapCat.Shell.zip` 现在必然 404，所以这里指社区归档仓的 v4.18.42 产物（和上游最后一版是同一份，35,967,555 字节）
   - 国内直连 GitHub 不稳时，地址前面加 `https://gh-proxy.com/` 之类的加速前缀；市场里的「一键接通」会自动在几个源之间重试，也可以手动把 zip 放到目录里让它跳过下载
2. 顶层应该有：`launcher.bat`、`qqnt.json`、`loadNapCat.js`、`napcat.mjs`、`NapCatWinBootMain.exe`、`NapCatWinBootHook.dll`
3. **改 `qqnt.json`，把版本对齐到实际 QQ**：

   ```json
   "version": "9.9.36-53644",
   "buildVersion": "53644"
   ```

   默认写的是 `9.9.22-40990`。版本对不上时，注入器**静默跳过、不报错**——现象是"装好了但一点反应都没有"。

4. 新建 `D:\NapCat\launcher-dsh.bat`，**纯 ASCII，不能有中文**：

   ```bat
   @echo off
   cd /d "%~dp0"
   set "NAPCAT_DISABLE_MULTI_PROCESS=1"
   call "%~dp0launcher.bat" %*
   ```

   `NAPCAT_DISABLE_MULTI_PROCESS=1` 不是可选项。NapCat 默认多进程，主进程 fork 的那个 worker 起不来，表现是 `[preload] succeeded` 打完就再没有一行输出、6099/3000 全不监听。单进程才正常。

5. **不要手改 `<QQ安装目录>\versions\<版本>\resources\app\package.json`**。改过一次，hook 就报 `error code v2:-8` 并跳过注入。这个文件必须保持原版（486 B，`"main": "./application.asar/app_launcher/index.js"`），让 hook 自己在内存里打补丁。

---

## 阶段 3：装 DSH 插件

在市场里装 `dsh-onebot-qq` 和 `dsh-napcat-keeper`。

---

## 阶段 4：三方对齐（端口 / token / 号）

**4.1 插件侧** —— `%USERPROFILE%\.dsh\profiles\desktop\cordis.patch.yml`：

```yaml
- id: dsh-onebot
  config:
    accessToken: "dsh-local-8643"
    botQQ: "<机器人QQ>"        # NapCat 登录的那个号
    adminUsers:
      - "<你的QQ>"             # 允许私聊触发的人
    dmPolicy: open
```

两个坑都在这个文件里：

- `accessToken` 不能为空。`reverse` 模式会直接抛 `reverse mode requires a non-empty accessToken`，8643 永远连不上。
- `dmPolicy: open` **不是"谁都能私聊"**：代码里 open 只放行 `adminUsers`。名单空着 = 所有私聊被静默丢弃（NapCat 收到了、也转成 OneBot 事件了，DSH 这边一个会话都不建）。

**4.2 NapCat 侧** —— `D:\NapCat\config\onebot11_<QQ号>.json`：

```json
"httpServers": [{
  "name": "dsh-http", "enable": true, "port": 3000,
  "host": "127.0.0.1", "enableCors": true, "token": ""
}],
"websocketClients": [{
  "name": "dsh-ws-reverse", "enable": true,
  "url": "ws://127.0.0.1:8643",
  "token": "dsh-local-8643", "reconnectInterval": 5000
}]
```

token 两边必须一字不差。默认这份文件里 `httpServers` / `websocketClients` 都是空数组，不填就只有扫码没有端口。

**4.3 看门狗侧** —— DSH 设置 → napcat 桥：

| 项 | 填什么 |
|---|---|
| NapCat Shell 目录 | NapCat 解压出来的那个目录 |
| 启动脚本 | `launcher-dsh.bat`（**不要留空**，留空它会自动挑到 `quickLoginExample.bat` 这种空脚本，点「重新拉起」等于把登录好的链杀掉） |
| OneBot 端口 | `3000` |
| 访问令牌 | 与纳 `accessToken` 相同 |
| 开关 | 打开 |

⚠️ 直接改 `%USERPROFILE%\.dsh\dsh-napcat-keeper\config.json` 会被 UI 覆盖。要么用 UI，要么调桥的 `/save` 接口。

---

## 阶段 5：启动 + 扫码

1. 打开开关，看门狗用 `launcher-dsh.bat` 拉起 NapCat
2. 日志里应依次出现：`NapCat.Core Version: 4.18.42` → `网络已连接` → `二维码已保存到 D:\NapCat\cache\qrcode.png`
3. 扫码：手机 QQ 扫**控制台那个码**（或 `http://127.0.0.1:8899/` 面板）。码 2 分钟换一次，过期就重新拉
4. `http://127.0.0.1:6099/webui?token=...` 是 WebUI（看状态、改配置），**不是登录入口**，不用管它
5. 扫码过程中别点「重新拉起」

---

## 阶段 6：验收

```powershell
# 1. OneBot HTTP 在线，且登录的是预期的号
Invoke-WebRequest 'http://127.0.0.1:3000/get_login_info' -UseBasicParsing | ForEach-Object Content

# 2. 反向 WS 有客户端连进来（应该有一条 Established）
Get-NetTCPConnection -LocalPort 8643 | Where-Object State -eq 'Established'

# 3. WebUI 端口
Test-NetConnection 127.0.0.1 -Port 6099 -InformationLevel Quiet
```

4. 端到端：用另一个号给机器人发一条 → DSH 左侧栏「工作区」下面应该多出一个会话，QQ 里应该收到回复

四条全过才算通。缺第 2 条 = token 没对上；缺第 4 条 = `adminUsers` 没写进去。

---

## 阶段 7（可选）：人设分层

`dsh-memory` 有 `Global` / `Workspace` 两种作用域，**同名文件 Workspace 覆盖 Global**，所以按工作区换人格不用改代码：

| 想要 | 怎么做 |
|---|---|
| QQ 一套人格、工作台一套 | `SOUL.yaml` / `ME.yaml` 放 `<工作区>\.memory\`，`meta_data.scope` 写 `Workspace` |
| 两边同一个人 | 什么都不做，用 Global 那份 |
| 关于你、共同经历的 | 留 Global，两边共享 |

**不要用目录联接（junction）把记忆目录搬到别的盘**：搬完之后插件的目录监听跨不过联接，会报"文件被删除"并把索引清空，得重启才能恢复。要换盘就改 `DSH_HOME`，或者接受 C 盘。

---

## 坑一览（按代价排序）

| 坑 | 症状 | 正确做法 |
|---|---|---|
| QQ 9.9.37 | 弹「文件已损坏，请重新安装 QQ」 | 装 9.9.36，并防自动升级 |
| `qqnt.json` 版本没对齐 | 无输出、无端口，以为装好了 | 改成和实际 QQ 版本一致 |
| 多进程模式 | `preload succeeded` 之后没动静 | `NAPCAT_DISABLE_MULTI_PROCESS=1` |
| 手改 app 的 `package.json` | `error code v2:-8`，注入被跳过 | 保持原版，让 hook 自己 patch |
| 批处理带中文 | `'APCAT_PATCH_PACKAGE' 不是内部或外部命令` | .bat 只能纯 ASCII |
| keeper 启动脚本留空 | 自动挑空脚本，点一下就杀掉登录链 | 手填 `launcher-dsh.bat` |
| 把 `dmPolicy: open` 当"全开放" | 私聊全被静默丢弃 | 把自己写进 `adminUsers` |
| 记忆目录做成 junction | 插件报文件被删，索引清空 | 别用联接 |
