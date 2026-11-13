/**
 * napcat.js 的离线自测：不装任何东西、不碰真实配置。
 * 只用临时目录 + 本机的探测结果做断言。
 *
 *   node scripts/selftest-napcat.mjs
 */

import assert from 'node:assert/strict'
import { mkdtemp, readFile, rm, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'

import {
  LAUNCHER,
  detect,
  upsertOnebotPatch,
  writeLauncher,
  writeOnebotConfig,
  writeQqnt,
} from '../plugin/napcat.js'

const rows = []
function check(name, fn) {
  return Promise.resolve()
    .then(fn)
    .then(() => rows.push(`ok   ${name}`))
    .catch((error) => {
      rows.push(`FAIL ${name}: ${error?.message ?? error}`)
      process.exitCode = 1
    })
}

const temp = await mkdtemp(join(tmpdir(), 'dsh-napcat-selftest-'))

await check('探测：本机 QQ 能被找到并且版本受支持', async () => {
  const state = await detect()
  assert.equal(state.qq.ok, true, '没找到 QQ 安装目录')
  assert.equal(typeof state.qq.version, 'string')
  assert.match(state.qq.version, /^9\.9\.\d+-\d+$/)
  assert.equal(state.qq.supported, true, `QQ ${state.qq.version} 超出 NapCat 支持范围`)
  assert.equal(state.napcat.dir.length > 0, true)
})

await check('探测：不存在的 NapCat 目录被判为未安装', async () => {
  const state = await detect({ napcatDir: join(temp, 'nope') })
  assert.equal(state.napcat.present, false)
})

await check('qqnt.json：版本与 buildVersion 按实际 QQ 对齐', async () => {
  const result = await writeQqnt(temp, '9.9.36-53644')
  assert.equal(result.status, 'written')
  const parsed = JSON.parse(await readFile(join(temp, 'qqnt.json'), 'utf8'))
  assert.equal(parsed.version, '9.9.36-53644')
  assert.equal(parsed.buildVersion, '53644')
  assert.equal(parsed.main, './loadNapCat.js')
})

await check('qqnt.json：重复写不重复落盘', async () => {
  const before = await readFile(join(temp, 'qqnt.json'), 'utf8')
  const result = await writeQqnt(temp, '9.9.36-53644')
  assert.equal(result.status, 'present')
  assert.equal(await readFile(join(temp, 'qqnt.json'), 'utf8'), before)
})

await check('启动脚本：纯 ASCII，且带单进程开关', async () => {
  const result = await writeLauncher(temp)
  assert.equal(result.status, 'written')
  const text = await readFile(join(temp, LAUNCHER), 'utf8')
  assert.equal(/[^\x00-\x7F]/.test(text), false, '批处理里不能有非 ASCII 字符')
  assert.match(text, /NAPCAT_DISABLE_MULTI_PROCESS=1/)
  assert.match(text, /launcher\.bat/)
})

await check('OneBot 配置：HTTP 3000 + 反向 WS 8643 + token', async () => {
  await writeOnebotConfig(temp, '3290424794', { token: 'tok-1' })
  const parsed = JSON.parse(await readFile(join(temp, 'config', 'onebot11_3290424794.json'), 'utf8'))
  assert.equal(parsed.network.httpServers[0].port, 3000)
  assert.equal(parsed.network.httpServers[0].enable, true)
  assert.equal(parsed.network.websocketClients[0].url, 'ws://127.0.0.1:8643')
  assert.equal(parsed.network.websocketClients[0].token, 'tok-1')
})

await check('OneBot 配置：再来一次不新增重复条目', async () => {
  await writeOnebotConfig(temp, '3290424794', { token: 'tok-2' })
  const parsed = JSON.parse(await readFile(join(temp, 'config', 'onebot11_3290424794.json'), 'utf8'))
  assert.equal(parsed.network.httpServers.length, 1)
  assert.equal(parsed.network.websocketClients.length, 1)
  assert.equal(parsed.network.websocketClients[0].token, 'tok-2')
})

await check('cordis.patch.yml：追加 dsh-onebot 段', async () => {
  const before = '- id: ui-chat\n  config:\n    transcriptView: standard\n'
  const after = upsertOnebotPatch(before, { token: 'tok', botQQ: '1', adminUsers: ['2'] })
  assert.match(after, /- id: ui-chat/)
  assert.match(after, /- id: dsh-onebot/)
  assert.match(after, /accessToken: "tok"/)
  assert.match(after, /botQQ: "1"/)
  assert.match(after, /- "2"/)
  assert.equal(after.match(/- id: dsh-onebot/g).length, 1)
})

await check('cordis.patch.yml：已有段落被整体替换而不是叠一层', async () => {
  const before = [
    '- id: ui-chat',
    '  config:',
    '    transcriptView: standard',
    '- id: dsh-onebot',
    '  config:',
    '    accessToken: "old"',
    '    botQQ: "9"',
    '- id: agent-default-model',
    '  config:',
    '    provider: deepseek-official',
    '',
  ].join('\n')
  const after = upsertOnebotPatch(before, { token: 'new', botQQ: '1', adminUsers: ['2'] })
  assert.equal(after.match(/- id: dsh-onebot/g).length, 1)
  assert.match(after, /accessToken: "new"/)
  assert.equal(after.includes('accessToken: "old"'), false)
  assert.match(after, /- id: agent-default-model/)
  // 别的段落不能被吃掉
  assert.match(after, /provider: deepseek-official/)
})

await check('cordis.patch.yml：空文件也能写出合法数组', async () => {
  const after = upsertOnebotPatch('', { token: 'tok', botQQ: '1', adminUsers: [] })
  assert.equal(after.startsWith('- id: dsh-onebot'), true)
  // adminUsers 为空时必须写成 []，否则 YAML 里会变成 null，插件读配置直接炸
  assert.match(after, /adminUsers: \[\]/)
})

await check('「装完顺便接通」的标记：写入 / 读回 / 清掉', async () => {
  const profileRoot = await mkdtemp(join(tmpdir(), 'dsh-profile-'))
  const { writePendingSetup, readPendingSetup, readPendingResult, clearPendingSetup } = await import('../plugin/index.js')
  const file = await writePendingSetup(profileRoot, { botQQ: '10001', adminUser: '10002', napcatDir: 'D:\\NapCat' })
  assert.match(file, /pending-setup\.json$/u)
  const back = await readPendingSetup(profileRoot)
  assert.equal(back.botQQ, '10001')
  assert.equal(back.adminUser, '10002')
  assert.equal(back.napcatDir, 'D:\\NapCat')
  assert.equal(await readPendingResult(profileRoot), undefined)
  await clearPendingSetup(profileRoot)
  assert.equal(await readPendingSetup(profileRoot), undefined)
  await rm(profileRoot, { recursive: true, force: true })
})

await check('prepare 演练：用临时 profile 跑一遍，不下载、不拉起', async () => {
  const { existsSync } = await import('node:fs')
  const napcatDir = 'D:\\NapCat'
  if (!existsSync(napcatDir)) {
    rows.push('skip prepare 演练：本机没有 D:\\NapCat')
    return
  }
  const profileRoot = await mkdtemp(join(tmpdir(), 'dsh-profile-'))
  const { prepareNapcat } = await import('../plugin/index.js')
  const result = await prepareNapcat({
    profileRoot,
    napcatDir,
    adminUser: '1503535905',
    botQQ: '3290424794',
    launch: false,
  })
  assert.equal(result.ok, true)
  assert.equal(result.steps.some((row) => row.status === 'fail'), false)
  const patch = await readFile(join(profileRoot, 'cordis.patch.yml'), 'utf8')
  assert.match(patch, /- id: dsh-onebot/)
  assert.match(patch, /accessToken: "dsh-local-8643"/)
  assert.match(patch, /- "1503535905"/)
  // 第二次跑必须全部命中「已经有」，也就是说这个流程是幂等的
  const again = await prepareNapcat({
    profileRoot,
    napcatDir,
    adminUser: '1503535905',
    botQQ: '3290424794',
    launch: false,
  })
  assert.equal(again.steps.some((row) => String(row.text).includes('正在下载')), false)
  await rm(profileRoot, { recursive: true, force: true })
})

await rm(temp, { recursive: true, force: true })

console.log(rows.join('\n'))
if (process.exitCode === 1) {
  console.log('\n有用例没过。')
} else {
  console.log(`\n${rows.length} 项全过。`)
}
