// Run with next dev running: node scripts/check-bottom-sheet-browser.mjs [base-url]
import { execFileSync } from 'node:child_process';

const baseUrl = process.argv[2] ?? 'http://localhost:3000';
const browser = (...args) => execFileSync('agent-browser', ['--session', 'bottom-sheet-regression', ...args], { encoding: 'utf8' });

try {
  browser('open', `${baseUrl}/components/bottom-sheet`);
  browser('wait', 'button[aria-haspopup="dialog"]');
  const result = browser('eval', `(async () => {
    const pause = ms => new Promise(resolve => setTimeout(resolve, ms));
    const trigger = Array.from(document.querySelectorAll('button')).find(button => button.textContent.trim() === 'View details');
    const cycles = [];
    for (let cycle = 0; cycle < 3; cycle++) {
      trigger.focus();
      trigger.click();
      await pause(100);
      const sheet = document.querySelector('dialog[open]');
      if (!sheet) throw new Error('Sheet failed to open');
      const compactWidth = sheet.getBoundingClientRect().width;
      await pause(1500);
      const expanded = sheet.getBoundingClientRect();
      const title = sheet.querySelector('h2');
      if (expanded.width < 300 || expanded.height <= 64 || expanded.width <= compactWidth || getComputedStyle(title.parentElement).opacity !== '1') {
        throw new Error('Reopen failed to expand on cycle ' + (cycle + 1) + ': ' + JSON.stringify({ compactWidth, expandedWidth: expanded.width, expandedHeight: expanded.height, opacity: getComputedStyle(title.parentElement).opacity }));
      }
      sheet.querySelector('button[aria-label="Close bottom sheet"]').click();
      await pause(900);
      if (sheet.open || document.activeElement !== trigger) throw new Error('Close/focus failed on cycle ' + (cycle + 1));
      cycles.push({ compactWidth: Math.round(compactWidth), expandedWidth: Math.round(expanded.width) });
    }
    return { passed: true, cycles };
  })()`);
  process.stdout.write(result);
} finally {
  browser('close');
}
