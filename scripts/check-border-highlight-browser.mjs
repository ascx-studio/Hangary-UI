import { execFileSync } from 'node:child_process';

// Run with next dev and agent-browser available.
// Pass spotlight-reveal to check the shared pointer behavior on image reveals.
const component = process.argv[2] ?? 'border-highlight';
if (!['border-highlight', 'spotlight-reveal'].includes(component)) throw Error('Unknown pointer effect');
const run = (...args) => execFileSync('agent-browser', ['--session', 'border-highlight-check', ...args], { encoding: 'utf8' });
try {
  run('open', `http://localhost:3000/components/${component}`);
  run('wait', '[aria-label="Component preview"] [aria-hidden="true"]');
  run('eval', `
    (async () => {
      const frame = [...document.querySelectorAll('[aria-label="Component preview"] div')].find(el =>
        el.lastElementChild?.style.maskImage && el.getBoundingClientRect().width > 0);
      const overlay = frame.lastElementChild;
      const bounds = frame.getBoundingClientRect();
      const send = (type, pointerType, x, y) => frame.dispatchEvent(new PointerEvent(type, {
        bubbles: true, pointerType, clientX: bounds.left + x, clientY: bounds.top + y,
      }));
      send('pointerover', 'mouse', 20, 30);
      await new Promise(resolve => setTimeout(resolve, 100));
      if (!overlay.style.maskImage.includes('20px 30px')) throw Error('Pointer entry must jump to the pointer');
      const beforeTouch = overlay.style.maskImage;
      send('pointermove', 'touch', 90, 100);
      await new Promise(resolve => setTimeout(resolve, 100));
      if (overlay.style.maskImage !== beforeTouch) throw Error('Touch must not move the highlight');
      send('pointermove', 'mouse', 90, 100);
      await new Promise(resolve => setTimeout(resolve, 1000));
      if (!overlay.style.maskImage.includes('90px 100px')) throw Error('Mouse movement must update the highlight');
      if (getComputedStyle(overlay).pointerEvents !== 'none') throw Error('The overlay must not intercept clicks');
      return 'Border Highlight pointer checks passed';
    })()
  `);
  console.log(`${component} pointer checks passed.`);
} finally {
  run('close');
}
