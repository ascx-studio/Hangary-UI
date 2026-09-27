import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { isBuiltin } from 'node:module'
import ts from 'typescript'
import { registrySchema } from 'shadcn/schema'

const supported = /\.(tsx?|jsx?|css|svg)$/
const compare = (a, b) => a < b ? -1 : a > b ? 1 : 0
const packageName = (specifier) => specifier.startsWith('@')
  ? specifier.split('/').slice(0, 2).join('/') : specifier.split('/')[0]
const registrySourceRoot = (root) => fs.existsSync(path.join(root, 'registry/nova-blue')) ? 'registry/nova-blue/' : 'registry/'

export function generateRegistry(root) {
  const sourceRoot = registrySourceRoot(root)
  const readJson = (file) => JSON.parse(fs.readFileSync(path.join(root, file), 'utf8'))
  const previous = readJson('registry.json')
  const manifest = readJson('package.json')
  const versions = new Map()
  for (const item of previous.items) {
    for (const dependency of item.dependencies ?? []) {
      versions.set(dependency.replace(/@[^@/]+$/, ''), dependency)
    }
  }
  for (const [name, version] of Object.entries({ ...manifest.devDependencies, ...manifest.dependencies })) {
    versions.set(name, `${name}@${version}`)
  }
  const sources = fs.readdirSync(path.join(root, sourceRoot), { recursive: true })
    .map(file => sourceRoot + file.replaceAll(path.sep, '/'))
    .filter(file => supported.test(file) && fs.statSync(path.join(root, file)).isFile())
    .sort(compare)
  const sourceSet = new Set(sources)
  const existing = new Map()
  const unrelated = []
  for (const item of previous.items) {
    const entry = item.files?.[0]?.path
    if (!entry?.startsWith(sourceRoot)) { unrelated.push(item); continue }
    // The first published name stays canonical when several items share a source.
    if (sourceSet.has(entry) && !existing.has(entry)) existing.set(entry, item)
  }
  const graph = new Map()
  function resolveLocal(file, specifier) {
    const base = path.posix.normalize(path.posix.join(path.posix.dirname(file), specifier))
    const resolved = [base, ...['.ts', '.tsx', '.js', '.jsx', '.css', '.svg', '/index.ts', '/index.tsx', '/index.js', '/index.jsx'].map(ext => base + ext)]
      .find(candidate => sourceSet.has(candidate))
    if (!resolved) throw new Error(`Unresolved local import: ${file} -> ${specifier}`)
    return resolved
  }
  for (const file of sources) {
    const code = fs.readFileSync(path.join(root, file), 'utf8')
    const info = { local: new Set(), packages: new Set(), assets: new Set() }
    function addImport(specifier) {
      if (specifier.startsWith('.')) info.local.add(resolveLocal(file, specifier))
      else if (specifier.startsWith('@/') || specifier.startsWith('/')) throw new Error(`Non-portable import: ${file} -> ${specifier}`)
      else if (!isBuiltin(specifier) && !['react', 'react-dom', 'next'].includes(packageName(specifier))) info.packages.add(packageName(specifier))
    }
    if (/\.[jt]sx?$/.test(file)) {
      const source = ts.createSourceFile(file, code, ts.ScriptTarget.Latest, true)
      if (source.parseDiagnostics.length) throw new Error(`Invalid syntax: ${file}`)
      function visit(node) {
        let specifier
        if ((ts.isImportDeclaration(node) || ts.isExportDeclaration(node)) && node.moduleSpecifier) specifier = node.moduleSpecifier
        if (ts.isCallExpression(node) && (node.expression.kind === ts.SyntaxKind.ImportKeyword || (ts.isIdentifier(node.expression) && node.expression.text === 'require'))) specifier = node.arguments[0]
        if (ts.isImportTypeNode(node) && ts.isLiteralTypeNode(node.argument)) specifier = node.argument.literal
        if (specifier && ts.isStringLiteralLike(specifier)) addImport(specifier.text)
        if (ts.isStringLiteralLike(node) && node.text.startsWith('/') && !node.text.startsWith('//')) {
          const asset = path.posix.normalize(`public${node.text}`)
          if (asset.startsWith('public/') && fs.existsSync(path.join(root, asset)) && fs.statSync(path.join(root, asset)).isFile()) info.assets.add(asset)
        }
        ts.forEachChild(node, visit)
      }
      visit(source)
    } else if (file.endsWith('.css')) {
      for (const match of code.matchAll(/@import\s+["']([^"']+)["']/g)) addImport(match[1])
    }
    graph.set(file, info)
  }
  const fileType = (file) => {
    const relative = file.slice(sourceRoot.length)
    if (/\.(css|svg)$/.test(file)) return 'registry:file'
    if (relative.startsWith('ui/')) return 'registry:ui'
    if (relative.startsWith('lib/')) return 'registry:lib'
    if (relative.startsWith('hooks/')) return 'registry:hook'
    return 'registry:component'
  }
  const usedNames = new Set([...unrelated, ...existing.values()].map(item => item.name))
  const items = sources.map(entry => {
    const old = existing.get(entry)
    const relative = entry.slice(sourceRoot.length)
    const folder = relative.split('/')[0]
    const category = folder === 'templates' ? 'templates' : folder === 'blocks' ? 'blocks' : ['backgrounds', 'shader'].includes(folder) ? 'shader' : ['lib', 'hooks', 'styles'].includes(folder) ? 'utils' : 'components'
    let name = old?.name
    if (!name) {
      const shortBlockName = /^blocks\/(?:auth\d+|navbar[1-4]|footer[1-4])\.tsx$/.test(relative)
      name = shortBlockName
        ? relative.replace(/\.[^.]+$/, '').split('/').at(-1)
        : `${sourceRoot.includes('nova-blue') ? 'nova-blue' : 'lazy'}-${relative.replace(/\.[^.]+$/, '').replaceAll('/', '-')}`
      if (usedNames.has(name)) throw new Error(`Registry name collision: ${name}`)
      usedNames.add(name)
    }
    const bundled = new Set()
    const dependencies = new Set()
    const assets = new Set()
    function include(file) {
      if (bundled.has(file)) return
      bundled.add(file)
      const info = graph.get(file)
      for (const dep of info.packages) dependencies.add(versions.get(dep) ?? dep)
      for (const asset of info.assets) assets.add(asset)
      for (const local of info.local) include(local)
    }
    include(entry)
    // Portfolio theme utilities are used via class names, not JS imports.
    const stylesheet = `${sourceRoot}styles/portfolio.css`
    if (['components', 'blocks', 'shader'].includes(category) && sourceSet.has(stylesheet)) include(stylesheet)
    const files = [entry, ...[...bundled].filter(file => file !== entry).sort(compare)].map(file => ({
      path: file, type: fileType(file), target: `@components/lazy-ui/${file.slice(sourceRoot.length)}`,
    }))
    for (const asset of [...assets].sort(compare)) files.push({ path: asset, type: 'registry:file', target: asset })
    return {
      ...old,
      name,
      type: ['blocks', 'templates'].includes(category) ? 'registry:block' : fileType(entry),
      title: old?.title ?? path.posix.basename(entry).replace(/\.[^.]+$/, '').split('-').map(word => word[0].toUpperCase() + word.slice(1)).join(' '),
      description: old?.description ?? `Reusable ${path.posix.basename(entry)} from the Lazy UI collection.`,
      files,
      dependencies: [...dependencies].sort(compare),
      ...(old?.registryDependencies ? { registryDependencies: old.registryDependencies } : /^(?:auth\d+|navbar[1-4]|footer[1-4])$/.test(name) ? { registryDependencies: ['morph-css'] } : {}),
      meta: { ...old?.meta, category },
    }
  })
  const result = { ...previous, items: [...unrelated, ...items].sort((a, b) => compare(a.name, b.name)) }
  registrySchema.parse(result)
  return result
}

const markdownText = (value) => String(value)
  .replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;')
  .replaceAll('{', '&#123;').replaceAll('}', '&#125;')

// Return planned writes so --check can report drift without creating files.
export function planDocumentation(root, registry) {
  const sourceRoot = registrySourceRoot(root)
  const docsDirectory = 'docs'
  const writes = new Map()
  const loaders = []
  const docPaths = new Set()
  for (const item of registry.items) {
    if (!item.files?.[0]?.path.startsWith(sourceRoot)) continue
    const category = item.meta?.category
    if (!['components', 'blocks', 'shader', 'utils', 'templates'].includes(category)) throw new Error(`Unsupported documentation category: ${category}`)
    if (!/^[a-zA-Z0-9_-]+$/.test(item.name)) throw new Error(`Invalid documentation filename: ${item.name}`)
    let basename = item.name.replace(/^portfolio-/, '')
    if (basename !== item.name && registry.items.some(other => other.name === basename && other.meta?.category === category)) {
      basename = item.files[0].path.replace(/^registry\/(?:nova-blue\/)?/, '').replace(/\.[^.]+$/, '').replaceAll('/', '-')
    }
    const relative = `${docsDirectory}/${category}/${basename}.mdx`
    if (docPaths.has(relative)) throw new Error(`Documentation filename collision: ${relative}`)
    docPaths.add(relative)
    if (!fs.existsSync(path.join(root, relative))) {
      const entry = item.files[0]
      const installedPath = entry.target?.replace(/^@components\//, '@/components/') ?? entry.path
      const command = `npx shadcn@latest add ${registry.homepage.replace(/\/$/, '')}/r/${item.name}.json`
      const notes = item.docs ?? 'Install the entry and its dependencies, then adapt the content and styles to your application.'
      writes.set(relative, [
        '## Overview', '', markdownText(item.description ?? item.title ?? item.name), '',
        '## Installation', '', '```bash', command, '```', '',
        '## Usage', '', 'Use the exports from the installed entry file:', '',
        '```text', installedPath, '```', '',
        '## Setup notes', '', markdownText(notes), '',
      ].join('\n'))
    }
    loaders.push(`  ${JSON.stringify(item.name)}: () => import(${JSON.stringify(`@/${relative}`)}),`)
  }
  const indexPath = `${docsDirectory}/index.ts`
  const indexContent = '// Generated by scripts/update-registry.mjs. Edit the MDX documents, not this index.\nexport const documentation = {\n'
    + loaders.sort(compare).join('\n') + '\n}\n'
  if (!fs.existsSync(path.join(root, indexPath)) || fs.readFileSync(path.join(root, indexPath), 'utf8') !== indexContent) {
    writes.set(indexPath, indexContent)
  }
  return writes
}

export function writeDocumentation(root, writes) {
  for (const [relative, content] of writes) {
    const destination = path.join(root, relative)
    fs.mkdirSync(path.dirname(destination), { recursive: true })
    // MDX is user-owned after creation; never replace an edited document.
    fs.writeFileSync(destination, content, relative.endsWith('.mdx') ? { flag: 'wx' } : undefined)
  }
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const root = fileURLToPath(new URL('../', import.meta.url))
  const file = path.join(root, 'registry.json')
  const registry = generateRegistry(root)
  const output = JSON.stringify(registry, null, 2) + '\n'
  const docs = planDocumentation(root, registry)
  if (process.argv.includes('--check')) {
    if (fs.readFileSync(file, 'utf8') !== output || docs.size) {
      console.error(`Registry or documentation is out of date (${docs.size} documentation files pending). Run bun run registry:update.`)
      process.exitCode = 1
    } else console.log(`registry.json and docs/ match registry sources.`)
  } else {
    fs.writeFileSync(file, output)
    writeDocumentation(root, docs)
    console.log(`Updated registry.json: ${registry.items.length} unique entries; created ${[...docs.keys()].filter(file => file.endsWith('.mdx')).length} MDX documents in docs/.`)
  }
}
