import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { getRegistryItem, getRegistryItemHref } from "../lib/registry";
import Catalog from "../components/registry/catalog";
import BlockPage, { generateStaticParams } from "../app/(docs)/blocks/[slug]/page";
import DetailPage from "../components/registry/detail-page";
import sitemap from "../app/sitemap";

test("block families share documentation pages with preview, information, install commands, and usage", async () => {
  const catalog = renderToStaticMarkup(createElement(Catalog, { category: "blocks" }));
  const routes = generateStaticParams().map(({ slug }) => slug);
  for (const [family, variants] of [
    ["navbar", ["navbar", "navbar-aligned", "navbar-floating"]],
    ["footer", ["footer", "footer-minimal", "footer-stacked"]],
    ["login", ["login", "login-split", "login-minimal"]],
    ["pricing", ["pricing", "pricing-compact", "pricing-comparison"]],
  ] as const) {
    const docs = readFileSync(`app/(docs)/blocks/[slug]/${family}.mdx`, "utf8");
    assert.equal((docs.match(/<ComponentPreview /g) ?? []).length, 3);
    const sections = docs.split("\n\n---\n\n");
    for (const section of sections) {
      const info = section.search(/^#{1,2} /m);
      const preview = section.indexOf("<ComponentPreview ");
      const command = section.indexOf("<CodeBlock commands=");
      const usage = section.search(/^#{2,3} Usage/m);
      assert.ok(preview >= 0 && preview < info && info < command && command < usage);
      assert.ok(section.indexOf("```tsx", usage) > usage);
    }
    assert.ok(!docs.includes("Left-Aligned Navbar"));
    assert.ok(routes.includes(family));
    assert.ok(catalog.includes(`href="/blocks/${family}"`));
    for (const name of variants) {
      assert.ok(docs.includes(`id="${name}"`));
      assert.ok(docs.includes(`/r/${name}.json`));
      if (name === family) continue;
      const item = getRegistryItem(name, "blocks");
      assert.ok(item);
      assert.equal(getRegistryItemHref(item), `/blocks/${family}#${name}`);
      assert.ok(!routes.includes(name));
      assert.ok(!catalog.includes(`href="/blocks/${name}"`));
      const page = await BlockPage({ params: Promise.resolve({ slug: name }) });
      assert.equal(page.type, DetailPage);
      assert.deepEqual(page.props, { name, category: "blocks" });
      await assert.rejects(DetailPage({ name, category: "blocks" }), /NEXT_REDIRECT/);
      assert.ok(!sitemap().some(({ url }) => url.includes(`/blocks/${name}`) || url.includes(`#${name}`)));
    }
  }
  assert.equal(routes.length, 4);
});
