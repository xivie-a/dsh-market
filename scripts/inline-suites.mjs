#!/usr/bin/env node
/**
 * 把 suites.json 内联进 plugin/client.js 的内置副本。
 *
 *   node scripts/inline-suites.mjs
 *
 * 为什么要内置一份：套装原本只从远端 fetch。但 DSH 页面的 CSP 可能不允许
 * 跨域请求，fetch 一失败整块套装就消失了（而且用户看不到任何报错）。
 * 内置之后，远端失败就用这份兜底；远端成功仍然以远端为准，改数据不用重装插件。
 */
import { readFile, writeFile } from 'node:fs/promises'
import { join, resolve } from 'node:path'

const root = resolve(import.meta.dirname, '..')
const clientPath = join(root, 'plugin', 'client.js')
const suitesPath = join(root, 'suites.json')

const START = '    // #region suites-fallback'
const END = '    // #endregion suites-fallback'

const suites = JSON.parse(await readFile(suitesPath, 'utf8'))
const source = (await readFile(clientPath, 'utf8')).replace(/\r\n/gu, '\n')

const start = source.indexOf(START)
const end = source.indexOf(END, start)
if (start === -1 || end === -1) throw new Error('client.js 里找不到 suites-fallback 标记')

const body = `    const SUITES_FALLBACK = ${JSON.stringify(suites, null, 2)}\n`
const next = source.slice(0, start) + `${START}\n${body}` + source.slice(end)
await writeFile(clientPath, next, 'utf8')

const count = Array.isArray(suites.suites) ? suites.suites.length : 0
process.stdout.write(`已内联 ${String(count)} 个套装到 ${clientPath}\n`)
