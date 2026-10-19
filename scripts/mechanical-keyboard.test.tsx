import assert from 'node:assert/strict';
import { test } from 'node:test';
import { renderToStaticMarkup } from 'react-dom/server';
import { MechanicalKeyboard } from '../registry/components/mechanical-keyboard';

test('keyboard instances have complete layouts and independent SVG resources', () => {
  const html = renderToStaticMarkup(<><MechanicalKeyboard label="First keyboard" /><MechanicalKeyboard label="Second keyboard" /></>);
  const ids = [...html.matchAll(/\bid="([^"]+)"/g)].map(match => match[1]);
  assert.equal(ids.length, new Set(ids).size);
  for (const [, reference] of html.matchAll(/url\(#([^)]+)\)/g)) assert.ok(ids.includes(reference));
  assert.equal((html.match(/data-slot="keyboard-key"/g) ?? []).length, 154);
  assert.equal((html.match(/data-slot="keyboard-key-outline"[^>]*fill="none"/g) ?? []).length, 154);
  assert.equal((html.match(/data-slot="keyboard-key-color"/g) ?? []).length, 154);
  assert.match(html, /<g data-slot="keyboard-case"[^>]*style="opacity:0"/);
  assert.match(html, /data-slot="keyboard-outline"[^>]*fill="none"/);
  assert.doesNotMatch(html, /data-slot="keyboard-border-highlight"/);
  assert.match(html, /<rect data-slot="keyboard-plate"[^>]*fill="var\(--color-black, #000000\)"/);
  assert.match(html, /aria-label="First keyboard"/);
  assert.match(html, /aria-label="Second keyboard"/);
});
