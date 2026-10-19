<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

## Component implementation

- Use React `memo` for all reusable components.
- Use Motion for component animations and transitions, and respect reduced motion. Static components do not need artificial animation or a Motion dependency.
- Import declarative Motion elements with `import * as motion from 'motion/react-client';` and use `motion.div`, `motion.svg`, `motion.path`, etc. Motion elements alone do not require a `"use client"` directive on the containing component.
- Reuse available components (for example Card, Button, and AspectRatio) before recreating their structure with raw elements. Use semantic HTML for layout where no suitable component exists.
- Add `"use client"` only when necessary to establish a client boundary for state, effects, event handlers, browser APIs, or interactive dependencies. Keep static components server-compatible; `memo` alone does not require `"use client"`.

## Typography hierarchy

Apply the shared scale in `registry/lib/typography.shared.ts` to documentation and all components.
The reference is the documentation's “Setup notes” heading and paragraph.

- Page titles: `typography.pageTitle`; hero headings may use the existing larger responsive scale.
- Section and component titles (including Card and BottomSheet): `typography.sectionTitle` (24px, semibold, tight tracking, foreground).
- Subsection titles: `typography.subsectionTitle` (20px, semibold).
- Descriptions and explanatory paragraphs: `typography.body` (16px, 28px line height, muted foreground).
- Compact controls, navigation labels, code, captions, prices, and semantic status colors retain their purpose-specific styling; do not treat them as section titles or descriptive prose.
- Keep structural margins/padding separate from typography. Do not invent sizes such as `text-md` or independently restyle titles/descriptions.
- Registry components must import the shared scale relatively so installation bundles it automatically.
- Dont build registry unless the user ask for it.

- Tooltip exception: title/plain content uses medium text (`text-base`, 16px); descriptions use small text (`typography.caption`, 14px). Do not use larger headings inside tooltips.
