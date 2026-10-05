import assert from 'node:assert/strict'
import { test } from 'node:test'
import { renderToStaticMarkup } from 'react-dom/server'
import { DotsNav } from '../components/ui/dots-nav'

test('dots navigation supports both orientations and accessible active links', () => {
  const items = [{ title: 'Overview', href: '/overview' }, { title: 'Activity', href: '/activity' }]
  for (const orientation of ['vertical', 'horizontal'] as const) {
    const html = renderToStaticMarkup(<DotsNav items={items} activeHref="/activity" orientation={orientation} aria-label="Sections" />)
    assert.ok(html.includes(`data-orientation="${orientation}"`))
    assert.ok(html.includes(orientation === 'vertical' ? 'flex-col' : 'flex-row'))
    assert.equal((html.match(/aria-current="page"/g) ?? []).length, 1)
    assert.match(html, /aria-label="Activity" aria-current="page"/)
    assert.match(html, /aria-label="Overview"/)
    assert.match(html, /href="\/activity"/)
    assert.equal((html.match(/hidden=""/g) ?? []).length, 2)
  }
  const expanded = renderToStaticMarkup(<DotsNav items={items} activeHref="/activity" expanded />)
  assert.equal((expanded.match(/hidden=""/g) ?? []).length, 2)
  assert.match(renderToStaticMarkup(<DotsNav items={[]} />), /data-orientation="vertical"/)
})
