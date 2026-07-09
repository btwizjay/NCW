# Handover Guide — Nilantha Cushion Works

Everything a new owner/developer needs to take this site to production.
The site runs fine with **zero** environment variables (it falls back to the
hardcoded content in `content/` and points booking/enquiry users to WhatsApp).
Each integration below switches on independently once its variables are set.

## 1. Quick start

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # production build (stop the dev server first)
```

> ⚠️ Never run `npm run build` while `npm run dev` is running — both write to
> `.next/` and corrupt each other. If the dev server shows a
> `Cannot read properties of undefined (reading 'call')` error after files
> were added, stop it, delete `.next/`, and start it again.

## 2. Environment variables

Copy `.env.example` to `.env.local` for development. In production, set the
same keys in **Vercel → Project → Settings → Environment Variables**.

**Leave a variable blank until you have its real value.** Any non-empty
`NEXT_PUBLIC_SANITY_PROJECT_ID` is treated as real and an invalid one crashes
the Sanity client at runtime.

### Sanity CMS (catalogue content + booking storage + /studio)

| Key | Where to get it |
|---|---|
| `NEXT_PUBLIC_SANITY_PROJECT_ID` | [sanity.io/manage](https://sanity.io/manage) → create a project → Project ID on the overview |
| `NEXT_PUBLIC_SANITY_DATASET` | `production` (created with the project) |
| `NEXT_PUBLIC_SANITY_API_VERSION` | `2024-10-01` |
| `SANITY_API_WRITE_TOKEN` | Manage → API → Tokens → Add token, scope **Editor**. Server-only secret; enables booking persistence |

Also add CORS origins in Manage → API → CORS: `http://localhost:3000` and the
production URL. Without a project, `/studio` won't load and bookings return
"not configured" (the UI then routes customers to WhatsApp).

Schemas live in `sanity/schemas/` (brand, vehicleModel, product, booking).
Booking workflow actions (confirm / complete / WhatsApp reminder / cancel)
appear on booking documents inside the Studio.

### Resend (booking + enquiry emails)

| Key | Notes |
|---|---|
| `RESEND_API_KEY` | [resend.com](https://resend.com) → API Keys |
| `BOOKING_EMAIL_FROM` | Sender, e.g. `Nilantha Cushion Works <bookings@yourdomain>`. The domain must be verified in Resend (DNS records). While testing use `onboarding@resend.dev` |
| `BOOKING_NOTIFICATION_EMAIL` | Where new-booking alerts go. Defaults to the business email in `content/business.ts` |
| `ENQUIRY_NOTIFICATION_EMAIL` | Where contact-form enquiries go. Falls back to `BOOKING_NOTIFICATION_EMAIL` |

Email sends are best-effort: failures are logged, bookings are never lost
because email hiccupped.

### Site / cron

| Key | Notes |
|---|---|
| `NEXT_PUBLIC_SITE_URL` | Public production URL, used in email links |
| `CRON_SECRET` | Any long random string. Protects `/api/cron/reminders`. Vercel sends it automatically as a Bearer token on scheduled runs (`vercel.json` schedules 09:00 Sri Lanka time daily) |

### Google Calendar (optional booking push)

| Key | Notes |
|---|---|
| `GOOGLE_SERVICE_ACCOUNT_EMAIL` | Google Cloud → create project → enable **Calendar API** → create service account |
| `GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY` | From the service account's JSON key. One line, literal `\n` for newlines |
| `GOOGLE_CALENDAR_ID` | Share the target calendar with the service-account email ("Make changes to events"); ID is in the calendar's settings |

When unset, bookings simply skip the calendar step.

## 3. Content that lives in code

| What | Where |
|---|---|
| Phone, WhatsApp, email, address, hours, social links | `content/business.ts` (single source of truth — header, footer, contact page, JSON-LD and emails all read from it) |
| Services (6) | `content/services.ts` |
| Fallback catalogue products | `content/products.ts` (used only when Sanity is not configured) |
| Brands + logos + popular models | `content/brands.ts`, images in `public/brands/` |
| Testimonials | `content/testimonials.ts` |
| About-page archival photos | `public/images/about/first-workshop.jpg`, `founder-1990s.jpg`. The founder portrait goes to `public/images/about/founder.jpg` — the page shows a placeholder frame until the file exists |
| Booking slots / capacity / closed days | `lib/booking/config.ts` |

## 4. Deploy (Vercel)

1. Import the GitHub repo (`btwizjay/NCW`) into Vercel.
2. Framework preset: Next.js. No special build settings needed.
3. Add the environment variables (Production scope).
4. `vercel.json` already schedules the reminder cron.

## 5. Architecture notes

- Next.js 15 App Router; pages are server components, interactivity lives in
  client components (`components/**`).
- Lenis smooth scrolling is initialised in `components/SmoothScroll.tsx` and
  shared through `lib/lenis.ts` (the services page uses it for glide-to-anchor).
- Booking flow: `app/book` → `POST /api/booking` → Sanity (capacity re-checked
  before create) → best-effort emails + Google Calendar. Self-service
  reschedule/cancel via tokenised links (`/book/manage/[token]`).
- Catalogue: `/catalogue/[brand]/[model]/[item]` with Sanity data and local
  fallbacks; old query-string URLs redirect.

---
Project by [Ascendit Media](https://www.ascendit.dev).
