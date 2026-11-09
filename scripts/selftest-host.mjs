/**
 * 市场宿主半边的自检：不启动 DSH，用临时目录夹具验证两条保命逻辑。
 *   node scripts/selftest-host.mjs
 *
 *   1. guardBoot        上一次开机被某个插件拦住时，只把它从 bundles 里摘掉，别的一个不动
 *   2. healBundlePatches 只修能加载的包；加载不了的一个字都不改
 */

import { existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'

const host = await import(new URL('../plugin/index.js', import.meta.url).href)

let failed = 0
function check(label, condition, detail) {
  if (condition) {
    console.log(`  ok    ${label}`)
    return
  }
  failed++
  console.log(`  FAIL  ${label}${detail === undefined ? '' : ` — ${detail}`}`)
}

const work = mkdtempSync(join(tmpdir(), 'dsh-market-selftest-'))

// ---------- 1. guardBoot ----------
console.log('guardBoot')
process.env.APPDATA = join(work, 'appdata')
const logs = join(process.env.APPDATA, '@deepseek-ai', 'dsh-desktop', 'logs')
mkdirSync(logs, { recursive: true })
writeFileSync(
  join(logs, 'crash-2026-11-09T22-33-13-202Z-web-boot.log'),
  [
    'time: 2026-11-09T22:33:13.202Z',
    'source: web-boot',
    'phase: running',
    '',
    '--- error ---',
    'Error: web boot: 1 entry did not activate',
    '@a/broken: import failed (see console for the import error)',
  ].join('\n'),
  'utf8',
)
const profile = join(work, 'profile')
mkdirSync(join(profile, 'node_modules'), { recursive: true })
writeFileSync(
  join(profile, 'package.json'),
  `${JSON.stringify({ name: 'p', dsh: { profile: { bundles: ['@deepseek-ai/dsh-base', '@a/broken', 'dsh-fine'] } } }, null, 2)}\n`,
  'utf8',
)

const rows = await host.guardBoot(join(profile, 'node_modules'))
check('只点名了日志里那个包', rows.length === 1 && rows[0].package === '@a/broken', JSON.stringify(rows))
const after = JSON.parse(readFileSync(join(profile, 'package.json'), 'utf8'))
check(
  'bundles 里只摘掉了它',
  JSON.stringify(after.dsh.profile.bundles) === JSON.stringify(['@deepseek-ai/dsh-base', 'dsh-fine']),
  JSON.stringify(after.dsh.profile.bundles),
)
check('留了 package.json 备份', existsSync(join(profile, 'package.json.dsh-market.bak')))
const again = await host.guardBoot(join(profile, 'node_modules'))
check('同一条崩溃不会重复动手', again.length === 0, JSON.stringify(again))

// ---------- 2. healBundlePatches ----------
console.log('healBundlePatches')
const root = join(work, 'heal', 'node_modules')

function makePackage(dir, manifest, files) {
  mkdirSync(dir, { recursive: true })
  writeFileSync(join(dir, 'package.json'), `${JSON.stringify(manifest, null, 2)}\n`, 'utf8')
  for (const [name, text] of Object.entries(files)) writeFileSync(join(dir, name), text, 'utf8')
}

const fixedDir = join(root, '@a', 'fixed')
makePackage(
  fixedDir,
  { name: '@a/fixed', version: '1.0.0', main: 'index.js', dsh: { bundle: { patch: './cordis.patch.yml' } } },
  { 'index.js': 'module.exports = {}\n', 'cordis.patch.yml': '- insert:\n    - id: x\n      name: fixed\n' },
)

const brokenDir = join(root, '@a', 'broken')
makePackage(
  brokenDir,
  { name: '@a/broken', version: '1.0.0', main: 'index.js', dsh: { bundle: { patch: './cordis.patch.yml' } } },
  { 'index.js': 'throw new Error("boom")\n', 'cordis.patch.yml': '- insert:\n    - id: y\n      name: broken\n' },
)

const untouchedDir = join(root, 'not-in-allowlist')
makePackage(
  untouchedDir,
  { name: 'not-in-allowlist', version: '1.0.0', main: 'index.js', dsh: { bundle: { patch: './cordis.patch.yml' } } },
  { 'index.js': 'module.exports = {}\n', 'cordis.patch.yml': '- insert:\n    - id: z\n      name: not-in-allowlist\n' },
)

const healed = await host.healBundlePatches(root, {
  '@a/fixed': { mountName: '@a/fixed' },
  '@a/broken': { mountName: '@a/broken' },
})

check(
  '能加载的：名字改对了',
  readFileSync(join(fixedDir, 'cordis.patch.yml'), 'utf8').includes("name: '@a/fixed'"),
  readFileSync(join(fixedDir, 'cordis.patch.yml'), 'utf8'),
)
check('能加载的：留了 .orig 备份', existsSync(join(fixedDir, 'cordis.patch.yml.orig')))
check(
  '加载不了的：一个字没动',
  readFileSync(join(brokenDir, 'cordis.patch.yml'), 'utf8').includes('name: broken'),
  readFileSync(join(brokenDir, 'cordis.patch.yml'), 'utf8'),
)
check(
  '不在白名单的：没碰',
  readFileSync(join(untouchedDir, 'cordis.patch.yml'), 'utf8').includes('name: not-in-allowlist'),
)
check('加载不了的那个在报告里是 skipped', healed.some((row) => row.status === 'skipped'), JSON.stringify(healed))

// ---------- 3. 白名单为空 = 什么都不做 ----------
console.log('空白名单')
const noop = await host.healBundlePatches(root, {})
check('一个都没改', noop.length === 0)

rmSync(work, { recursive: true, force: true })
console.log(failed === 0 ? '\n全部通过' : `\n${failed} 项失败`)
process.exit(failed === 0 ? 0 : 1)
