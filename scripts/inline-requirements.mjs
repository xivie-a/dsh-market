#!/usr/bin/env node
/**
 * 把 requirements.json 内联进 plugin/client.js 的内置副本。
 *
 *   node scripts/inline-requirements.mjs
 *
 * 和 suites 同理：远端 fetch 可能被 CSP / 缓存挡住，内置一份兜底，
 * 远端可用时仍以远端为准（改数据不用重装插件）。
 */
import { readFile, writeFile } from 'node:fs/promises'
import { join, resolve } from 'node:path'

const root = resolve(import.meta.dirname, '..')
const clientPath = join(root, 'plugin', 'client.js')
const needsPath = join(root, 'requirements.json')

const START = '    // #region requirements-fallback'
const END = '    // #endregion requirements-fallback'

const doc = JSON.parse(await readFile(needsPath, 'utf8'))
const source = (await readFile(clientPath, 'utf8')).replace(/\r\n/gu, '\n')

const start = source.indexOf(START)
const end = source.indexOf(END, start)
if (start === -1 || end === -1) throw new Error('client.js 里找不到 requirements-fallback 标记')

const body = `    const REQUIREMENTS_FALLBACK = ${JSON.stringify(doc, null, 2)}\n`
const next = source.slice(0, start) + `${START}\n${body}` + source.slice(end)
await writeFile(clientPath, next, 'utf8')

const count = Object.keys(doc.items ?? {}).length
process.stdout.write(`已内联 ${String(count)} 条安装前提示到 ${clientPath}\n`)
