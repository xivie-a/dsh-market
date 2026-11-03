/**
 * Host 半边：把市场的索引地址加进「发现」的索引源，并提供 /my-market 命令。
 *
 * 浏览器半边（client.js）负责界面；这里只做一件事——让用户装上插件后，
 * 不用再手动去「发现 → 添加索引源」。
 */

export const name = 'dsh-market-xivie'

export const INDEX_URL = 'https://xivie-a.github.io/dsh-market/index.json'

/** 把索引地址补进当前 profile 的索引源；已经存在就不动。 */
async function ensureIndex(market, url) {
  const current = market.listIndexes().map((source) => source.url)
  if (current.includes(url)) return 'present'
  await market.setIndexes([...current, url])
  return 'added'
}

export function apply(ctx, config = {}) {
  const url = typeof config?.indexUrl === 'string' && config.indexUrl !== '' ? config.indexUrl : INDEX_URL
  const logger = ctx.logger?.('dsh-market-xivie') ?? ctx.logger
  const warn = (what) => (error) => logger?.warn?.(`dsh-market-xivie: ${what}: ${error?.message ?? String(error)}`)

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
  })
}
