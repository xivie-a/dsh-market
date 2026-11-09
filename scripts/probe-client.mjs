/**
 * 影子测试：把第三方插件的 client.js 拖进假 DSH 环境，看 apply() 到底炸不炸。
 *
 *   node scripts/probe-client.mjs <client.js 路径>
 *
 * 输出：apply 是否抛错、注册了哪些 slot。
 */
import { readFileSync, writeFileSync } from 'node:fs'

const file = process.argv[2]
if (file === undefined) {
  console.error('usage: node scripts/probe-client.mjs <client.js>')
  process.exit(1)
}

const source = readFileSync(file, 'utf8')

const page = `<!doctype html><meta charset="utf-8"><body><div id="root"></div>
<script src="./vendor/react.js"></script>
<script src="./vendor/react-dom.js"></script>
<script>
window.__PROBE__ = { slots: [], errors: [] }
window.addEventListener('error', (event) => window.__PROBE__.errors.push(String(event.message)))
window.__ModuleLoader__ = {
  load({ id, factory }) {
    try {
      const module = factory((name) => {
        if (name === 'react') return window.React
        if (name === 'react-dom') return window.ReactDOM
        if (name === 'react/jsx-runtime') {
          const jsx = (type, props) => window.React.createElement(type, props)
          return { jsx, jsxs: jsx, Fragment: window.React.Fragment }
        }
        throw new Error('unknown require: ' + name)
      })
      window.__PROBE__.exports = module
      const ctx = {
        effect(run) { try { return run() } catch (error) { window.__PROBE__.errors.push('effect: ' + String(error)) } },
        inject(_names, run) { try { return run({}) } catch (error) { window.__PROBE__.errors.push('inject: ' + String(error)) } },
        slots: {
          inject(name, run) {
            window.__PROBE__.slots.push(name)
            try { return run() } catch (error) { window.__PROBE__.errors.push('slot ' + name + ': ' + String(error)) }
          },
          register(options) { window.__PROBE__.slots.push('register:' + options.name + ':' + (options.id ?? '')); return () => {} }
        },
        locale: { define() {}, get() { return (key) => key } },
        remote: {}, logger: { info() {}, warn() {}, error() {} }
      }
      if (typeof module.apply === 'function') module.apply(ctx)
      window.__PROBE__.ok = true
    } catch (error) {
      window.__PROBE__.errors.push('load: ' + String(error && error.stack || error))
    }
  }
}
<\/script>
<script src="${new URL(`file:///${file.replace(/\\/g, '/')}`).pathname}"></script>
`
const out = 'preview/probe.html'
writeFileSync(out, page)
console.log(`写出 ${out}`)
