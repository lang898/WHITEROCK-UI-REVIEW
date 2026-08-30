# WHITEROCK Studio Hybrid

Static React and Vite website for WHITEROCK COMPANY LIMITED.

## Local development

Requirements: Node.js 20 or newer.

```bash
npm install
npm run dev
```

No API key or server-side runtime is required.

## Production build

```bash
npm run build
```

Publish the generated `dist/` directory. For Cloudflare Pages use:

- Build command: `npm run build`
- Build output directory: `dist`
- Environment variables: none required

The Vite build creates static fallback entry files for the public routes and `/admin/`.
