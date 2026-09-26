# Item documentation

Edit the MDX file in the matching category folder. New files contain overview, installation, usage, and setup notes. The shared page supplies the title; live previews belong inside the MDX document.

Run `bun run registry:update` after adding a registry source. It creates missing MDX files under `docs/components/`, `docs/blocks/`, `docs/shader/`, or `docs/utils/` and regenerates `docs/index.ts`. Existing MDX content is never overwritten, and orphaned documents are kept for manual review. Customize the generated usage section and add a live preview where appropriate. Templates use `docs/templates/` and import their documentation in the template route.

Keep examples aligned with the installed entry file. Write live examples directly in each MDX document inside `<Preview>...</Preview>`. The shared wrapper is `components/registry/preview.tsx`; installable components live in the root `registry/`. Keep any stateful demo helpers next to their MDX document.

Fenced code blocks automatically use `CodePreview` with syntax highlighting. Include a language such as `tsx`, `ts`, `json`, or `bash`; unlabelled or unsupported languages render as plain text. You can also use `<CodePreview code={source} language="tsx" />` in MDX.

MDX filenames omit the `portfolio-` prefix (for example, `components/container.mdx`). Registry names and install URLs remain unchanged. If the shorter name is already used, the source path disambiguates it, such as `components/components-logo.mdx`.
