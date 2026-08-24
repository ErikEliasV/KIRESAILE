# KIRESAILE

A women's clothing storefront concept — Next.js, Tailwind CSS, and a real-time
WebGL fragment shader that turns a fabric video into a halftone print.

**Portfolio project — Erik Elias, 2026.**

## Stack

- **Next.js 16** (App Router, Turbopack) + **TypeScript**
- **Tailwind CSS v4**
- **three.js** + **@react-three/fiber** for the fabric shader:
  `<video>` → `THREE.VideoTexture` → `EffectComposer` (`TexturePass` →
  custom `ShaderPass` → `OutputPass`) → `<Canvas>`

## Pages

- `/` — hero, collection wall, the fabric shader section, brand story, newsletter
- `/collection` — filterable, sortable product grid
- `/product/[slug]` — product detail with size selection and a bag

## Getting started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Notes

- Local media in `public/media/` is cache-busted by file mtime
  (`lib/asset-version.ts`) so swapping an image in place always shows up
  immediately, with no server restart needed.
- The internal design system used to build this is not part of this
  repository.
