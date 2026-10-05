import assert from "node:assert/strict";
import { test } from "node:test";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { pageMetadata, siteUrl } from "../lib/seo";
import { getRegistryItems, getRegistryItemHref } from "../lib/registry";
import sitemap from "../app/sitemap";
import robots from "../app/robots";
import JsonLd from "../components/seo/JsonLd";
import { generateMetadata } from "../app/(docs)/blocks/[slug]/page";

test("SEO URLs agree with canonical documentation routes and structured data is safe", async () => {
  const urls = sitemap().map(entry => entry.url);
  assert.equal(new Set(urls).size, urls.length);
  for (const item of getRegistryItems()) {
    if (item.meta?.documentationPage) continue;
    const href = getRegistryItemHref(item);
    const metadata = pageMetadata(href, item.title, item.description);
    assert.equal(metadata.title, item.title);
    assert.equal(metadata.alternates?.canonical, `${siteUrl}${href}`);
    assert.ok(urls.includes(`${siteUrl}${href}`));
    assert.equal(metadata.openGraph?.url, `${siteUrl}${href}`);
    assert.equal(metadata.openGraph?.locale, "en_GB");
    assert.ok(metadata.twitter && "card" in metadata.twitter);
    assert.equal(metadata.twitter.card, "summary_large_image");
  }
  const variant = await generateMetadata({ params: Promise.resolve({ slug: "navbar-floating" }) });
  assert.equal(variant.alternates?.canonical, `${siteUrl}/blocks/navbar`);
  await assert.rejects(generateMetadata({ params: Promise.resolve({ slug: "missing-item" }) }), /NEXT_HTTP_ERROR_FALLBACK;404/);
  assert.equal(robots().sitemap, `${siteUrl}/sitemap.xml`);
  const unsafe = "</script><img src=x onerror=alert(1)>";
  const markup = renderToStaticMarkup(createElement(JsonLd, { data: { name: unsafe } }));
  assert.ok(!markup.includes(unsafe));
  const payload = markup.match(/<script[^>]*>(.*?)<\/script>/)?.[1];
  assert.ok(payload);
  assert.equal(JSON.parse(payload).name, unsafe);
});
