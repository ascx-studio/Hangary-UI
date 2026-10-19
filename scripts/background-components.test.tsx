import assert from 'node:assert/strict';
import Link from 'next/link';
import { test } from 'node:test';
import { renderToStaticMarkup } from 'react-dom/server';
import { DotGridBackground } from '../registry/shader/dot-grid-background';
import { SpotlightGridBackground } from '../registry/shader/spotlight-grid-background';
import { AuroraBackground } from '../registry/shader/aurora-background';
import { BeamsBackground } from '../registry/shader/beams-background';

for (const Background of [DotGridBackground, SpotlightGridBackground, AuroraBackground, BeamsBackground]) {
  test(`${"displayName" in Background ? Background.displayName ?? "DotGridBackground" : Background.name} preserves content, native attributes, and caller styles`, () => {
    const html = renderToStaticMarkup(<Background id="example" className="custom-background" style={{ minHeight: 200 }} aria-label="Product preview"><Link href="/components">Explore components</Link></Background>);
    assert.match(html, /id="example"/);
    assert.match(html, /aria-label="Product preview"/);
    assert.match(html, /class="[^"]*custom-background/);
    assert.match(html, /min-height:200px/);
    assert.match(html, /aria-hidden="true"/);
    assert.match(html, /<a href="\/components">Explore components<\/a>/);
  });
}

test('background controls support custom colors and clamp invalid geometry', () => {
  const dots = renderToStaticMarkup(<DotGridBackground gap={0} dotSize={0} dotColor="#abcdef" fade={false} />);
  assert.match(dots, /--dot-gap:4px/);
  assert.match(dots, /--dot-size:0.5px/);
  assert.match(dots, /--dot-color:#abcdef/);
  assert.doesNotMatch(dots, /ellipse at center/);
  const beams = renderToStaticMarkup(<BeamsBackground speed={0} beamColor="rebeccapurple" />);
  assert.match(beams, /--background-speed:1s/);
  assert.match(beams, /--beam-color:rebeccapurple/);
});
