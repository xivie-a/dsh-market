/**
 * Host 半边：把市场的索引地址加进「发现」的索引源，并提供 /my-market 命令。
 *
 * 这里还有一个「修挂载名」的功能，但它是踩过坑之后重写的，规则变严了：
 *
 *   有些插件声明了 dsh.bundle.patch，patch 里的挂载名却写成裸名（`dsh-x` 而不是
 *   `@someone/dsh-x`）。DSH 解析不到就整块不挂载——接口没有、界面入口也没有，
 *   用户只会觉得「装了没用」。
 *
 *   2026-11-09 按这个思路批量去修，结果把 DSH 修到起不来：`@seiuna/dsh-bilibili-plugin`
 *   改对名字之后 DSH 真的去 import 它，而它这一版本身加载不了，于是开机直接
 *   `web boot: 1 entry did not activate`。原来只是「看着没装」，变成了「用不了」。
 *
 * 所以现在的规矩：
 *   1. 只修写进 heal-allowlist.json 的包（人工审核过的白名单），绝不批量猜；
 *   2. 动手之前先 import 一遍它的宿主入口，起不来就一个字都不改；
 *   3. 全程留痕到 <profile>/.dsh-market/heal-report.json，出问题能查。
 */

import { access, mkdir, readdir, readFile, rm, writeFile } from 'node:fs/promises'
import { homedir } from 'node:os'
import { basename, dirname, isAbsolute, join } from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'

import * as napcat from './napcat.js'

export const name = 'dsh-market-xivie'

export const INDEX_URL = 'https://xivie-a.github.io/dsh-market/index.json'

const SELF = 'dsh-market-xivie'

const ALLOWLIST_FILE = fileURLToPath(new URL('./heal-allowlist.json', import.meta.url))

async function exists(path) {
  try {
    await access(path)
    return true
  } catch {
    return false
  }
}

async function readJson(path) {
  try {
    return JSON.parse(await readFile(path, 'utf8'))
  } catch {
    return undefined
  }
}

/**
 * 白名单长这样（默认是空的，什么都不修）：
 *   { "packages": { "@someone/dsh-x": { "mountName": "@someone/dsh-x", "verified": ["1.0.2"] } } }
 */
export async function loadAllowlist() {
  const parsed = await readJson(ALLOWLIST_FILE)
  const packages = parsed?.packages
  if (packages === null || typeof packages !== 'object' || Array.isArray(packages)) return {}
  return packages
}

/** 把索引地址补进当前 profile 的索引源；已经存在就不动。 */
async function ensureIndex(market, url) {
  const current = market.listIndexes().map((source) => source.url)
  if (current.includes(url)) return 'present'
  await market.setIndexes([...current, url])
  return 'added'
}

/** <profile>/node_modules —— 本插件就装在里面，往上两级即可。软链安装时会指错，下面有兜底。 */
function besideNodeModules() {
  try {
    const parent = dirname(dirname(fileURLToPath(import.meta.url)))
    return basename(parent) === 'node_modules' ? parent : undefined
  } catch {
    return undefined
  }
}

/**
 * `file:` 依赖装进来是软链，import.meta.url 会指回仓库目录，上面那招就失效了。
 * 这时去 ~/.dsh/profiles 里找真正装着自己的那份 node_modules。
 */
async function findProfileNodeModules(ctx) {
  const roots = []
  if (typeof ctx?.baseDir === 'string' && ctx.baseDir !== '') roots.push(join(ctx.baseDir, 'node_modules'))
  const direct = besideNodeModules()
  if (direct !== undefined) roots.push(direct)

  for (const root of roots) {
    if (await exists(join(root, SELF))) return root
  }

  const home = typeof process.env.DSH_HOME === 'string' && process.env.DSH_HOME !== ''
    ? process.env.DSH_HOME
    : join(homedir(), '.dsh')
  const profiles = join(home, 'profiles')
  for (const profile of await readdir(profiles).catch(() => [])) {
    const root = join(profiles, profile, 'node_modules')
    if (await exists(join(root, SELF))) return root
  }
  return undefined
}

/** 列出 node_modules 下所有包的目录（含 scope）。 */
async function listPackages(dir) {
  const found = []
  let entries = []
  try {
    entries = await readdir(dir, { withFileTypes: true })
  } catch {
    return found
  }
  for (const entry of entries) {
    if (!entry.isDirectory() || entry.name === '.bin' || entry.name.startsWith('.')) continue
    if (entry.name.startsWith('@')) {
      const scoped = await readdir(join(dir, entry.name), { withFileTypes: true }).catch(() => [])
      for (const child of scoped) {
        if (child.isDirectory()) found.push(join(dir, entry.name, child.name))
      }
      continue
    }
    found.push(join(dir, entry.name))
  }
  return found
}

/** package.json 里可能写着好几种入口写法，全都算候选，第一个存在的就是真的。 */
function entryCandidates(manifest) {
  const out = []
  const push = (value) => {
    if (typeof value !== 'string' || value === '') return
    if (out.includes(value)) return
    out.push(value)
  }
  const exported = manifest?.exports
  const root = typeof exported === 'string'
    ? exported
    : exported !== null && typeof exported === 'object'
      ? exported['.']
      : undefined
  if (typeof root === 'string') push(root)
  else if (root !== null && typeof root === 'object') {
    push(root.import)
    push(root.node)
    push(root.default)
    push(root.require)
  }
  push(manifest?.main)
  push('index.js')
  return out
}

/** 真去 import 一遍宿主入口：加载不了就别改它的 patch，宁可让它保持沉默。 */
async function probeEntry(dir, manifest) {
  for (const relative of entryCandidates(manifest)) {
    if (isAbsolute(relative) || relative.startsWith('..')) continue
    const file = join(dir, relative)
    if (!(await exists(file))) continue
    try {
      await import(pathToFileURL(file).href)
      return { ok: true, file }
    } catch (error) {
      const reason = error?.code ?? error?.name ?? 'Error'
      return { ok: false, file, error: `${reason}: ${error?.message ?? String(error)}` }
    }
  }
  return { ok: false, error: '这个包没有可加载的宿主入口（package.json 里缺 main / exports）' }
}

/**
 * 把 `name: dsh-x` 改成 `name: '@someone/dsh-x'`。
 * 只在「包名带 scope、而声明的正是去掉 scope 的那半截」时动手，
 * 别的写法（子路径、跨包 insert）一律不碰。
 */
function rewriteMountName(text, packageName, mountName) {
  if (typeof mountName !== 'string' || mountName === '') return { text, changed: [] }
  const bare = packageName.startsWith('@') ? packageName.split('/')[1] : packageName
  if (bare === undefined || bare === '') return { text, changed: [] }

  const changed = []
  const lines = text.split(/\r?\n/)
  const next = lines.map((line) => {
    const match = /^(\s*(?:-\s*)?name:\s*)(['"]?)([^'"#\s]+)\2(\s*(?:#.*)?)$/.exec(line)
    if (match === null) return line
    const [, head, , value, tail] = match
    const fixed = value === bare
      ? mountName
      : value.startsWith(`${bare}/`)
        ? `${mountName}${value.slice(bare.length)}`
        : undefined
    if (fixed === undefined || fixed === value) return line
    changed.push({ from: value, to: fixed })
    // 一律加引号：YAML 的裸标量不能以 `@` 开头，写成 name: @a/b 会直接解析失败。
    return `${head}'${fixed.replaceAll("'", "''")}'${tail}`
  })

  return { text: next.join('\n'), changed }
}

function patchFilesOf(manifest) {
  const patch = manifest?.dsh?.bundle?.patch
  const list = typeof patch === 'string' ? [patch] : Array.isArray(patch) ? patch : []
  return list.filter((item) => typeof item === 'string' && item !== '' && !isAbsolute(item) && !item.startsWith('..'))
}

async function writeReport(root, rows) {
  const profile = dirname(root)
  if (!(await exists(join(profile, 'package.json')))) return
  try {
    await mkdir(join(profile, '.dsh-market'), { recursive: true })
    await writeFile(
      join(profile, '.dsh-market', 'heal-report.json'),
      `${JSON.stringify({ at: new Date().toISOString(), rows }, null, 2)}\n`,
      'utf8',
    )
  } catch {
    // 报告写不下来不算故障，日志里还有一份。
  }
}

/** 扫一遍已装的插件，只修白名单里的包。返回每一行的结论，方便命令里念给用户看。 */
export async function healBundlePatches(root, allowlist) {
  const list = allowlist ?? await loadAllowlist()
  const rows = []
  if (root === undefined || Object.keys(list ?? {}).length === 0) return rows

  for (const dir of await listPackages(root)) {
    const manifest = await readJson(join(dir, 'package.json'))
    const packageName = manifest?.name
    if (typeof packageName !== 'string' || packageName === '') continue
    const rule = list[packageName]
    if (rule === null || typeof rule !== 'object') continue

    for (const relative of patchFilesOf(manifest)) {
      const file = join(dir, relative)
      if (!(await exists(file))) continue
      const before = await readFile(file, 'utf8')
      const { text, changed } = rewriteMountName(before, packageName, rule.mountName)
      if (changed.length === 0) continue

      const row = { package: packageName, version: manifest.version, file, changed }
      // 关键一步：先确认它这一版真的加载得起来，再动它的文件。
      const probe = await probeEntry(dir, manifest)
      if (!probe.ok) {
        rows.push({ ...row, status: 'skipped', error: probe.error })
        continue
      }

      const backup = `${file}.orig`
      if (!(await exists(backup))) await writeFile(backup, before, 'utf8')
      await writeFile(file, text, 'utf8')
      rows.push({ ...row, status: 'healed' })
    }
  }

  if (rows.length > 0) await writeReport(root, rows)
  return rows
}

function describe(row) {
  const what = row.changed.map((change) => `${change.from} → ${change.to}`).join(', ')
  return row.status === 'healed'
    ? `${row.package}: ${what}`
    : `${row.package}: 想改成 ${what}，但它这一版加载不了（${row.error}），没动`
}

/* ---------- 开机保护：被某个插件锁在门外时，把它关掉，让用户永远进得来 ---------- */

/** DSH 自己写的那行，例如 `@seiuna/dsh-bilibili-plugin: import failed (see console ...)`。 */
const CRASH_LINE = /^([@\w./-]+):\s*import failed/mu

function desktopLogsDirs() {
  const appData = typeof process.env.APPDATA === 'string' && process.env.APPDATA !== ''
    ? process.env.APPDATA
    : join(homedir(), 'AppData', 'Roaming')
  return [join(appData, '@deepseek-ai', 'dsh-desktop', 'logs')]
}

async function crashFiles(dir) {
  const names = await readdir(dir).catch(() => [])
  return names.filter((name) => name.startsWith('crash-') && name.endsWith('-web-boot.log')).sort()
}

/** 从 profile 的 bundles 里摘掉一个包 —— 等于在插件页点「停用」，UI 里能一键恢复。 */
async function disableBundle(profile, packageName) {
  const file = join(profile, 'package.json')
  const before = await readFile(file, 'utf8')
  const parsed = JSON.parse(before)
  const bundles = parsed?.dsh?.profile?.bundles
  if (!Array.isArray(bundles) || !bundles.includes(packageName)) return 'not-listed'
  parsed.dsh.profile.bundles = bundles.filter((item) => item !== packageName)
  const backup = `${file}.dsh-market.bak`
  if (!(await exists(backup))) await writeFile(backup, before, 'utf8')
  await writeFile(file, `${JSON.stringify(parsed, null, 2)}\n`, 'utf8')
  return 'disabled'
}

/**
 * 上一次开机失败时，DSH 会在崩溃日志里点名是哪个 entry 没激活。
 * 这里只认那一行，不猜：点名的包从 bundles 里摘掉，下次开机就能进来。
 * 不动别人的代码文件，用户也可以在插件页把它重新打开。
 */
export async function guardBoot(root) {
  if (root === undefined) return []
  const profile = dirname(root)
  if (!(await exists(join(profile, 'package.json')))) return []

  const stateFile = join(profile, '.dsh-market', 'boot-guard.json')
  const state = (await readJson(stateFile)) ?? {}
  const handled = new Set(Array.isArray(state.handled) ? state.handled : [])
  const rows = []

  for (const dir of desktopLogsDirs()) {
    for (const file of await crashFiles(dir)) {
      if (handled.has(file)) continue
      const text = await readFile(join(dir, file), 'utf8').catch(() => '')
      handled.add(file)
      const match = CRASH_LINE.exec(text)
      if (match === null) continue
      const packageName = match[1]
      // 自家的核心包不归市场管。
      if (packageName.startsWith('@deepseek-ai/')) continue
      const status = await disableBundle(profile, packageName).catch(() => 'failed')
      rows.push({ package: packageName, crash: file, status })
    }
  }

  if (rows.length === 0) return rows
  try {
    await mkdir(join(profile, '.dsh-market'), { recursive: true })
    await writeFile(
      stateFile,
      `${JSON.stringify({ handled: [...handled], rows: [...(state.rows ?? []), ...rows] }, null, 2)}\n`,
      'utf8',
    )
  } catch {
    // 记不下来不影响已经做出的处置。
  }
  return rows
}

/* ---------- /dsh-market/napcat/*：市场里「一键接通」的后端 ---------- */

const NAPCAT_ROUTE = '/dsh-market/napcat'

function sendJson(res, status, payload) {
  res.statusCode = status
  res.setHeader('content-type', 'application/json; charset=utf-8')
  res.setHeader('cache-control', 'no-store')
  res.end(JSON.stringify(payload))
}

async function readBody(req) {
  const chunks = []
  for await (const chunk of req) chunks.push(chunk)
  if (chunks.length === 0) return {}
  try {
    const parsed = JSON.parse(Buffer.concat(chunks).toString('utf8'))
    return parsed !== null && typeof parsed === 'object' ? parsed : {}
  } catch {
    return {}
  }
}

/**
 * 「一键接通」：探测 → 补齐 → 写三份配置 → 拉起。
 * 每一步都可重复执行，已经就绪的东西一律跳过（不重复下载、不覆盖用户改过的值）。
 */
export async function prepareNapcat({
  profileRoot,
  napcatDir,
  adminUser,
  botQQ,
  token = 'dsh-local-8643',
  launch = true,
  onProgress,
} = {}) {
  const steps = []
  const step = (status, text) => {
    steps.push({ status, text })
    onProgress?.(text)
  }

  const resolved = await napcat.resolveNapcatDir(napcatDir)
  const dir = resolved.dir
  const state = await napcat.detect({ napcatDir: dir })
  if (resolved.source === 'keeper') step('ok', `沿用你已经在用的 NapCat：${dir}`)

  if (!state.qq.ok) {
    step('fail', '没找到已安装的 QQ。先装 Windows QQ 9.9.36——新的 9.9.37 一注入就会被 QQ 拦下来。')
    return { ok: false, steps, state }
  }
  if (!state.qq.supported) {
    step('fail', `这台机器上是 QQ ${state.qq.version}，高过 NapCat 支持的上限 ${napcat.QQ_MAJOR}。装回 9.9.36 再来。`)
    return { ok: false, steps, state }
  }
  step('ok', `找到 QQ ${state.qq.version}（${state.qq.dir}）`)

  try {
    const got = await napcat.ensureNapcat(dir, { onProgress: (text) => step('run', text) })
    step('ok', got.status === 'present' ? `NapCat 已经装好：${dir}` : `NapCat 装好了：${dir}`)
  } catch (error) {
    step('fail', `NapCat 下载/解压失败：${error?.message ?? error}`)
    return { ok: false, steps, state }
  }

  await napcat.writeQqnt(dir, state.qq.version)
  step('ok', 'qqnt.json 的版本已和实际 QQ 对齐（不对齐时注入会被静默跳过）')

  await napcat.writeLauncher(dir)
  step('ok', `启动脚本 ${napcat.LAUNCHER}：开了单进程，多进程只会卡在 preload`)

  if (typeof botQQ === 'string' && botQQ !== '') {
    await napcat.writeOnebotConfig(dir, botQQ, { token })
    step('ok', `OneBot 配置：HTTP ${napcat.HTTP_PORT} + 反向 WS ${napcat.WS_PORT}（token 已写）`)
  } else {
    step('run', '机器人号还不知道：等扫码登录后会自动补齐 OneBot 配置')
  }

  if (profileRoot !== undefined) {
    await napcat.writeDshOnebot(profileRoot, {
      token,
      botQQ: typeof botQQ === 'string' ? botQQ : '',
      adminUsers: typeof adminUser === 'string' && adminUser !== '' ? [adminUser] : [],
    })
    step('ok', 'DSH 侧插件配置已写：accessToken / botQQ / adminUsers / dmPolicy')
  } else {
    step('run', '没定位到当前 profile，跳过 DSH 侧配置')
  }

  await napcat.writeKeeperConfig({ dir, token })
  step('ok', '看门狗配置已写：目录、启动脚本、token，并打开了开关')

  if (launch) {
    try {
      const started = await napcat.launch(dir)
      step('ok', '已拉起 NapCat（pid ' + String(started.pid ?? '?') + '），等它连上网关')
    } catch (error) {
      step('fail', `拉起失败：${error?.message ?? error}`)
      return { ok: false, steps, state }
    }
  }

  return { ok: true, steps, state }
}

const PENDING_FILE = 'pending-setup.json'
const PENDING_RESULT = 'pending-setup.result.json'

function pendingPath(profileRoot, file) {
  return join(profileRoot, '.dsh-market', file)
}

function digitsOf(value) {
  return typeof value === 'string' ? value.replace(/\D/gu, '') : undefined
}

/**
 * 记下「插件装完还要把 QQ 接通」这件事。
 *
 * 为什么要有这个文件：装插件必须重启 DSH，而市场这个弹窗会被重启吞掉。
 * 把要做的事写在这里，重启后 host 自己续上，用户就不用回来再点一次。
 */
export async function writePendingSetup(profileRoot, payload) {
  if (profileRoot === undefined) throw new Error('找不到 DSH 的 profile 目录')
  const file = pendingPath(profileRoot, PENDING_FILE)
  await mkdir(dirname(file), { recursive: true })
  await writeFile(file, `${JSON.stringify({ at: new Date().toISOString(), ...payload }, null, 2)}\n`)
  return file
}

export async function readPendingSetup(profileRoot) {
  if (profileRoot === undefined) return undefined
  const value = await readJson(pendingPath(profileRoot, PENDING_FILE))
  return value === undefined ? undefined : value
}

export async function readPendingResult(profileRoot) {
  if (profileRoot === undefined) return undefined
  return readJson(pendingPath(profileRoot, PENDING_RESULT))
}

export async function clearPendingSetup(profileRoot) {
  if (profileRoot === undefined) return
  await rm(pendingPath(profileRoot, PENDING_FILE), { force: true })
}

/**
 * 开机时把上次没做完的「顺便接通」续上：读标记 → 跑一遍 prepare → 结果落盘 → 删标记。
 * 失败也落盘，用户下次打开连接弹窗能直接看到原因，而不是「上次好像什么都没发生」。
 */
export async function consumePendingSetup({ profileRoot, onProgress }) {
  const pending = await readPendingSetup(profileRoot)
  if (pending === undefined) return undefined
  const finish = async (result) => {
    const file = pendingPath(profileRoot, PENDING_RESULT)
    await mkdir(dirname(file), { recursive: true })
    await writeFile(file, `${JSON.stringify({ at: new Date().toISOString(), ...result }, null, 2)}\n`)
    await clearPendingSetup(profileRoot)
  }
  try {
    const result = await prepareNapcat({
      profileRoot,
      napcatDir: pending.napcatDir,
      adminUser: digitsOf(pending.adminUser),
      botQQ: digitsOf(pending.botQQ),
      launch: pending.launch !== false,
      onProgress,
    })
    await finish({ ok: result.ok, steps: result.steps, state: result.state })
    return result
  } catch (error) {
    await finish({ ok: false, error: String(error?.message ?? error) })
    throw error
  }
}

/** 把四个入口挂到 DSH 自己的 webServer 上（和看门狗用同一块地方，不用另开端口）。 */
export function registerNapcatRoutes(ctx) {
  const profileRoot = async () => {
    const root = await findProfileNodeModules(ctx)
    return root === undefined ? undefined : dirname(root)
  }

  const route = (suffix, handler) => {
    ctx.effect?.(() =>
      ctx.webServer.register({
        kind: 'exact',
        path: `${NAPCAT_ROUTE}${suffix}`,
        handler: async (req, res) => {
          try {
            await handler(req, res)
          } catch (error) {
            sendJson(res, 500, { ok: false, error: String(error?.message ?? error) })
          }
        },
      }),
    )
  }

  route('/state', async (req, res) => {
    const url = String(req.url ?? '')
    const dir = /napcatDir=([^&]+)/.exec(url)?.[1]
    const state = await napcat.detect({ napcatDir: dir === undefined ? undefined : decodeURIComponent(dir) })
    const [online, qr] = await Promise.all([napcat.online(), napcat.qrOf(state.napcat.dir)])
    sendJson(res, 200, { ok: true, state, online, qr })
  })

  route('/prepare', async (req, res) => {
    const body = await readBody(req)
    const result = await prepareNapcat({
      profileRoot: await profileRoot(),
      napcatDir: typeof body.napcatDir === 'string' ? body.napcatDir : undefined,
      adminUser: typeof body.adminUser === 'string' ? body.adminUser.replace(/\D/gu, '') : undefined,
      botQQ: typeof body.botQQ === 'string' ? body.botQQ.replace(/\D/gu, '') : undefined,
      token: typeof body.token === 'string' && body.token !== '' ? body.token : undefined,
      launch: body.launch !== false,
    })
    sendJson(res, 200, { ...result, online: await napcat.online() })
  })

  route('/launch', async (req, res) => {
    const body = await readBody(req)
    const dir = typeof body.napcatDir === 'string' && body.napcatDir !== '' ? body.napcatDir : napcat.defaultNapcatDir()
    try {
      sendJson(res, 200, { ok: true, ...(await napcat.launch(dir)) })
    } catch (error) {
      sendJson(res, 200, { ok: false, error: String(error?.message ?? error) })
    }
  })

  // 「装完顺便接通」：POST 记下来（重启后自动跑），GET 看上次跑成什么样。
  route('/pending', async (req, res) => {
    const root = await profileRoot()
    if (req.method === 'POST' || req.method === 'DELETE') {
      const body = req.method === 'POST' ? await readBody(req) : {}
      if (req.method === 'DELETE' || body.clear === true) {
        await clearPendingSetup(root)
        sendJson(res, 200, { ok: true })
        return
      }
      const file = await writePendingSetup(root, {
        botQQ: digitsOf(body.botQQ),
        adminUser: digitsOf(body.adminUser),
        napcatDir: typeof body.napcatDir === 'string' && body.napcatDir !== '' ? body.napcatDir : undefined,
      })
      sendJson(res, 200, { ok: true, file })
      return
    }
    sendJson(res, 200, {
      ok: true,
      pending: (await readPendingSetup(root)) ?? null,
      result: (await readPendingResult(root)) ?? null,
    })
  })
}

export function apply(ctx, config = {}) {
  const url = typeof config?.indexUrl === 'string' && config.indexUrl !== '' ? config.indexUrl : INDEX_URL
  const logger = ctx.logger?.('dsh-market-xivie') ?? ctx.logger
  const warn = (what) => (error) => logger?.warn?.(`dsh-market-xivie: ${what}: ${error?.message ?? String(error)}`)

  // 先看上一次是不是被谁拦在门外：是的话先把它关掉，这一开机就能进去。
  const guardSafely = () => Promise.resolve()
    .then(async () => {
      const rows = await guardBoot(await findProfileNodeModules(ctx))
      for (const row of rows) {
        logger?.warn?.(
          `dsh-market-xivie: 上次开机被 ${row.package} 拦住了（${row.status}），已把它停用，重启就能进；想再试可以在插件页重新打开`,
        )
      }
      return rows
    })
    .catch(warn('检查上次开机失败原因时出错'))

  void guardSafely()

  // 开机先跑一次：用户按提示重启时，白名单里的包已经是对的。
  const healOnce = async () => {
    const root = await findProfileNodeModules(ctx)
    if (root === undefined) return []
    const rows = await healBundlePatches(root)
    for (const row of rows) logger?.warn?.(`dsh-market-xivie: ${describe(row)}${row.status === 'healed' ? '，重启后生效' : ''}`)
    return rows
  }
  const healSafely = () => Promise.resolve().then(healOnce).catch(warn('检查插件挂载名失败'))

  void healSafely()

  // 白名单是空的就等于什么都不做，所以这个巡检默认不花钱；审核过新条目才真正动起来。
  const timer = setInterval(() => void healSafely(), 30_000)
  ctx.on?.('dispose', () => clearInterval(timer))

  // 「套装里勾了顺便接通」留下的标记：开机后自己续上，用户不用回来再点一次。
  // 延后几秒再跑，别和开机抢资源（可能要下 35 MB、还要拉起 QQ）。
  const resumeSetup = () => Promise.resolve()
    .then(async () => {
      const root = await findProfileNodeModules(ctx)
      if (root === undefined) return undefined
      const result = await consumePendingSetup({ profileRoot: dirname(root) })
      if (result !== undefined) {
        logger?.info?.(`dsh-market-xivie: 上次留的「顺便接通」已自动跑完（${result.ok ? '成功' : '有失败步骤'}）`)
      }
      return result
    })
    .catch(warn('续上「顺便接通」失败'))
  const resumeTimer = setTimeout(() => void resumeSetup(), 5_000)
  ctx.on?.('dispose', () => clearTimeout(resumeTimer))

  // 市场服务由实验性的「自定义插件市场」组合包提供，可能还没就绪，所以用 inject 等它。
  ctx.inject(['pluginMarket'], (scope) => {
    Promise.resolve()
      .then(() => ensureIndex(scope.pluginMarket, url))
      .then(
        (result) => {
          if (result === 'added') logger?.info?.(`dsh-market-xivie: 已加入索引源 ${url}`)
        },
        warn('加入索引源失败'),
      )
  })

  // 市场里的「一键接通」需要一个后端：拿得到 webServer 才挂，挂不上也不影响别的功能。
  ctx.inject(['webServer'], (scope) => {
    try {
      registerNapcatRoutes(scope)
    } catch (error) {
      warn('挂 NapCat 接口失败')(error)
    }
  })

  // 用户把源删掉后，可以随时用命令加回来。
  ctx.inject(['commands'], (scope) => {
    scope.commands.register({
      name: 'my-market',
      description: '把插件市场的索引加回「发现」/ add this plugin market index back to Discover',
      handler: async () => {
        const market = ctx.get('pluginMarket')
        if (!market) {
          return { kind: 'error', text: '当前 DSH 没有插件市场服务，请先打开「插件 → 实验性插件 → 自定义插件市场」。' }
        }
        try {
          await ensureIndex(market, url)
          return { kind: 'success', text: `已加入「发现」的索引源：${url}` }
        } catch (error) {
          return { kind: 'error', text: `加入失败：${error?.message ?? String(error)}` }
        }
      },
    })

    scope.commands.register({
      name: 'my-market-heal',
      description: '按审核白名单检查插件挂载名（只修能加载的）/ repair audited bundle mount names',
      handler: async () => {
        try {
          const allowlist = await loadAllowlist()
          if (Object.keys(allowlist).length === 0) {
            return { kind: 'success', text: '白名单是空的，市场不会去改任何插件的文件（这是故意的：乱改会让 DSH 起不来）。' }
          }
          const root = await findProfileNodeModules(ctx)
          if (root === undefined) {
            return { kind: 'error', text: '没找到插件的安装目录，可能是非标准安装方式。' }
          }
          const rows = await healBundlePatches(root, allowlist)
          if (rows.length === 0) return { kind: 'success', text: '白名单里的插件都没毛病，不用改。' }
          return { kind: 'success', text: `检查完，重启 DSH 生效：\n${rows.map(describe).join('\n')}` }
        } catch (error) {
          return { kind: 'error', text: `检查失败：${error?.message ?? String(error)}` }
        }
      },
    })
  })
}
