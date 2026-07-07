# Nilantha Cushion Works — Website

Premium marketing site for Nilantha Cushion Works (Pasyala, Sri Lanka). Built with Next.js 15, TypeScript and Tailwind CSS.

## Quick start

```bash
npm install
npm run dev
```

Open <http://localhost:3000>.

## Project layout

```
app/                Next.js App Router pages, API routes, sitemap, robots
components/         UI primitives, layout, page sections, forms
content/            Typed content (business info, services, products, brands, testimonials)
lib/                Helpers (SEO metadata, WhatsApp link, classnames)
public/             Static assets (drop real photos and logo here)
```

All editable text and product data lives under `content/`. Replace placeholder values
there before launch.

## Replacing placeholder assets

- **Photos**: external Unsplash and picsum URLs are used during development.
  Replace each `image:` field in [content/services.ts](content/services.ts) and
  [content/products.ts](content/products.ts) with paths to files in
  `public/images/...` (e.g. `/images/products/toyota-hiace-set.jpg`).
- **Logo**: edit [components/layout/Logo.tsx](components/layout/Logo.tsx).
- **Business contact info**: edit [content/business.ts](content/business.ts).
- **Map**: replace `mapEmbedUrl` in `content/business.ts` with the embed URL of
  the workshop's Google Maps location.

## Forms

`/api/booking` and `/api/enquiry` currently log to the server console. To deliver
to a real inbox, plug in Resend, Postmark or a Google Sheets webhook in those
two route files — the frontend already submits valid JSON.

## Deploy

Vercel (recommended) — push to GitHub and import. No env vars are required for
the placeholder build.
