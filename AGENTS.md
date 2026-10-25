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

## Shader implementation and verification

- Use the `vgpu` skill for shader work. When `vgpu-agent-flow` is requested, read it and use its research → implementation → review workflow. Check whether its Subharness roles and required access exist before launching specialists; report missing infrastructure and never claim a specialist ran when it did not. This application is not the upstream vgpu repository: do not assume its canary branch, Vercel project, or release workflow applies here.
- Use this project's installed vgpu version as the authority: `node_modules/.bin/vgpu --version`, then `docs cat getting-started.md`, `docs cat shader-workflow.docs.md`, and the relevant API guides. Do not download a different version for documentation.
- Implement GPU effects in `.wgsl` files, imported through the existing `@vgpu/wgsl` loader. Use vgpu `effect`, `surface`/`target`, `clock`, and `frame`/`frameLoop` for rendering. Do not replace the shader with CSS, Canvas 2D, or a custom WebGL renderer; CSS is only a fallback when WebGPU is unavailable.
- Reuse `registry/shader/shader-renderer.shared.ts` for canvas effects; do not duplicate GPU initialization, compilation, frame loops, static resize rendering, or disposal in components. Keep shader-specific uniforms and input handling in the consumer. Wordmarks share `wordmark-shader.shared.tsx`; frame cards compose existing background components. Include shared files in registry installation metadata.
- Keep loader and runtime releases compatible. Prepare shaders at build time in the browser; Node checks must resolve file imports before preparing the shader.
- Before accepting shader changes, run `bun run shader:check -- <changed.wgsl ...>` (all registry shaders when no paths are supplied). This uses `vgpu check --require-validation`: skipped GPU validation is a failure, not a pass. A Next.js build or TypeScript check does not validate WGSL.
- Render through `vgpu/node`, read pixels, and assert deterministic output plus the behavior changed (time, pointer, intensity, reveal, etc.). Inspect a rendered image for visual claims. Use numeric extraction and a CPU reference when shader math is in doubt.
- Verify browser integration on the affected page with WebGPU enabled: first frame, console errors, pointer/click behavior, resize, reduced motion, and cleanup. Distinguish native GPU evidence from browser evidence; explicitly report checks that could not run.
- Precompile against the actual render target, respect reduced motion, stop loops and release GPU resources on unmount. Preserve a static fallback for unsupported devices. Never rebuild the registry unless requested.

## Typography hierarchy

Apply the shared `typography-*` utilities in `app/globals.css` to documentation and all components.
The reference is the documentation's “Setup notes” heading and paragraph.

- Page titles: `typography-page-title`; hero headings may use the existing larger responsive scale.
- Section and component titles (including Card and BottomSheet): `typography-section-title` (24px, semibold, tight tracking, foreground).
- Subsection titles: `typography-subsection-title` (20px, semibold).
- Descriptions and explanatory paragraphs: `typography-body` (16px, 28px line height, muted foreground).
- Compact controls, navigation labels, code, captions, prices, and semantic status colors retain their purpose-specific styling; do not treat them as section titles or descriptive prose.
- Keep structural margins/padding separate from typography. Do not invent sizes such as `text-md` or independently restyle titles/descriptions.
- Registry components use the shared CSS utilities; include their definitions in registry item CSS metadata so installation adds them to global CSS.
- Dont build registry unless the user ask for it.

- Tooltip exception: title/plain content uses medium text (`text-base`, 16px); descriptions use small text (`typography-caption`, 14px). Do not use larger headings inside tooltips.
