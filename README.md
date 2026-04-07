# becausebecausebecause.xyz

A daily reflection practice. One video, one prompt, one day at a time.

## Local development

```bash
npm install
npm run dev
```

Then open http://localhost:5173.

## Videos

Video files live in `public/videos/`. Filenames must match the `file` field in the `VIDEOS` array in `src/App.jsx`. They are not committed to git (see `.gitignore`) — for production, host them on Cloudflare R2 or Bunny.net and update the `<video src>` in `App.jsx` to point at the CDN URL.

## Deploy

Push to GitHub, then import the repo on [vercel.com](https://vercel.com). Vercel auto-detects Vite. Add the custom domain in Project → Settings → Domains.

## Build

```bash
npm run build
```

Outputs to `dist/`.
