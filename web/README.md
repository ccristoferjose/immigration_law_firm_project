# FarFan Law Firm — Website (Next.js)

Bilingual (Español first / English) marketing site built with Next.js (App Router), TypeScript and Tailwind CSS v4.
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
app/(es)/…            Spanish routes, primary language, served at / (root layout, lang="es")
app/en/…              English routes under /en (root layout, lang="en")
app/actions/contact.ts  Contact form Server Action (validation + webhook delivery)
app/sitemap.ts, app/robots.ts, app/global-not-found.tsx
components/           Header/footer, homepage sections, page views, form
content/dictionaries/ UI strings and page copy (en.ts, es.ts — es must mirror en)
content/services.ts   Service page content (both languages)
content/legal.ts      Privacy / Terms / Disclaimer / Accessibility DRAFTS
lib/routes.ts         Every URL in both languages (nav, switcher, hreflang, sitemap)
lib/site.ts           Firm facts: name, phone, address, service area, map links, bar admissions
lib/seo.ts            Per-page metadata (canonical, hreflang, Open Graph, Twitter)
lib/structured-data.ts  JSON-LD (LegalService, Attorney, BreadcrumbList)
```

Adding or removing a service: edit `serviceSlugs` in `lib/routes.ts` and the matching entry in `content/services.ts`.

## Before launch checklist

- [ ] Set `NEXT_PUBLIC_SITE_URL` to the real domain and `CONTACT_WEBHOOK_URL` in production. Submissions should land in a system the firm controls (practice-management software or secure email), not a generic spreadsheet.
- [x] Firm name, phone, address and service area in `lib/site.ts` (`contact.verified = true`).
- [ ] Add a public email in `lib/site.ts` (`contact.email`; hidden while `null`) and confirm office hours.
- [ ] Attorney review and approval of all legal pages in `content/legal.ts`, the form disclaimer, the footer notice and the marketing claims (both languages); then remove the draft banner (`DraftNotice` in `components/pages.tsx`).
- [ ] Confirm the list of services matches what the firm actually offers.
- [ ] Replace stock photos in `public/images/` with real office/attorney photos if available (captions currently make no claim that they show the firm).
- [ ] Hosting: enable HTTPS, host-level rate limiting / bot protection, and MFA on hosting, domain, analytics and form-delivery accounts.
- [ ] Manual accessibility pass: VoiceOver/NVDA, 200% and 400% zoom, keyboard-only use of the mobile menu, carousel and form.

## Security notes

- Security headers (CSP, HSTS, X-Frame-Options, etc.) are set in `next.config.ts`. If you add a new third-party script, iframe or API, add its origin to the CSP there.
- The contact form is rate limited in memory (`lib/rate-limit.ts`, 5 submissions / 10 min per IP). This is per server instance, so also enable rate limiting at the host.
- Never add advertising pixels, session recording or heatmaps without updating the privacy policy.
