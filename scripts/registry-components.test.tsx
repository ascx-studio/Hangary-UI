import assert from 'node:assert/strict';
import { test } from 'node:test';
import { renderToStaticMarkup } from 'react-dom/server';
import { Avatar } from '../registry/components/avatar';
import { Breadcrumb } from '../registry/components/breadcrumb';
import { Button } from '../registry/components/button';
import { BottomSheet } from '../registry/components/bottom-sheet';
import { CodeBlock } from '../registry/components/code-block';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../registry/components/tabs';
import { Carousel } from '../registry/components/carousel';
import { Navbar } from '../registry/blocks/navbar';
import { Footer } from '../registry/blocks/footer';
import { NavbarAligned } from '../registry/blocks/navbar-aligned';
import { NavbarFloating } from '../registry/blocks/navbar-floating';
import { FooterMinimal } from '../registry/blocks/footer-minimal';
import { FooterStacked } from '../registry/blocks/footer-stacked';
import { Login } from '../registry/blocks/login';
import { LoginSplit } from '../registry/blocks/login-split';
import { LoginMinimal } from '../registry/blocks/login-minimal';
import { Pricing } from '../registry/blocks/pricing';
import { PricingCompact } from '../registry/blocks/pricing-compact';
import { PricingComparison } from '../registry/blocks/pricing-comparison';


test('buttons default to a non-submitting type and forward native attributes', () => {
  const html = renderToStaticMarkup(<Button disabled aria-label="Save">Save</Button>);
  assert.match(html, /type="button"/);
  assert.match(html, /disabled=""/);
  assert.match(html, /aria-label="Save"/);
  assert.match(renderToStaticMarkup(<Button type="submit" />), /type="submit"/);
});

test('breadcrumb exposes the current page without making it a link', () => {
  const html = renderToStaticMarkup(<Breadcrumb items={[{ label: 'Home', href: '/' }, { label: 'Settings', href: '/settings' }]} />);
  assert.match(html, /href="\/"/);
  assert.match(html, /aria-current="page"[^>]*>Settings<\/span>/);
  assert.doesNotMatch(html, /href="\/settings"/);
});

test('avatar initials handle whitespace and empty names', () => {
  assert.match(renderToStaticMarkup(<Avatar name="  Alex   Morgan  " />), />AM<\/span>/);
  assert.match(renderToStaticMarkup(<Avatar name="" />), />\?<\/span>/);
});

test('bottom sheet connects a modal to its accessible title and description', () => {
  const html = renderToStaticMarkup(<BottomSheet title="Quick actions" />);
  assert.match(html, /aria-haspopup="dialog"/);
  const titleId = html.match(/aria-labelledby="([^"]+)"/)?.[1];
  const descriptionId = html.match(/aria-describedby="([^"]+)"/)?.[1];
  assert.ok(titleId && descriptionId);
  assert.ok(html.includes(`id="${titleId}"`));
  assert.ok(html.includes(`id="${descriptionId}"`));
  assert.doesNotMatch(html, /<dialog[^>]*\sopen(?:=|\s|>)/);
});

test('carousel handles empty and single-slide collections', () => {
  assert.equal(renderToStaticMarkup(<Carousel slides={[]} />), '');
  const html = renderToStaticMarkup(<Carousel slides={['Only slide']} />);
  assert.match(html, /aria-label="1 of 1"/);
  assert.match(html, /Only slide/);
  assert.equal((html.match(/disabled=""/g) ?? []).length, 2);
});


test('code block safely renders markup as text with filename and line numbers', () => {
  const html = renderToStaticMarkup(<CodeBlock code={'<script>alert("hi")</script>\nsecond line'} filename="example.html" language="html" showLineNumbers />);
  assert.doesNotMatch(html, /<script>/);
  assert.match(html.replace(/<[^>]+>/g, ""), /&lt;script&gt;/);
  assert.match(html, /example.html/);
  assert.match(html, /aria-label="Copy code"/);
  assert.match(html, /aria-hidden="true"[^>]*>1\n2<\/span>/);
  assert.match(renderToStaticMarkup(<CodeBlock code="" />), /<code[^>]*><\/code>/);
});


test('code block highlights known languages and preserves unknown languages as plain text', () => {
  const javascript = renderToStaticMarkup(<CodeBlock code={'const count = 42;'} language="javascript" />);
  assert.match(javascript, /hljs-keyword/);
  assert.match(javascript, /hljs-number/);
  const tsx = renderToStaticMarkup(<CodeBlock code={'<Button variant="outline">Go</Button>'} language="tsx" />);
  assert.match(tsx, /hljs-string/);
  assert.match(tsx, /hljs-title/);
  const plain = renderToStaticMarkup(<CodeBlock code={'<unknown> & text'} language="unknown" />);
  assert.match(plain, /&lt;unknown&gt; &amp; text/);
  assert.doesNotMatch(plain, /class="hljs /);
});

test('package-manager commands display the selected manager and provide all three controls', () => {
  const commands = { bun: 'bun add highlight.js', npm: 'npm install highlight.js', pnpm: 'pnpm add highlight.js' };
  for (const manager of ['bun', 'npm', 'pnpm'] as const) {
    const html = renderToStaticMarkup(<CodeBlock commands={commands} packageManager={manager} />);
    assert.match(html, new RegExp(`aria-label="${manager} installation command"`));
    assert.ok(html.replace(/<[^>]+>/g, '').includes(commands[manager]));
    assert.equal((html.match(/aria-pressed="true"/g) ?? []).length, 1);
    assert.equal((html.match(/aria-pressed="false"/g) ?? []).length, 2);
    assert.match(html, /aria-label="Copy code"/);
  }
});


test('composed tabs connect panels, support controlled selection, and mark disabled triggers', () => {
  function example(value?: string) {
    return <Tabs defaultValue="overview" value={value} orientation="vertical">
      <TabsList variant="line" aria-label="Project sections">
        <TabsTrigger value="locked" disabled>Locked</TabsTrigger>
        <TabsTrigger value="overview">Overview</TabsTrigger>
        <TabsTrigger value="settings">Settings</TabsTrigger>
      </TabsList>
      <TabsContent value="locked">Locked content</TabsContent>
      <TabsContent value="overview">Overview content</TabsContent>
      <TabsContent value="settings">Settings content</TabsContent>
    </Tabs>;
  }
  const html = renderToStaticMarkup(example());
  assert.equal((html.match(/aria-selected="true"/g) ?? []).length, 1);
  assert.match(html, /aria-orientation="vertical"/);
  assert.match(html, /data-variant="line"/);
  assert.match(html, /aria-selected="true" tabindex="0"[^>]*>Overview/);
  assert.match(html, /disabled="" tabindex="-1"[^>]*>Locked/);
  const selectedPanel = html.match(/role="tabpanel"[^>]*>Overview content/);
  assert.ok(selectedPanel);
  assert.doesNotMatch(selectedPanel[0], /hidden=""/);
  const ids = [...html.matchAll(/id="([^"]+)"/g)].map(match => match[1]);
  for (const match of html.matchAll(/aria-(?:controls|labelledby)="([^"]+)"/g)) assert.ok(ids.includes(match[1]));
  assert.match(renderToStaticMarkup(example('settings')), /aria-selected="true" tabindex="0"[^>]*>Settings/);
});


test('navbar renders accessible navigation, a connected mobile toggle, and optional components', () => {
  const html = renderToStaticMarkup(<Navbar brand="Acme" activeHref="/products" links={[{ label: 'Products', href: '/products' }]} announcement="New collection" account={{ name: 'Alex Morgan', href: '/account' }} data-testid="navbar" />);
  assert.match(html, /data-testid="navbar"/);
  assert.match(html, /aria-current="page"/);
  assert.match(html, /New collection/);
  assert.match(html, /Alex Morgan&#x27;s account/);
  assert.match(html, /aria-expanded="false"/);
  const menuId = html.match(/aria-controls="([^"]+)"/)?.[1];
  assert.ok(menuId);
  assert.ok(html.includes(`id="${menuId}"`));
  assert.match(html, /aria-label="Mobile navigation" hidden=""/);
  const minimal = renderToStaticMarkup(<Navbar badge="" githubHref="" supportHref="" links={[]} />);
  assert.doesNotMatch(minimal, /GitHub repository|Support the project|Beta/);
});

test('footer renders link groups and uses its card action override', () => {
  const html = renderToStaticMarkup(<Footer copyright="© Acme" githubHref="" groups={[{ title: 'Company', links: [{ label: 'About', href: '/about' }] }]} callout={{ title: 'Build together', description: 'Start today.', label: 'Default action', href: '/start' }} action={<a href="/custom">Custom action</a>}><span>Brand detail</span></Footer>);
  assert.match(html, /aria-label="Company"/);
  assert.match(html, /href="\/about"/);
  assert.match(html, /Build together/);
  assert.match(html, /href="\/custom"/);
  assert.match(html, /Brand detail/);
  assert.match(html, /© Acme/);
  assert.doesNotMatch(html, /Default action|>GitHub</);
});


test('separate navbar and footer exports render their distinct layouts', () => {
  for (const [Block, layout] of [[Navbar, 'centered'], [NavbarAligned, 'aligned'], [NavbarFloating, 'floating']] as const) {
    const html = renderToStaticMarkup(<Block />);
    assert.ok(html.includes(`data-layout="${layout}"`));
    assert.match(html, /aria-label="Primary navigation"/);
    assert.match(html, /aria-label="Mobile navigation"/);
  }
  for (const [Block, layout] of [[Footer, 'columns'], [FooterMinimal, 'minimal'], [FooterStacked, 'stacked']] as const) {
    const html = renderToStaticMarkup(<Block description="Custom description" />);
    assert.ok(html.includes(`data-layout="${layout}"`));
    assert.match(html, /href="\/components"/);
    if (layout === 'minimal') assert.doesNotMatch(html, /Custom description/);
    else assert.match(html, /Custom description/);
  }
});

test('login blocks connect input labels and require authentication handlers to submit', () => {
  for (const Block of [Login, LoginSplit, LoginMinimal]) {
    const html = renderToStaticMarkup(<Block error="Invalid credentials" />);
    assert.match(html, /role="alert"/);
    assert.match(html, /Invalid credentials/);
    const password = html.match(/<input\b[^>]*name="password"[^>]*>/)?.[0];
    assert.ok(password);
    assert.match(password, /type="password"/);
    assert.match(password, /autoComplete="current-password"/);
    assert.match(password, /required=""/);
    assert.match(html, /type="submit"[^>]*disabled=""/);
    const ids = [...html.matchAll(/id="([^"]+)"/g)].map(match => match[1]);
    for (const label of html.matchAll(/for="([^"]+)"/g)) assert.ok(ids.includes(label[1]));
    const connected = renderToStaticMarkup(<Block onSubmit={() => {}} onProviderLogin={() => {}} />);
    assert.doesNotMatch(connected, /disabled=""/);
    const loading = renderToStaticMarkup(<Block loading onSubmit={() => {}} />);
    assert.match(loading, /aria-busy="true"/);
    assert.match(loading, /Signing in…/);
  }
});

test('pricing blocks show the selected billing prices and annual totals', () => {
  for (const Block of [Pricing, PricingCompact, PricingComparison]) {
    const monthly = renderToStaticMarkup(<Block />);
    assert.match(monthly, /\$19/);
    assert.equal((monthly.match(/aria-pressed="true"/g) ?? []).length, 1);
    const annual = renderToStaticMarkup(<Block defaultBilling="yearly" />);
    assert.match(annual, /\$15/);
    assert.match(annual, /\$180/);
    assert.match(annual, /aria-label="Get started with Pro"/);
    assert.match(annual, /Billed once a year/);
    assert.doesNotMatch(renderToStaticMarkup(<Block plans={[]} />), /Get started with Pro/);
  }
});


test('split login places its responsive grid inside the query container', () => {
  const html = renderToStaticMarkup(<LoginSplit />);
  assert.match(html, /data-layout="split" class="@container w-full"><div class="[^"]*@xl:grid-cols-2/);
  assert.match(html, /<aside[^>]*@xl:border-r/);
  assert.match(html, /@xl:justify-center/);
});
