# George Jabley — Portfolio

Next.js 15 · TypeScript · Tailwind (preflight) · custom CSS authored in px against the 1024px mockup and converted to rem (see `postcss.config.mjs`).

## Run locally
```bash
npm install
npm run dev      # http://localhost:3000
npm run build && npm start
```

## Edit content
All copy lives in `src/data/content.ts`. Images are in `public/images/` (mockup crops — replace with real assets, keeping filenames or updating `content.ts`).

## Deploy to Vercel
**Git (recommended):** push to `techwokx-cloud/george-jabley-portfolio`; the linked Vercel project builds automatically (framework auto-detected: Next.js, no env vars needed).

**Manual:** `npm i -g vercel && vercel --prod` from this folder, or drag the folder (without `node_modules`/`.next`) into the Vercel dashboard "Add New → Project → Upload".
