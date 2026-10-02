import assert from 'node:assert/strict'
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import { test } from 'node:test'
import { generateRegistry, planDocumentation, planPreviews, writeDocumentation } from './update-registry.mjs'

test('generates preview imports and editable prop metadata from component signatures', () => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'lazy-preview-props-'))
  try {
    const entry = 'registry/components/text-widget.tsx'
    fs.mkdirSync(path.dirname(path.join(root, entry)), { recursive: true })
    fs.writeFileSync(path.join(root, entry), 'export function TextWidget({ text = "Hello", speed = 2, paused = false, onChange }: { text?: string; speed?: number; paused?: boolean; onChange?: (value: string) => void }) { return null }')
    const registry = { items: [{ name: 'text-widget', meta: { category: 'components' }, files: [{ path: entry }] }] }
    const writes = planPreviews(root, registry)
    assert.ok(writes.get('components/registry/preview-entries.ts').includes('component: TextWidget'))
    const props = writes.get('components/registry/preview-props.ts')
    assert.ok(props.includes('"text","type":"string","required":false,"control":"text","defaultValue":"Hello"'))
    assert.ok(props.includes('"paused","type":"boolean","required":false,"control":"boolean","defaultValue":false'))
    assert.ok(props.includes('"onChange","type":"(value: string) => void","required":false,"control":null'))
    writeDocumentation(root, writes)
    assert.equal(planPreviews(root, registry).size, 0)
  } finally {
    fs.rmSync(root, { recursive: true, force: true })
  }
})

test('bundles components and shaders into blocks in the flat registry layout', () => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'lazy-registry-'))
  const write = (file, content) => {
    fs.mkdirSync(path.dirname(path.join(root, file)), { recursive: true })
    fs.writeFileSync(path.join(root, file), content)
  }
  try {
    write('package.json', '{"dependencies":{}}')
    write('registry.json', JSON.stringify({ name: 'test', homepage: 'https://example.com', items: [] }))
    write('registry/components/dial.tsx', 'export const Dial = () => null')
    write('registry/shader/field.tsx', 'export const Field = () => null')
    write('registry/blocks/station.tsx', 'import { Dial } from "../components/dial"; import { Field } from "../shader/field"; export const Station = () => <><Dial/><Field/></>')
    const output = generateRegistry(root)
    assert.equal(output.items.length, 3)
    const block = output.items.find(item => item.meta.category === 'blocks')
    assert.equal(block.type, 'registry:block')
    assert.equal(block.files.length, 3)
    assert.ok(block.files.some(file => file.target === '@components/lazy-ui/shader/field.tsx'))
    assert.equal(output.items.find(item => item.name === 'lazy-shader-field').meta.category, 'shader')
    assert.equal(planDocumentation(root, output).size, 4)
    write('registry.json', JSON.stringify(output))
    assert.deepEqual(generateRegistry(root), output)
  } finally {
    fs.rmSync(root, { recursive: true, force: true })
  }
})

test('syncs entries, dependency closures, assets, and metadata deterministically', () => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'lazy-registry-'))
  const write = (file, content) => {
    fs.mkdirSync(path.dirname(path.join(root, file)), { recursive: true })
    fs.writeFileSync(path.join(root, file), content)
  }
  const entry = 'registry/ui/example.tsx'
  const item = { name: 'example', type: 'registry:ui', title: 'Custom title', description: 'Keep this description.', files: [{ path: entry, type: 'registry:ui' }], meta: { preview: 'custom' } }
  try {
    write('package.json', JSON.stringify({ dependencies: { '@example/icons': '^2.0.0' } }))
    write('registry.json', JSON.stringify({ name: 'test', homepage: 'https://example.com', items: [item, { ...item, name: 'duplicate' }, { ...item, name: 'deleted', files: [{ path: 'registry/ui/deleted.tsx', type: 'registry:ui' }] }] }))
    write(entry, 'import { helper } from "../lib/helper"; export const Example = () => <img src="/example.svg" />;')
    write('registry/lib/helper.ts', 'export { other as helper } from "./other";')
    write('registry/lib/other.ts', 'import "./helper"; import "node:fs"; import "@example/icons/react"; export const other = 1;')
    write('public/example.svg', '<svg />')
    let output = generateRegistry(root)
    assert.equal(output.items.length, 3)
    const example = output.items.find(item => item.name === 'example')
    assert.equal(example.title, 'Custom title')
    assert.equal(example.meta.preview, 'custom')
    assert.deepEqual(example.dependencies, ['@example/icons@^2.0.0'])
    assert.equal(example.files.length, 4)
    assert.ok(example.files.some(file => file.target === 'public/example.svg'))
    assert.equal(new Set(output.items.map(item => item.files[0].path)).size, output.items.length)
    write('registry.json', JSON.stringify(output))
    assert.deepEqual(generateRegistry(root), output)
    write('registry/ui/new.tsx', 'export default function New() { return null }')
    output = generateRegistry(root)
    assert.ok(output.items.some(item => item.name === 'lazy-ui-new'))
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
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'lazy-docs-'))
  const registry = {
    homepage: 'https://example.com/',
    items: ['components', 'blocks', 'shader', 'utils'].map(category => ({
      name: `example-${category}`,
      description: 'Example <Widget> with {children} & content.',
      meta: { category },
      files: [{ path: 'registry/ui/example.tsx', target: '@components/lazy-ui/ui/example.tsx' }],
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
