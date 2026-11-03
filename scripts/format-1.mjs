/**
 * DSH 插件市场索引 format 1 的校验器（轻量实现，零依赖）。
 *
 * 规则来源：DSH 0.2.1-rc.5 里的 @deepseek-ai/dsh-plugin-market-index
 * （packages/util/plugin-market-index）。这里是按同样规则重写的精简版：
 * 用来在发布前抓出 DSH 一定会拒绝的索引，避免「加进去只显示一排错误」。
 * 最终判定以 DSH 自己的解析器为准，遇到本文件放过但 DSH 拒收的情况，以 DSH 的
 * 报错路径为准。
 */

const PACKAGE_NAME = /^(?:@[a-z0-9][a-z0-9._~-]*\/)?[a-z0-9][a-z0-9._~-]*$/u
const PACKAGE_NAME_MAX_LENGTH = 214
const LANGUAGE_ID = /^[a-z]{2,8}(?:-[a-z0-9]{1,8})*$/u
const NUMERIC = '(?:0|[1-9]\\d*)'
const PRERELEASE_PART = `(?:${NUMERIC}|\\d*[a-zA-Z-][0-9a-zA-Z-]*)`
const SEMVER = new RegExp(
  `^${NUMERIC}\\.${NUMERIC}\\.${NUMERIC}(?:-${PRERELEASE_PART}(?:\\.${PRERELEASE_PART})*)?(?:\\+[0-9a-zA-Z-]+(?:\\.[0-9a-zA-Z-]+)*)?$`,
  'u',
)
const COMMIT = /^[0-9a-f]{40}$/u
const PATH_SEGMENT = /^[A-Za-z0-9._@+-]+$/u
const DATA_ICON = /^data:(?:image\/svg\+xml|image\/png|image\/jpeg|image\/webp);base64,([A-Za-z0-9+/]*={0,2})$/u
const BASE64 = /^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/u

/** 内联 data: 图标解码后的上限，超过即拒绝。 */
export const MAX_INLINE_ICON_BYTES = 32 * 1024
const MAX_PUBLISH_TIMESTAMP = 1e11

export class FormatError extends Error {
  /**
   * @param {string} path 违规值在 JSON 里的路径，例如 `$.plugins[0].versions[1].version`
   * @param {string} reason 违反的规则
   */
  constructor(path, reason) {
    super(`${path} ${reason}`)
    this.name = 'FormatError'
    this.path = path
    this.reason = reason
  }
}

const fail = (path, reason) => {
  throw new FormatError(path, reason)
}

const objectAt = (value, path) => {
  if (typeof value !== 'object' || value === null || Array.isArray(value)) fail(path, 'must be an object')
  return value
}

const stringAt = (value, path) => {
  if (typeof value !== 'string' || value.trim() === '') fail(path, 'must be a non-empty string')
  return value
}

const optional = (object, key, path, read) =>
  Object.hasOwn(object, key) ? read(object[key], `${path}.${key}`) : undefined

/**
 * LocalizedText：字符串，或以小写语言 id 为键的对象；对象必须含 en。
 */
const localizedText = (value, path) => {
  if (typeof value === 'string') return stringAt(value, path)
  const object = objectAt(value, path)
  const text = {}
  for (const [language, member] of Object.entries(object)) {
    if (!LANGUAGE_ID.test(language)) fail(`${path}.${language}`, 'must be keyed by a lowercase language id')
    text[language] = stringAt(member, `${path}.${language}`)
  }
  if (!Object.hasOwn(text, 'en')) fail(path, 'must contain en')
  return text
}

const declarations = (value, path, read) => {
  const result = {}
  for (const [id, member] of Object.entries(objectAt(value, path))) {
    if (id === '') fail(path, 'must not declare an empty id')
    result[id] = read(objectAt(member, `${path}.${id}`), `${path}.${id}`)
  }
  return result
}

const declaration = (object, path) => ({ title: localizedText(object.title, `${path}.title`) })

const sortKeyDeclaration = (object, path) => {
  if (object.order !== 'asc' && object.order !== 'desc') fail(`${path}.order`, 'must be "asc" or "desc"')
  return { title: localizedText(object.title, `${path}.title`), order: object.order }
}

const indexMetadata = (value, path) => {
  const object = value === undefined ? {} : objectAt(value, path)
  return {
    categories: optional(object, 'categories', path, (member, at) => declarations(member, at, declaration)) ?? {},
    labels: optional(object, 'labels', path, (member, at) => declarations(member, at, declaration)) ?? {},
    sortKeys: optional(object, 'sortKeys', path, (member, at) => declarations(member, at, sortKeyDeclaration)) ?? {},
  }
}

const declaredId = (value, path, declared) => {
  const id = stringAt(value, path)
  if (!Object.hasOwn(declared, id)) fail(path, `references undeclared id ${JSON.stringify(id)}`)
  return id
}

const pluginMetadata = (value, path, index) => {
  const object = value === undefined ? {} : objectAt(value, path)
  const category = optional(object, 'category', path, (member, at) => declaredId(member, at, index.categories))
  const keywords =
    optional(object, 'keywords', path, (member, at) => {
      if (!Array.isArray(member)) fail(at, 'must be an array')
      return member.map((keyword, position) => {
        if (typeof keyword !== 'string') fail(`${at}[${String(position)}]`, 'must be a string')
        return keyword
      })
    }) ?? []
  const labels =
    optional(object, 'labels', path, (member, at) => {
      if (!Array.isArray(member)) fail(at, 'must be an array')
      const ids = member.map((label, position) => declaredId(label, `${at}[${String(position)}]`, index.labels))
      if (new Set(ids).size !== ids.length) fail(at, 'must not repeat a label')
      return ids
    }) ?? []
  const sortKeys =
    optional(object, 'sortKeys', path, (member, at) => {
      const values = {}
      for (const [id, sortValue] of Object.entries(objectAt(member, at))) {
        declaredId(id, `${at}.${id}`, index.sortKeys)
        if (typeof sortValue !== 'number' || !Number.isFinite(sortValue)) fail(`${at}.${id}`, 'must be a finite number')
        values[id] = sortValue
      }
      return values
    }) ?? {}
  return { ...(category === undefined ? {} : { category }), keywords, labels, sortKeys }
}

const httpUrl = (value, path, protocols) => {
  const text = stringAt(value, path)
  let url
  try {
    url = new URL(text)
  } catch {
    fail(path, 'must be an absolute URL')
  }
  if (!protocols.includes(url.protocol)) fail(path, `must use ${protocols.join(' or ')}`)
  if (url.username !== '' || url.password !== '') fail(path, 'must not contain credentials')
  if (url.href.includes('?') || url.href.includes('#')) fail(path, 'must not contain a query or fragment')
  return url
}

const homepageUrl = (value, path) => {
  const text = stringAt(value, path)
  if (!URL.canParse(text)) fail(path, 'must be an absolute URL')
  const url = new URL(text)
  if (url.protocol !== 'https:' && url.protocol !== 'http:') fail(path, 'must use https: or http:')
  return url.href
}

const gitUrl = (value, path) => {
  const url = httpUrl(value, path, ['https:'])
  if (url.href !== value) fail(path, 'must be a canonical URL')
  if (!/^(?:\/[^/]+){2,}$/u.test(url.pathname)) fail(path, 'must name a repository with at least two path segments')
  if (/\.(?:tgz|tar\.gz)$/iu.test(url.pathname)) fail(path, 'must name a repository, not a tarball')
  return url.href
}

const packagePath = (value, path) => {
  const text = stringAt(value, path)
  if (text.split('/').some((segment) => segment === '.' || segment === '..' || !PATH_SEGMENT.test(segment)))
    fail(path, 'must be a relative directory without . or .. segments')
  return text
}

const repository = (object, path) => {
  const value = objectAt(object, path)
  const url = httpUrl(value.url, `${path}.url`, ['https:', 'http:']).href
  const directory = optional(value, 'directory', path, packagePath)
  return { url, ...(directory === undefined ? {} : { directory }) }
}

const source = (value, path) => {
  const object = objectAt(value, path)
  switch (object.type) {
    case 'npm': {
      const registry = optional(object, 'registry', path, (member, at) => httpUrl(member, at, ['https:', 'http:']).href)
      return { type: 'npm', ...(registry === undefined ? {} : { registry }) }
    }
    case 'git': {
      const commit = stringAt(object.commit, `${path}.commit`)
      if (!COMMIT.test(commit)) fail(`${path}.commit`, 'must be a lowercase 40-hex-digit commit SHA')
      const dir = optional(object, 'path', path, packagePath)
      return { type: 'git', url: gitUrl(object.url, `${path}.url`), commit, ...(dir === undefined ? {} : { path: dir }) }
    }
    default:
      return fail(`${path}.type`, 'must be "npm" or "git"')
  }
}

const engines = (value, path) => {
  const dsh = optional(objectAt(value, path), 'dsh', path, (member, at) => {
    const range = stringAt(member, at)
    if (range.startsWith('workspace:')) fail(at, 'must not be a workspace: range')
    // 轻量检查：DSH 用 semver.validRange 判定，这里只挡明显非范围的写法。
    if (!/^[0-9A-Za-z.\-<>=~^*|()\sxX]+$/u.test(range)) fail(at, 'must look like a SemVer range')
    return range
  })
  return dsh === undefined ? {} : { dsh }
}

const icon = (value, path, indexUrl) => {
  const text = stringAt(value, path)
  if (text.startsWith('data:')) {
    const payload = DATA_ICON.exec(text)?.[1]
    if (payload === undefined || payload === '' || !BASE64.test(payload))
      fail(path, 'must be a base64 SVG, PNG, JPEG, or WebP data URL')
    const padding = payload.endsWith('==') ? 2 : payload.endsWith('=') ? 1 : 0
    if ((payload.length / 4) * 3 - padding > MAX_INLINE_ICON_BYTES)
      fail(path, `must not exceed ${String(MAX_INLINE_ICON_BYTES / 1024)} KiB decoded`)
    return text
  }
  let resolved
  try {
    resolved = new URL(text, indexUrl)
  } catch {
    fail(path, 'must be a URL reference')
  }
  if (resolved.protocol !== 'https:' && resolved.origin !== new URL(indexUrl).origin)
    fail(path, 'must resolve to https or the index origin')
  return resolved.href
}

const marketVersion = (value, path) => {
  const object = objectAt(value, path)
  const version = stringAt(object.version, `${path}.version`)
  if (!SEMVER.test(version)) fail(`${path}.version`, 'must be an exact SemVer version')
  const publishTimestamp = object.publishTimestamp
  if (!Number.isInteger(publishTimestamp) || publishTimestamp < 0 || publishTimestamp >= MAX_PUBLISH_TIMESTAMP)
    fail(`${path}.publishTimestamp`, 'must be integer Unix seconds in [0, 10^11)')
  return {
    version,
    publishTimestamp,
    source: source(object.source, `${path}.source`),
    engines: optional(object, 'engines', path, engines) ?? {},
  }
}

const versions = (value, path) => {
  if (!Array.isArray(value) || value.length === 0) fail(path, 'must be a non-empty array')
  const seen = new Set()
  const parsed = value.map((member, position) => {
    const at = `${path}[${String(position)}]`
    const entry = marketVersion(member, at)
    if (seen.has(entry.version)) fail(`${at}.version`, `duplicates ${entry.version}`)
    seen.add(entry.version)
    return entry
  })
  return parsed.sort((left, right) => compareSemver(right.version, left.version))
}

const plugin = (value, path, index, indexUrl) => {
  const object = objectAt(value, path)
  const name = stringAt(object.name, `${path}.name`)
  if (name.length > PACKAGE_NAME_MAX_LENGTH || !PACKAGE_NAME.test(name)) fail(`${path}.name`, 'must be a valid npm package name')
  const title = optional(object, 'title', path, localizedText)
  const description = optional(object, 'description', path, localizedText)
  const iconUrl = optional(object, 'icon', path, (member, at) => icon(member, at, indexUrl))
  const author = optional(object, 'author', path, stringAt)
  const homepage = optional(object, 'homepage', path, homepageUrl)
  const repo = optional(object, 'repository', path, repository)
  return {
    name,
    ...(title === undefined ? {} : { title }),
    ...(description === undefined ? {} : { description }),
    ...(iconUrl === undefined ? {} : { icon: iconUrl }),
    ...(author === undefined ? {} : { author }),
    ...(homepage === undefined ? {} : { homepage }),
    ...(repo === undefined ? {} : { repository: repo }),
    metadata: pluginMetadata(object.metadata, `${path}.metadata`, index),
    versions: versions(object.versions, `${path}.versions`),
  }
}

/**
 * 校验一份已解析的 format 1 索引，返回归一化结果。
 * @param {unknown} value 解析后的 JSON
 * @param {string} indexUrl 该索引的绝对 URL（相对 icon 以它为基准解析）
 */
export function validateIndex(value, indexUrl) {
  if (!URL.canParse(indexUrl)) fail('$', `index URL ${JSON.stringify(indexUrl)} must be an absolute URL`)
  const base = new URL(indexUrl)
  const object = objectAt(value, '$')
  if (object.format !== 1) fail('$.format', 'must be 1')
  const metadata = indexMetadata(object.metadata, '$.metadata')
  if (!Array.isArray(object.plugins)) fail('$.plugins', 'must be an array')
  const names = new Set()
  const plugins = object.plugins.map((entry, position) => {
    const parsed = plugin(entry, `$.plugins[${String(position)}]`, metadata, base)
    if (names.has(parsed.name)) fail(`$.plugins[${String(position)}].name`, `duplicates ${parsed.name}`)
    names.add(parsed.name)
    return parsed
  })
  const title = localizedText(object.title, '$.title')
  const description = optional(object, 'description', '$', localizedText)
  return {
    format: 1,
    title,
    ...(description === undefined ? {} : { description }),
    metadata,
    plugins,
  }
}

/**
 * 按 SemVer 2.0.0 比较两个精确版本（含预发布标识）。
 * @returns {number} 负数、0 或正数
 */
export function compareSemver(left, right) {
  const parse = (text) => {
    const [core, rest] = splitOnce(text)
    const [major, minor, patch] = core.split('.').map((part) => Number.parseInt(part, 10))
    return { major, minor, patch, prerelease: rest === '' ? [] : rest.split('.') }
  }
  const a = parse(left)
  const b = parse(right)
  for (const key of ['major', 'minor', 'patch']) {
    if (a[key] !== b[key]) return a[key] - b[key]
  }
  if (a.prerelease.length === 0 && b.prerelease.length === 0) return 0
  if (a.prerelease.length === 0) return 1
  if (b.prerelease.length === 0) return -1
  for (let i = 0; i < Math.max(a.prerelease.length, b.prerelease.length); i += 1) {
    const leftPart = a.prerelease[i]
    const rightPart = b.prerelease[i]
    if (leftPart === undefined) return -1
    if (rightPart === undefined) return 1
    const leftNumber = /^\d+$/u.test(leftPart)
    const rightNumber = /^\d+$/u.test(rightPart)
    if (leftNumber && rightNumber) {
      const diff = Number(leftPart) - Number(rightPart)
      if (diff !== 0) return diff
      continue
    }
    if (leftNumber) return -1
    if (rightNumber) return 1
    if (leftPart !== rightPart) return leftPart < rightPart ? -1 : 1
  }
  return 0
}

/** 拆出 build 元数据之前的版本主体与 prerelease 部分。 */
function splitOnce(text) {
  const withoutBuild = text.split('+')[0]
  const dash = withoutBuild.indexOf('-')
  return dash === -1 ? [withoutBuild, ''] : [withoutBuild.slice(0, dash), withoutBuild.slice(dash + 1)]
}

/** 是否是格式要求的精确 SemVer 版本。 */
export const isExactSemver = (text) => typeof text === 'string' && SEMVER.test(text)
