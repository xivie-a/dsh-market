/**
 * 用 CDP 截图：比 `msedge --screenshot` 稳，等页面真的稳定下来再拍。
 *
 *   node scripts/shot.mjs <url> <out.png> [width] [height] [waitMs] [evalJs]
 *
 * `evalJs` 会在截图前在页面里执行，结果打到 stdout，方便顺手取证。
 */
import { spawn } from 'node:child_process'
import { writeFileSync } from 'node:fs'
import { setTimeout as sleep } from 'node:timers/promises'

const [url, out, width = '1440', height = '1150', waitMs = '1600', evalJs] = process.argv.slice(2)
if (url === undefined || out === undefined) {
  console.error('usage: node scripts/shot.mjs <url> <out.png> [w] [h] [waitMs] [evalJs]')
  process.exit(1)
}

const port = 9300 + Math.floor(Math.random() * 400)
const profile = `${process.env.TEMP}\\cdp-${Math.random().toString(36).slice(2, 8)}`
const edge = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe'

const child = spawn(edge, [
  '--headless=new',
  '--disable-gpu',
  '--hide-scrollbars',
  '--no-first-run',
  '--no-default-browser-check',
  `--remote-debugging-port=${port}`,
  `--user-data-dir=${profile}`,
  `--window-size=${width},${height}`,
  'about:blank'
], { stdio: 'ignore' })

/** 等调试端口起来 */
async function endpoint() {
  for (let index = 0; index < 60; index += 1) {
    try {
      const response = await fetch(`http://127.0.0.1:${port}/json/version`)
      if (response.ok) {
        const doc = await response.json()
        return doc.webSocketDebuggerUrl
      }
    } catch {
      // 还没起来
    }
    await sleep(200)
  }
  throw new Error('devtools endpoint never came up')
}

const browserUrl = await endpoint()
const socket = new WebSocket(browserUrl)
await new Promise((resolve, reject) => {
  socket.addEventListener('open', resolve, { once: true })
  socket.addEventListener('error', reject, { once: true })
})

let nextId = 0
const pending = new Map()
const logs = []

socket.addEventListener('message', (event) => {
  const message = JSON.parse(event.data)
  if (message.id !== undefined) {
    const waiter = pending.get(message.id)
    pending.delete(message.id)
    if (waiter !== undefined) waiter(message)
    return
  }
  if (message.method === 'Runtime.consoleAPICalled') {
    const text = (message.params.args ?? []).map((arg) => arg.value ?? arg.description ?? '').join(' ')
    logs.push(`${message.params.type}: ${text}`)
  }
  if (message.method === 'Runtime.exceptionThrown') {
    const detail = message.params.exceptionDetails
    logs.push(`exception: ${detail.exception?.description ?? detail.text}`)
  }
})

function send(method, params = {}, sessionId) {
  const id = (nextId += 1)
  socket.send(JSON.stringify({ id, method, params, sessionId }))
  return new Promise((resolve) => pending.set(id, resolve))
}

const target = await send('Target.createTarget', { url: 'about:blank' })
const targetId = target.result.targetId
const attached = await send('Target.attachToTarget', { targetId, flatten: true })
const session = attached.result.sessionId

await send('Runtime.enable', {}, session)
await send('Page.enable', {}, session)
await send('Emulation.setDeviceMetricsOverride', {
  width: Number(width),
  height: Number(height),
  deviceScaleFactor: 1,
  mobile: false
}, session)

await send('Page.navigate', { url }, session)
await sleep(Number(waitMs))

if (evalJs !== undefined) {
  const evaluated = await send('Runtime.evaluate', {
    expression: evalJs,
    awaitPromise: true,
    returnByValue: true
  }, session)
  console.log(JSON.stringify(evaluated.result?.result?.value ?? evaluated.result, null, 2))
}

const shot = await send('Page.captureScreenshot', { format: 'png', captureBeyondViewport: false }, session)
writeFileSync(out, Buffer.from(shot.result.data, 'base64'))
console.log(`写出 ${out}`)

for (const line of logs.slice(-12)) console.log(line)

socket.close()
child.kill()
process.exit(0)
