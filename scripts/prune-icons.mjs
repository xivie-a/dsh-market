#!/usr/bin/env node
/**
 * 清掉 icons/ 里不再被引用的文件。
 *
 *   node scripts/prune-icons.mjs [--dry-run]
 *
 * 只用 scripts/npm-meta.json 里记录的文件名作为「保留名单」——那份名单来自
 * 直接从 npm 包 tarball 解出来的图标，所以跑完这个脚本，仓库里剩下的图标
 * 就全部是「从包本身取的」，没有转手来源。
 */
import { readdir, readFile, unlink } from 'node:fs/promises'
import { join, resolve } from 'node:path'

const root = resolve(import.meta.dirname, '..')
const iconsDir = join(root, 'icons')
const dryRun = process.argv.includes('--dry-run')

const meta = JSON.parse(await readFile(join(root, 'scripts', 'npm-meta.json'), 'utf8'))
const keep = new Set(
  Object.values(meta)
    .map((item) => item.iconFile)
    .filter((file) => typeof file === 'string')
    .map((file) => file.replace(/^icons[/\\]/u, '')),
)

const files = await readdir(iconsDir)
let removed = 0
for (const file of files) {
  if (keep.has(file)) continue
  if (!dryRun) await unlink(join(iconsDir, file))
  removed += 1
  process.stdout.write(`${dryRun ? 'would remove' : '-'} ${file}\n`)
}

process.stdout.write(`\n保留 ${String(keep.size)} 个，${dryRun ? '将删除' : '已删除'} ${String(removed)} 个\n`)
