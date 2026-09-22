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
