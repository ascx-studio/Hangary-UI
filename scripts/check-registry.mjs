import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import ts from 'typescript'
import { registrySchema } from 'shadcn/schema'

// Validate source without generating artifacts or loading consumer-only packages.
const registry = registrySchema.parse(JSON.parse(fs.readFileSync('registry.json', 'utf8')))
const allFiles = new Set()
const entryPaths = new Set()
const categories = new Set(['components', 'blocks', 'shader', 'utils'])
assert.equal(new Set(registry.items.map((item) => item.name)).size, registry.items.length, 'Item names must be unique')

for (const item of registry.items) {
  assert.ok(!entryPaths.has(item.files[0]?.path), `Duplicate entry source: ${item.files[0]?.path}`)
  entryPaths.add(item.files[0]?.path)
  assert.ok(categories.has(item.meta?.category), `Missing catalog category: ${item.name}`)
  const files = new Map(item.files.map((file) => [path.resolve(file.path), file]))
  const targets = item.files.map((file) => file.target).filter(Boolean)
  assert.equal(new Set(targets).size, targets.length, `Duplicate target: ${item.name}`)

  for (const file of item.files) {
    assert.ok(fs.existsSync(file.path), `Missing source: ${file.path}`)
    allFiles.add(file.path)
    if (!/\.tsx?$/.test(file.path)) continue
    const source = ts.createSourceFile(file.path, fs.readFileSync(file.path, 'utf8'), ts.ScriptTarget.Latest, true)
    assert.equal(source.parseDiagnostics.length, 0, `Invalid syntax: ${file.path}`)

    function visit(node) {
      let specifier
      if ((ts.isImportDeclaration(node) || ts.isExportDeclaration(node)) && node.moduleSpecifier) specifier = node.moduleSpecifier
      if (ts.isCallExpression(node) && node.expression.kind === ts.SyntaxKind.ImportKeyword) specifier = node.arguments[0]
      if (specifier && ts.isStringLiteral(specifier)) {
        const name = specifier.text
        assert.ok(!name.startsWith('@/'), `Unresolved project alias: ${file.path}: ${name}`)
        if (name.startsWith('.')) {
          const base = path.resolve(path.dirname(file.path), name)
          const resolved = [base, base + '.ts', base + '.tsx', base + '.css', path.join(base, 'index.ts'), path.join(base, 'index.tsx')]
            .find((candidate) => fs.existsSync(candidate) && fs.statSync(candidate).isFile())
          assert.ok(resolved, `Unresolved import: ${file.path}: ${name}`)
          const dependency = files.get(resolved)
          assert.ok(dependency, `Dependency not bundled: ${item.name}: ${name}`)
          if (file.target && dependency.target) {
            const installedImport = path.posix.normalize(path.posix.join(path.posix.dirname(file.target), name))
            const installedCandidates = [installedImport, installedImport + '.ts', installedImport + '.tsx', installedImport + '.css', installedImport + '/index.ts', installedImport + '/index.tsx']
            assert.ok(installedCandidates.includes(dependency.target), `Import breaks after installation: ${file.path}: ${name}`)
          }
        } else {
          const packageName = name.startsWith('@') ? name.split('/').slice(0, 2).join('/') : name.split('/')[0]
          assert.ok(
            ['react', 'react-dom', 'next'].includes(packageName) || name.startsWith('node:') || item.dependencies?.some((dependency) => dependency === packageName || dependency.startsWith(packageName + '@')),
            `Undeclared dependency: ${item.name}: ${packageName}`,
          )
        }
      }
      ts.forEachChild(node, visit)
    }
    visit(source)
  }
}

for (const directory of ['registry/nova-blue']) {
  for (const file of fs.readdirSync(directory, { recursive: true })) {
    if (!/\.(tsx?|css|svg)$/.test(file)) continue
    assert.ok(allFiles.has(`${directory}/${file}`), `Unregistered source: ${directory}/${file}`)
  }
}
console.log(`Validated ${registry.items.length} items and ${allFiles.size} source files: schema, categories, syntax, dependencies, and installed import paths. No build performed.`)
