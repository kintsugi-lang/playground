# Kintsugi Playground

Web playground for the Kintsugi language. Compiles Kintsugi source to Lua in the browser.

## Prerequisites

Build the Nim JS bundle first (from `../kintsugi/`):

```
nim js -d:release --outdir:web src/kintsugi_js.nim
```

## Development

```
npm install
npm run dev
```

`npm run dev` runs `sync-bundle.sh` automatically, which copies the Nim JS bundle and logo into `public/`.

## Production build

```
npm run build
npm run preview
```

The `dist/` directory is a deployable static site.
