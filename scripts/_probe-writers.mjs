import { mkdtempSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import * as napcat from '../plugin/napcat.js'

const dir = mkdtempSync(join(tmpdir(), 'napcat-probe-'))
console.log('dir=', dir)
const tests = [
  ['writeQqnt', () => napcat.writeQqnt(dir, '9.9.36-53644')],
  ['writeLauncher', () => napcat.writeLauncher(dir)],
  ['writeOnebotConfig', () => napcat.writeOnebotConfig(dir, '1503535905', { token: 'dsh-local-8643' })],
  ['writeKeeperConfig', () => napcat.writeKeeperConfig({ dir, token: 'dsh-local-8643' })],
  ['resolveNapcatDir', () => napcat.resolveNapcatDir(dir)],
  ['writeDshOnebot', () => napcat.writeDshOnebot('C:\\Users\\Administrator\\.dsh\\profiles\\desktop', { token: 'dsh-local-8643', botQQ: '1503535905', adminUsers: ['1503535905'] })],
]
for (const [name, run] of tests) {
  try { const r = await run(); console.log('ok  ', name, JSON.stringify(r).slice(0, 160)) }
  catch (error) { console.log('FAIL', name, '::', error?.message); console.log((error?.stack ?? '').split('\n').slice(1, 4).join('\n')) }
}
