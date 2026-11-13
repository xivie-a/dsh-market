#!/usr/bin/env node
/**
 * 一条命令把插件同步到 DSH 正在加载的那份副本。
 *
 *   node scripts/deploy-local.mjs
 *
 * 做三件事：
 *   1. 把 plugin/styles.css 内联进 plugin/client.js
 *   2. 复制到 %USERPROFILE%\.dsh\profiles\desktop\node_modules\<包名>\
 *   3. 逐文件校验哈希，全部一致才说成功
 *
 * 为什么要这个脚本：DSH 只加载安装目录里的副本，不是仓库里的源码。
 * 改完忘了复制、或者复制了忘重启，都会出现「明明改了却没生效」。
 *
 * 选项：
 *   --target <dir>  指定安装目录（默认按 profile 推断）
 *   --no-inline     跳过 CSS 内联（只想同步时）
 *   --dry-run       只打印将要做什么，不写文件
 */
import { execFileSync } from 'node:child_process'
import { createHash } from 'node:crypto'
import { copyFile, readFile, stat } from 'node:fs/promises'
import { homedir } from 'node:os'
import { join, resolve } from 'node:path'

const root = resolve(import.meta.dirname, '..')
const pluginDir = join(root, 'plugin')

function parseArgs(argv) {
  const options = { inline: true, dryRun: false }
  for (let i = 0; i < argv.length; i += 1) {
    const flag = argv[i]
    if (flag === '--target') { options.target = argv[i + 1]; i += 1 }
    else if (flag === '--no-inline') options.inline = false
    else if (flag === '--dry-run') options.dryRun = true
    else if (flag === '-h' || flag === '--help') options.help = true
  }
  return options
}

const sha = (buffer) => createHash('sha256').update(buffer).digest('hex')

async function main() {
  const options = parseArgs(process.argv.slice(2))
  if (options.help) {
    process.stdout.write('用法: node scripts/deploy-local.mjs [--target <dir>] [--no-inline] [--dry-run]\n')
    return
  }

  const manifest = JSON.parse(await readFile(join(pluginDir, 'package.json'), 'utf8'))
  const target = resolve(options.target ?? join(
    homedir(), '.dsh', 'profiles', 'desktop', 'node_modules', manifest.name
  ))

  // 1. 内联样式
  if (options.inline && !options.dryRun) {
    execFileSync(process.execPath, [join(root, 'scripts', 'inline-styles.mjs')], { stdio: 'inherit' })
    execFileSync(process.execPath, [join(root, 'scripts', 'inline-suites.mjs')], { stdio: 'inherit' })
  }

  // 2. 只同步运行时会用到的文件（styles.css 已内联，不必复制）
  const files = ['client.js', 'index.js', 'napcat.js', 'package.json', 'cordis.patch.yml', 'README.md']
  let copied = 0
  let same = 0
  const mismatched = []

  try {
    await stat(target)
  } catch {
    throw new Error(`安装目录不存在：${target}\n先按 plugin/README.md 用「添加插件 → 本地目录」装一次，或加 --target 指定路径`)
  }

  for (const name of files) {
    const from = join(pluginDir, name)
    const to = join(target, name)
    let source
    try {
      source = await readFile(from)
    } catch {
      continue // 仓库里没有这个文件就跳过
    }
    let current
    try {
      current = await readFile(to)
    } catch {
      current = undefined
    }
    if (current !== undefined && sha(current) === sha(source)) {
      same += 1
      process.stdout.write(`= ${name}（已一致）\n`)
      continue
    }
    if (!options.dryRun) await copyFile(from, to)
    copied += 1
    process.stdout.write(`+ ${name}\n`)
  }

  if (options.dryRun) {
    process.stdout.write(`\n[dry-run] 将复制 ${String(copied)} 个文件到 ${target}\n`)
    return
  }

  // 3. 校验
  for (const name of files) {
    let source
    try {
      source = await readFile(join(pluginDir, name))
    } catch {
      continue
    }
    try {
      const copy = await readFile(join(target, name))
      if (sha(copy) !== sha(source)) mismatched.push(name)
    } catch {
      mismatched.push(name)
    }
  }

  if (mismatched.length > 0) {
    throw new Error(`这些文件复制后不一致：${mismatched.join(', ')}`)
  }

  process.stdout.write(`\n目标：${target}\n复制 ${String(copied)} 个，已一致 ${String(same)} 个，校验通过\n`)
  process.stdout.write('下一步：重启 DSH（客户端代码只在启动时加载）\n')
}

main().catch((error) => {
  process.stderr.write(`\n${error instanceof Error ? error.message : String(error)}\n`)
  process.exitCode = 1
})
