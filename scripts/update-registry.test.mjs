import assert from 'node:assert/strict'
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import { test } from 'node:test'
import { generateRegistry, planDocumentation, writeDocumentation } from './update-registry.mjs'

test('syncs entries, dependency closures, assets, and metadata deterministically', () => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'nova-blue-registry-'))
  const write = (file, content) => {
    fs.mkdirSync(path.dirname(path.join(root, file)), { recursive: true })
    fs.writeFileSync(path.join(root, file), content)
  }
  const entry = 'registry/nova-blue/ui/example.tsx'
  const item = { name: 'example', type: 'registry:ui', title: 'Custom title', description: 'Keep this description.', files: [{ path: entry, type: 'registry:ui' }], meta: { preview: 'custom' } }
  try {
    write('package.json', JSON.stringify({ dependencies: { '@example/icons': '^2.0.0' } }))
    write('registry.json', JSON.stringify({ name: 'test', homepage: 'https://example.com', items: [item, { ...item, name: 'duplicate' }, { ...item, name: 'deleted', files: [{ path: 'registry/nova-blue/ui/deleted.tsx', type: 'registry:ui' }] }] }))
    write(entry, 'import { helper } from "../lib/helper"; export const Example = () => <img src="/example.svg" />;')
    write('registry/nova-blue/lib/helper.ts', 'export { other as helper } from "./other";')
    write('registry/nova-blue/lib/other.ts', 'import "./helper"; import "node:fs"; import "@example/icons/react"; export const other = 1;')
    write('registry/nova-blue/styles/portfolio.css', '@import "./tokens.css";')
    write('registry/nova-blue/styles/tokens.css', ':root { --example: green; }')
    write('public/example.svg', '<svg />')
    let output = generateRegistry(root)
    assert.equal(output.items.length, 5)
    const example = output.items.find(item => item.name === 'example')
    assert.equal(example.title, 'Custom title')
    assert.equal(example.meta.preview, 'custom')
    assert.deepEqual(example.dependencies, ['@example/icons@^2.0.0'])
    assert.equal(example.files.length, 6)
    assert.ok(example.files.some(file => file.target === 'public/example.svg'))
    assert.equal(new Set(output.items.map(item => item.files[0].path)).size, output.items.length)
    write('registry.json', JSON.stringify(output))
    assert.deepEqual(generateRegistry(root), output)
    write('registry/nova-blue/ui/new.tsx', 'export default function New() { return null }')
    output = generateRegistry(root)
    assert.ok(output.items.some(item => item.name === 'nova-blue-ui-new'))
    fs.unlinkSync(path.join(root, entry))
    assert.ok(!generateRegistry(root).items.some(item => item.name === 'example'))
    const beforeFailure = fs.readFileSync(path.join(root, 'registry.json'), 'utf8')
    write(entry, 'export { missing } from "../lib/missing"')
    assert.throws(() => generateRegistry(root), /Unresolved local import/)
    // A failed scan must never write a partial manifest.
    assert.equal(fs.readFileSync(path.join(root, 'registry.json'), 'utf8'), beforeFailure)
  } finally {
    fs.rmSync(root, { recursive: true, force: true })
  }
})


test('creates categorized MDX and loaders without replacing edited docs', async () => {
  const { compile } = await import('@mdx-js/mdx')
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'nova-blue-docs-'))
  const registry = {
    homepage: 'https://example.com/',
    items: ['components', 'blocks', 'shader', 'utils'].map(category => ({
      name: `example-${category}`,
      description: 'Example <Widget> with {children} & content.',
      meta: { category },
      files: [{ path: 'registry/nova-blue/ui/example.tsx', target: '@components/lazy-ui/ui/example.tsx' }],
    })),
  }
  try {
    const writes = planDocumentation(root, registry)
    assert.equal(writes.size, 5)
    assert.equal(fs.existsSync(path.join(root, 'docs')), false, 'Planning/checking must not write files')
    for (const [file, content] of writes) {
      if (file.endsWith('.mdx')) await compile(content)
    }
    writeDocumentation(root, writes)
    for (const item of registry.items) {
      const doc = fs.readFileSync(path.join(root, `docs/${item.meta.category}/${item.name}.mdx`), 'utf8')
      assert.ok(doc.includes(`npx shadcn@latest add https://example.com/r/${item.name}.json`))
      assert.ok(doc.includes('@/components/lazy-ui/ui/example.tsx'))
    }
    const edited = path.join(root, 'docs/components/example-components.mdx')
    fs.writeFileSync(edited, '# My custom preview\n\n<Preview>Keep this content.</Preview>\n')
    assert.equal(planDocumentation(root, registry).size, 0)
    registry.items.shift()
    const next = planDocumentation(root, registry)
    assert.equal(next.size, 1)
    writeDocumentation(root, next)
    assert.ok(!fs.readFileSync(path.join(root, 'docs/index.ts'), 'utf8').includes('example-components'))
    assert.ok(fs.readFileSync(edited, 'utf8').includes('Keep this content.'))
    fs.unlinkSync(path.join(root, 'docs/blocks/example-blocks.mdx'))
    assert.ok(planDocumentation(root, registry).has('docs/blocks/example-blocks.mdx'))
  } finally {
    fs.rmSync(root, { recursive: true, force: true })
  }
})

test('omits portfolio prefixes in doc paths and keeps distinct logo documents', () => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'nova-blue-doc-names-'))
  try {
    const registry = {
      homepage: 'https://example.com',
      items: [
        { name: 'portfolio-container', meta: { category: 'components' }, files: [{ path: 'registry/nova-blue/components/container.tsx' }] },
        { name: 'portfolio-logo', meta: { category: 'components' }, files: [{ path: 'registry/nova-blue/components/logo.tsx' }] },
        { name: 'logo', meta: { category: 'components' }, files: [{ path: 'registry/nova-blue/ui/logo.tsx' }] },
      ],
    }
    const writes = planDocumentation(root, registry)
    assert.ok(writes.has('docs/components/container.mdx'))
    assert.ok(writes.has('docs/components/components-logo.mdx'))
    assert.ok(writes.has('docs/components/logo.mdx'))
    assert.ok(![...writes.keys()].some(file => file.includes('/portfolio-')))
    assert.ok(writes.get('docs/index.ts').includes('"portfolio-container": () => import("@/docs/components/container.mdx")'))
    writeDocumentation(root, writes)
    assert.equal(planDocumentation(root, registry).size, 0)
  } finally {
    fs.rmSync(root, { recursive: true, force: true })
  }
})
