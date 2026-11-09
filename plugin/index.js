/**
 * Host 半边：把市场的索引地址加进「发现」的索引源，并提供 /my-market 命令。
 *
 * 浏览器半边（client.js）负责界面；这里做两件安装侧的事：
 *   1. 让用户装上插件后，不用再手动去「发现 → 添加索引源」；
 *   2. 修掉「声明了 bundle 但挂载名写错」的插件——上游偶尔会把带 scope 的
 *      包名写成裸名（`dsh-x` 而不是 `@someone/dsh-x`），DSH 解析不到就整块
 *      不挂载：接口没有、界面入口也没有，用户只会觉得"装了没用"。
 */

import { readdir, readFile, writeFile, access } from 'node:fs/promises'
import { basename, dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

export const name = 'dsh-market-xivie'

export const INDEX_URL = 'https://xivie-a.github.io/dsh-market/index.json'

/** 把索引地址补进当前 profile 的索引源；已经存在就不动。 */
async function ensureIndex(market, url) {
  const current = market.listIndexes().map((source) => source.url)
  if (current.includes(url)) return 'present'
  await market.setIndexes([...current, url])
  return 'added'
}

/** <profile>/node_modules —— 本插件就装在里面，往上两级即可，不用猜。 */
function nodeModulesDir() {
  try {
    return dirname(dirname(fileURLToPath(import.meta.url)))
  } catch {
    return undefined
  }
}

async function exists(path) {
  try {
    await access(path)
    return true
  } catch {
    return false
  }
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

/**
 * 把 `name: dsh-x` 改成 `name: '@someone/dsh-x'`。
 * 只在「包名带 scope、而声明的正是去掉 scope 的那半截」时动手，
 * 别的写法（子路径、跨包 insert）一律不碰。
 */
function rewriteMountName(text, packageName) {
  if (!packageName.startsWith('@')) return { text, changed: [] }
  const bare = packageName.split('/')[1]
  if (bare === undefined || bare === '') return { text, changed: [] }

  const changed = []
  const lines = text.split(/\r?\n/)
  const next = lines.map((line) => {
    const match = /^(\s*(?:-\s*)?name:\s*)(['"]?)([^'"#\s]+)\2(\s*(?:#.*)?)$/.exec(line)
    if (match === null) return line
    const [, head, quote, value, tail] = match
    const fixed = value === bare
      ? packageName
      : value.startsWith(`${bare}/`)
        ? `${packageName}${value.slice(bare.length)}`
        : undefined
    if (fixed === undefined) return line
    changed.push({ from: value, to: fixed })
    return `${head}${quote}${fixed}${quote}${tail}`
  })

  return { text: next.join('\n'), changed }
}

/** 扫一遍已装的插件，修掉挂载名写错的 patch 文件。返回修了哪些。 */
export async function healBundlePatches(root = nodeModulesDir()) {
  if (root === undefined) return []
  const fixed = []
  for (const dir of await listPackages(root)) {
    const manifestPath = join(dir, 'package.json')
    let manifest
    try {
      manifest = JSON.parse(await readFile(manifestPath, 'utf8'))
    } catch {
      continue
    }
    const patch = manifest?.dsh?.bundle?.patch
    const patchFiles = typeof patch === 'string' ? [patch] : Array.isArray(patch) ? patch : []
    for (const relative of patchFiles) {
      if (typeof relative !== 'string') continue
      const file = join(dir, relative)
      if (!(await exists(file))) continue
      const before = await readFile(file, 'utf8')
      const { text, changed } = rewriteMountName(before, manifest.name ?? '')
      if (changed.length === 0) continue

      const backup = `${file}.orig`
      if (!(await exists(backup))) await writeFile(backup, before, 'utf8')
      await writeFile(file, text, 'utf8')
      fixed.push({ package: manifest.name, file, changed })
    }
  }
  return fixed
}

export function apply(ctx, config = {}) {
  const url = typeof config?.indexUrl === 'string' && config.indexUrl !== '' ? config.indexUrl : INDEX_URL
  const logger = ctx.logger?.('dsh-market-xivie') ?? ctx.logger
  const warn = (what) => (error) => logger?.warn?.(`dsh-market-xivie: ${what}: ${error?.message ?? String(error)}`)

  // 开机先自愈：装上插件那一刻就修，用户按提示重启时已经是对的，不用重启两次。
  const healOnce = () =>
    Promise.resolve()
      .then(() => healBundlePatches())
      .then((fixed) => {
        for (const item of fixed) {
          const what = item.changed.map((change) => `${change.from} → ${change.to}`).join(', ')
          logger?.warn?.(`dsh-market-xivie: ${item.package} 的挂载名写错了（${what}），已修好，重启后生效`)
        }
        return fixed
      })
      .catch(warn('检查插件挂载名失败'))

  void healOnce()

  // 装插件不必重启市场：装着的时候市场也在后台巡检，装完 30 秒内就修好。
  const timer = setInterval(() => void healOnce(), 30_000)
  ctx.on?.('dispose', () => clearInterval(timer))

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
      description: '检查插件挂载名并修好写错的（需要再重启一次生效）/ repair bundle mount names',
      handler: async () => {
        try {
          const fixed = await healBundlePatches()
          if (fixed.length === 0) return { kind: 'success', text: '所有插件的挂载名都正常，没东西要修。' }
          const lines = fixed.map((item) => `${item.package}: ${item.changed.map((change) => `${change.from} → ${change.to}`).join(', ')}`)
          return { kind: 'success', text: `修好了 ${fixed.length} 个插件，重启 DSH 生效：\n${lines.join('\n')}` }
        } catch (error) {
          return { kind: 'error', text: `检查失败：${error?.message ?? String(error)}` }
        }
      },
    })
  })
}
