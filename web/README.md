# Immigration Law Office — Website (Next.js)

Bilingual (English / Español) marketing site built with Next.js (App Router), TypeScript and Tailwind CSS v4.
Migrated from the Vite/React landing page in `../frontend`. There is **no backend server** — every page is
statically prerendered; the only server code is the contact-form Server Action.

## Commands

```bash
npm install
npm run dev     # http://localhost:3000
npm run build
npm run start
npm run lint
```

## Environment variables (see `.env.example`)

| Variable | Scope | Purpose |
|---|---|---|
| `NEXT_PUBLIC_SITE_URL` | public | Production origin for canonical URLs, hreflang, OG, robots and sitemap. **Set before building for production.** |
| `NEXT_PUBLIC_GA_ID` | public | Optional GA4 ID. Analytics is off when empty. |
| `CONTACT_WEBHOOK_URL` | server-only | Where contact submissions are POSTed as JSON. Required in production; without it the form shows an error asking visitors to call. |

## Where things live

```
app/(en)/…            English routes (root layout, lang="en")
app/es/…              Spanish routes with translated slugs (root layout, lang="es")
app/actions/contact.ts  Contact form Server Action (validation + webhook delivery)
app/sitemap.ts, app/robots.ts, app/global-not-found.tsx
components/           Header/footer, homepage sections, page views, form
content/dictionaries/ UI strings and page copy (en.ts, es.ts — es must mirror en)
content/services.ts   Service page content (both languages)
content/legal.ts      Privacy / Terms / Disclaimer / Accessibility DRAFTS
lib/routes.ts         Every URL in both languages (nav, switcher, hreflang, sitemap)
lib/site.ts           Firm facts: name, phone, address, attorney, bar admissions
lib/seo.ts            Per-page metadata (canonical, hreflang, Open Graph, Twitter)
lib/structured-data.ts  JSON-LD (LegalService, Attorney, BreadcrumbList)
```

Adding or removing a service: edit `serviceSlugs` in `lib/routes.ts` and the matching entry in `content/services.ts`.

## Before launch checklist

- [ ] Set `NEXT_PUBLIC_SITE_URL` to the real domain and `CONTACT_WEBHOOK_URL` in production.
- [ ] Replace placeholders in `lib/site.ts` (phone, email, address, attorney name, bar admissions), then set `contact.verified = true`.
- [ ] Attorney bio in `content/dictionaries/{en,es}.ts` (search `TODO(attorney)`).
- [ ] Testimonials are the previous site's placeholders — replace with real, permitted ones or remove.
- [ ] Attorney review of all legal drafts in `content/legal.ts`, form disclaimer and footer notice (both languages); then remove the draft banner (`DraftNotice` in `components/pages.tsx`).
- [ ] Confirm the list of services matches what the firm actually offers.
- [ ] Replace stock photos in `public/images/` with real office/attorney photos if available.
