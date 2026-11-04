#!/usr/bin/env node
/**
 * 把 plugin/styles.css 内联进 plugin/client.js 的 `const STYLES = \`...\``。
 *
 *   node scripts/inline-styles.mjs
 *
 * DSH 只加载 client.js 一个文件，所以样式必须以字符串形式内联；
 * 但样式本身写在外面的 .css 里更好维护（有语法高亮、可以被别的工具检查）。
 * 这个脚本就是把两边同步起来的那一步。
 */
import { readFile, writeFile } from 'node:fs/promises'
import { resolve } from 'node:path'

const root = resolve(import.meta.dirname, '..')
const cssPath = resolve(root, 'plugin', 'styles.css')
const clientPath = resolve(root, 'plugin', 'client.js')

const START = '    const STYLES = `'
const LEGACY = '    const STYLES_LEGACY = `'

const css = (await readFile(cssPath, 'utf8')).trimEnd()
// 统一成 LF、去掉可能的 BOM：Windows 上的 Set-Content 会写成 CRLF + BOM
const raw = await readFile(clientPath, 'utf8')
const source = raw.replace(/^\uFEFF/u, '').replace(/\r\n/gu, '\n')

const start = source.indexOf(START)
if (start === -1) throw new Error('client.js 里找不到 `const STYLES = ` 的起始位置')

// 从 STYLES 开始，一直吞到 STYLES_LEGACY 模板结束
let end
const legacy = source.indexOf(LEGACY, start)
if (legacy === -1) {
  const close = source.indexOf('\n`\n', start)
  if (close === -1) throw new Error('STYLES 模板没有闭合')
  end = close + 3
} else {
  const close = source.indexOf('\n`\n', legacy)
  if (close === -1) throw new Error('STYLES_LEGACY 模板没有闭合')
  end = close + 3
  // 顺带吃掉 legacy 上面那行注释（如果有）
  const comment = '    // 旧样式保留在这里只为对照，不参与渲染\n'
  const commentAt = source.lastIndexOf(comment, legacy)
  if (commentAt !== -1 && commentAt > start) end = Math.max(end, legacy)
}

if (css.includes('`')) throw new Error('styles.css 里不能出现反引号')

const replacement = `${START}\n${css}\n\`\n`
const next = source.slice(0, start) + replacement + source.slice(end)
await writeFile(clientPath, next, 'utf8')

process.stdout.write(`已内联 ${css.split('\n').length} 行 CSS 到 ${clientPath}\n`)
