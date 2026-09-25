<div align="center">

# Lazy Ui

*A focused collection of reusable React components for modern interfaces.*

**Built with:**

![Next.js](https://img.shields.io/badge/Next.js-1E202B?style=for-the-badge&logo=nextdotjs&logoColor=ffffff)
![React](https://img.shields.io/badge/React-1E202B?style=for-the-badge&logo=react&logoColor=61DAFB)
![TypeScript](https://img.shields.io/badge/TypeScript-1E202B?style=for-the-badge&logo=typescript&logoColor=3178C6)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-1E202B?style=for-the-badge&logo=tailwindcss&logoColor=06B6D4)
![Bun](https://img.shields.io/badge/Bun-1E202B?style=for-the-badge&logo=bun&logoColor=ffffff)

</div>

## Overview

Lazy Ui is a small, reusable component library and documentation site built with Next.js, React, TypeScript, and Tailwind CSS. It provides composable interface primitives with a simple API, including buttons that can render as native controls or Next.js links.

## Features

- **Reusable Button API** — Choose `primary`, `secondary`, `ghost`, or `link` variants with custom class merging through `cn`.
- **Link-aware Buttons** — Render navigation buttons with `type="link"` and `href` while keeping the same visual variants.
- **Data-driven Navigation** — Keep Navbar and Sidebar destinations in dedicated data files instead of duplicating links in JSX.
- **Documentation Layout** — Browse introduction, installation, components, and component-specific documentation routes.

## Tech Stack

- **Framework:** Next.js 16, React 19
- **Language:** TypeScript
- **Styling:** Tailwind CSS 4
- **Package manager:** Bun
- **Tooling:** ESLint, shadcn registry tooling

## Getting Started

### Prerequisites

- Bun 1.4+
- Node.js compatible with the installed Next.js version

### Setup

1. **Navigate to the project directory**

	```bash
	cd uilib
	```

2. **Install dependencies**

	```bash
	bun install
	```

3. **Start the development server**

	```bash
	bun run dev
	```

4. **Open the app**

	Visit [http://localhost:3000](http://localhost:3000).

## Available Scripts

| Command | Description |
| --- | --- |
| `bun run dev` | Start the Next.js development server |
| `bun run build` | Create a production build |
| `bun run start` | Start the production server |
| `bun run lint` | Run ESLint |
| `bun run registry:build` | Build the component registry |
| `bun run registry:check` | Validate registry source without building |


## Component registry

Registry source is organized by kind under `registry/default/`. Button, Card,
Badge, Alert, Separator, Icon, and Logo are published UI components.

The registry also includes three `registry:lib` utilities: `cn` for class merging,
`clamp` for numeric bounds, and `format-bytes` for binary file sizes. Their
installation commands and examples are available on `/utils`. Utilities install
into the consuming project's configured library directory. `cn` reuses
`registry/default/lib/cn.ts`; the dependency-free helpers also live in `registry/default/lib/`.

```bash
bun run registry:build
bun run dev
```

The build generates `public/r/registry.json` and one JSON file per component.
Production builds regenerate these files automatically. Re-run `registry:build`
after editing a registry component during development.

From a separate project configured with shadcn and Tailwind CSS:

```bash
npx shadcn@latest add http://localhost:3000/r/button.json
npx shadcn@latest add http://localhost:3000/r/card.json
npx shadcn@latest add http://localhost:3000/r/badge.json
npx shadcn@latest add http://localhost:3000/r/alert.json
npx shadcn@latest add http://localhost:3000/r/separator.json
npx shadcn@latest add http://localhost:3000/r/icon.json
npx shadcn@latest add http://localhost:3000/r/logo.json
npx shadcn@latest add http://localhost:3000/r/cn.json
npx shadcn@latest add http://localhost:3000/r/clamp.json
npx shadcn@latest add http://localhost:3000/r/format-bytes.json
```

Use the deployed site URL instead of localhost after publishing. The CLI copies
the source into the consuming project's configured UI directory and installs
`cn` for class merging. Components use the consuming project's shadcn theme
variables; no Lazy UI theme override is installed.

To add a component, create its source, add its files and dependencies to
`registry.json`, add a preview and usage example under `/components`, then run
`bun run registry:build`. Commit the generated `public/r` files with the source.


### Portfolio source collection

Imported sources live in `portfolio/` subfolders within each registry category.
The 68 entries keep their `portfolio-` names in `registry.json`. They have not
been built or published. See [the registry notes](registry/README.md) for the
inventory, dependencies, import changes, and required consumer setup.

Catalog pages are driven by `registry.json`: `/components`, `/blocks`, `/shader`,
and `/utils`. Every entry has a detail route with source files, dependencies, and
setup instructions. Starter components retain live previews. Imported source is
shown as text without loading consumer-only dependencies. `/templates` links to
building blocks; no complete templates have been registered yet.

Run `bun run registry:check` to validate the source schema, category coverage,
package dependencies, and relative imports at both source and install targets.
This check does not build the registry. Generated artifacts in `public/r` remain
unchanged until you explicitly run `registry:build` (or a production build).
