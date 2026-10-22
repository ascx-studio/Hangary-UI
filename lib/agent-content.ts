import registry from "@/registry.json";
import { homeOverview, informationPages } from "@/lib/site-content";

const base = registry.homepage.replace(/\/$/, "");
const link = (label: string, path: string) => `[${label}](${path.startsWith("/") ? base + path : path})`;

export function prefersMarkdown(accept: string) {
  const ranges = accept.toLowerCase().split(",").map(value => {
    const [type, ...parameters] = value.trim().split(";");
    const quality = parameters.find(parameter => parameter.trim().startsWith("q="));
    const q = quality ? Number(quality.trim().slice(2)) : 1;
    return { type: type.trim(), q: Number.isFinite(q) && q >= 0 && q <= 1 ? q : 0 };
  });
  const markdown = ranges.find(range => range.type === "text/markdown");
  const html = ranges.find(range => range.type === "text/html")
    ?? ranges.find(range => range.type === "text/*")
    ?? ranges.find(range => range.type === "*/*");
  return !!markdown && markdown.q > 0 && markdown.q >= (html?.q ?? 0);
}

export function markdownPage(pathname: string): string | undefined {
  const path = pathname.replace(/\/$/, "") || "/";
  if (path === "/") {
    return ["# Hangry UI", "", "> React components, blocks, and shaders crafted with Motion.", "",
      ...homeOverview.flatMap(section => [`## ${section.title}`, "", section.text, "", link(section.label, section.href), ""]),
      "## Installation", "", "Install individual components through the shadcn CLI. Review each item's documentation for its API and dependencies.", "", "```sh", `npx shadcn@latest add ${base}/r/button.json`, "```", "",
      "## Project information", "", ...Object.keys(informationPages).map(slug => `- ${link(informationPages[slug as keyof typeof informationPages].title, `/${slug}`)}`),
      `- ${link("Agent guidance", "/llms.txt")}`, `- ${link("GitHub source", "https://github.com/ascx-studio/ui")}`, ""].join("\n");
  }
  const slug = path.slice(1);
  if (Object.hasOwn(informationPages, slug)) {
    const page = informationPages[slug as keyof typeof informationPages];
    return [`# ${page.title}`, "", page.description, "", ...page.sections.flatMap(section => [`## ${section.title}`, "", section.text, ""]), "## Links", "", ...page.links.map(item => `- ${link(item.label, item.href)}`), ""].join("\n");
  }
  if (path === "/sponser") {
    return ["# Sponsor Hangry UI", "", "Hangry UI is free to use. Sponsorship is optional and helps support components, documentation, and maintenance. You can also help by reporting bugs, improving documentation, sharing the project, or contributing code.", "", `- ${link("Sponsor Rajeev Puri", "https://github.com/sponsors/razeevascx")}`, `- ${link("Source and issues", "https://github.com/ascx-studio/ui")}`, `- ${link("Project issues", "https://github.com/ascx-studio/ui/issues")}`, ""].join("\n");
  }
  const [, category, name, ...extra] = path.split("/");
  if (!["components", "blocks", "shader"].includes(category) || extra.length) return undefined;
  const items = registry.items.filter(item => item.meta?.category === category);
  if (!name) {
    return [`# Hangry UI ${category === "shader" ? "shaders" : category}`, "", "Live previews, installation instructions, and documented source code.", "", ...items.map(item => `- ${link(item.title, `/${category}/${item.meta?.documentationPage ?? item.name}${item.meta?.documentationPage ? `#${item.name}` : ""}`)}: ${item.description}`), ""].join("\n");
  }
  const documented = items.filter(item => (item.meta?.documentationPage ?? item.name) === name);
  if (!documented.length) return undefined;
  return [`# ${documented[0].meta?.documentationPage ? name : documented[0].title}`, "",
    ...documented.flatMap(item => [`## ${item.title}`, "", item.description, "", "### Installation", "", "```sh", `npx shadcn@latest add ${base}/r/${item.name}.json`, "```", "", ...item.files.map(file => `- ${link(file.path, `https://github.com/ascx-studio/ui/blob/main/${file.path}`)}`), ""]),
    `See ${link("the full documentation", path)} for interactive previews, props, and setup notes.`, ""].join("\n");
}

export const markdownNotFound = `# Page not found\n\nThis page does not exist. Browse the [components](${base}/components), [sitemap](${base}/sitemap.xml), or [agent guidance](${base}/llms.txt) to find the documentation you need.\n`;
