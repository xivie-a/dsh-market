// 用一个假的 DSH ctx 把宿主插件挂一遍，确认四个路由真的注册上了、state 能返回。
import { registerNapcatRoutes } from '../plugin/index.js'

const routes = []
const ctx = {
  webServer: {
    register(route) { routes.push(route); return () => {} },
  },
  effect(fn) { fn() },
  logger: () => ({ info() {}, warn() {}, error() {} }),
}

registerNapcatRoutes(ctx)

const paths = routes.map((route) => `${route.kind} ${route.path}`)
console.log('注册的路由:', paths)
const expect = [
  'exact /dsh-market/napcat/state',
  'exact /dsh-market/napcat/prepare',
  'exact /dsh-market/napcat/launch',
]
for (const want of expect) {
  if (!paths.includes(want)) throw new Error(`少了路由: ${want}`)
}

const state = routes.find((route) => route.path === '/dsh-market/napcat/state')
const captured = { statusCode: 0, body: '' }
const res = {
  set statusCode(value) { captured.statusCode = value },
  get statusCode() { return captured.statusCode },
  setHeader() {},
  end(chunk) { captured.body += String(chunk ?? '') },
}
await state.handler({ method: 'GET', url: '/dsh-market/napcat/state', headers: {} }, res)
const body = JSON.parse(captured.body || '{}')
console.log('state:', JSON.stringify({
  ok: body.ok,
  qq: body.state?.qq?.version,
  qqSupported: body.state?.qq?.supported,
  napcat: body.state?.napcat?.present,
  online: body.online?.online,
  hasQr: Boolean(body.qr?.dataUrl),
}))
if (body.ok !== true) throw new Error('state 返回不 ok')
console.log('路由冒烟通过。')
