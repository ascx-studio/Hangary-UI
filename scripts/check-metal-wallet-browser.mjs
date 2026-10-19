import { execFileSync } from 'node:child_process';

// Run with next dev and agent-browser available.
const run = (...args) => execFileSync('agent-browser', ['--session', 'metal-wallet-check', ...args], { encoding: 'utf8' });
const expectPressed = value => run('eval', `
  (() => {
    const button = document.querySelector('[role="tabpanel"]:not([hidden]) [data-slot="metal-wallet"]');
    if (button.getAttribute('aria-pressed') !== '${value}') throw Error('Incorrect wallet open state');
  })()
`);
try {
  run('open', 'http://localhost:3000/components/metal-wallet');
  run('hover', '[role="tabpanel"]:not([hidden]) [data-slot="metal-wallet"]');
  run('eval', `
    (async () => {
      await new Promise(resolve => setTimeout(resolve, 1000));
      const wallet = document.querySelector('[role="tabpanel"]:not([hidden]) [data-slot="metal-wallet"]');
      // Positive local Y moves the front left after the clockwise rotation.
      const front = wallet.querySelector('[data-slot="wallet-front"]');
      if (new DOMMatrix(getComputedStyle(front).transform).m42 <= 0) throw Error('Hover must move the front left');
    })()
  `);
  run('mouse', 'move', '0', '0');
  run('focus', '[role="tabpanel"]:not([hidden]) [data-slot="metal-wallet"]');
  run('press', 'Enter');
  expectPressed(true);
  run('press', 'Escape');
  expectPressed(false);
  run('press', 'Space');
  expectPressed(true);
  run('mouse', 'move', '0', '0');
  run('find', 'role', 'tab', 'click', '--name', 'White');
  run('eval', `
    (() => {
      const button = document.querySelector('[role="tabpanel"]:not([hidden]) [data-slot="metal-wallet"]');
      if (button.dataset.color !== 'white') throw Error('Color variation did not change');
      if (button.querySelectorAll('[data-slot="wallet-card"]').length !== 3) throw Error('Expected three cards');
      for (const card of button.querySelectorAll('[data-slot="wallet-card"]')) {
        if (card.getAttribute('transform') !== 'rotate(-90)') throw Error('Cards must remain upright inside the rotated wallet');
      }
      const ids = [...document.querySelectorAll('[aria-label="Component preview"] svg [id]')].map(el => el.id);
      if (ids.length !== new Set(ids).size) throw Error('SVG identifiers must be unique across instances');
      const expected = {
        'spring-green': ['rgb(5, 220, 127)', 'rgb(5, 220, 127)', '0.45', 'rgb(0, 102, 78)'],
        green: ['rgb(0, 102, 78)', 'rgb(0, 102, 78)', '0.45', 'rgb(5, 220, 127)'],
        'dark-green': ['rgb(21, 46, 43)', 'rgb(21, 46, 43)', '0.45', 'rgb(0, 102, 78)'],
        white: ['rgb(255, 255, 255)', 'rgb(245, 245, 245)', '0.85', 'rgb(212, 212, 212)'],
      };
      for (const wallet of document.querySelectorAll('[data-slot="metal-wallet"]')) {
        const back = wallet.querySelector('[data-slot="wallet-back"]');
        const front = wallet.querySelector('[data-slot="wallet-front-tint"]');
        const actual = [getComputedStyle(back).fill, getComputedStyle(front).fill, front.getAttribute('fill-opacity'), getComputedStyle(front).stroke];
        if (JSON.stringify(actual) !== JSON.stringify(expected[wallet.dataset.color])) throw Error('Wallet colors must match the brand palette and white example');
      }
    })()
  `);
  expectPressed(false);
  run('find', 'role', 'button', 'click', '--name', 'Metal wallet');
  expectPressed(true);
  run('eval', `
    (async () => {
      await new Promise(resolve => setTimeout(resolve, 1000));
      const wallet = document.querySelector('[role="tabpanel"]:not([hidden]) [data-slot="metal-wallet"]');
      const front = wallet.querySelector('[data-slot="wallet-front"]');
      const transform = new DOMMatrix(getComputedStyle(front).transform);
      // Local positive Y slides left after rotation; local X must stay fixed.
      if (Math.abs(transform.m41) > 0.1 || transform.m42 < 99) throw Error('Click must slide the front straight left');
      if (transform.m22 < 0.95) throw Error('The front must keep its full shape');
      for (const card of wallet.querySelectorAll('[data-slot="wallet-card-motion"]')) {
        if (new DOMMatrix(getComputedStyle(card).transform).m42 > -89) throw Error('Click must move the cards farther right');
      }
    })()
  `);
  console.log('Metal Wallet keyboard, click, and variation checks passed.');
} finally {
  run('close');
}
