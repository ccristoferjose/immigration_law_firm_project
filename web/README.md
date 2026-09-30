# FarFan Law Firm — Website (Next.js)

Bilingual (Español first / English) marketing site built with Next.js (App Router), TypeScript and Tailwind CSS v4.
Migrated from the Vite/React landing page in `../frontend`. The site is a **static export** (`output: 'export'`)
deployed to GitHub Pages — there is no server. The contact form validates in the browser and shows a
"demo, please call" notice; it is not connected to any endpoint yet.

## Commands

```bash
npm install
npm run dev     # http://localhost:3000
npm run build
npm run start
npm run lint
```

## Environment variables (see `.env.example`)

| Variable | Purpose |
|---|---|
| `NEXT_PUBLIC_SITE_URL` | Public origin + path for canonical URLs, hreflang, OG, robots and sitemap. |
| `NEXT_PUBLIC_BASE_PATH` | Sub-path the site is served from (e.g. `/immigration_law_firm_project`). Empty for a domain root. |
| `NEXT_PUBLIC_NOINDEX` | `true` adds `noindex` to every page (used for the demo deployment). |
| `NEXT_PUBLIC_GA_ID` | Optional GA4 ID. Analytics is off when empty. |

## Deployment (GitHub Pages, branch deploy)

`.github/workflows/deploy-pages.yml` runs on every push to `main` that touches `web/` (or manually from the
Actions tab). It builds the static export and force-pushes `web/out/` to the `gh-pages` branch.
In the repository settings, **Pages → Build and deployment → Source: Deploy from a branch → `gh-pages` / `(root)`**.

Preview the exact Pages build locally:

```bash
NEXT_PUBLIC_BASE_PATH=/immigration_law_firm_project npm run build
mkdir -p /tmp/pages && ln -sfn "$PWD/out" /tmp/pages/immigration_law_firm_project
cd /tmp/pages && python3 -m http.server 8000   # http://localhost:8000/immigration_law_firm_project/
```

Static hosting limits: no custom headers (the CSP is a `<meta>` tag in `lib/csp.ts`; GitHub Pages enforces HTTPS),
no redirects, no server code, and images are served unoptimized.

## Where things live

```
app/(es)/…            Spanish routes, primary language, served at / (root layout, lang="es")
app/en/…              English routes under /en (root layout, lang="en")
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

- [ ] Connect the contact form (e.g. a form service or a backend) in `components/ContactForm.tsx` — submissions should land in a system the firm controls — and name the provider in the privacy policy.
- [ ] Real domain: set `NEXT_PUBLIC_SITE_URL`, clear `NEXT_PUBLIC_BASE_PATH` and `NEXT_PUBLIC_NOINDEX` in the deploy workflow.
- [x] Firm name, phone, address and service area in `lib/site.ts` (`contact.verified = true`).
- [ ] Add a public email in `lib/site.ts` (`contact.email`; hidden while `null`) and confirm office hours.
- [ ] Attorney review and approval of all legal pages in `content/legal.ts`, the form disclaimer, the footer notice and the marketing claims (both languages); then remove the draft banner (`DraftNotice` in `components/pages.tsx`).
- [ ] Confirm the list of services matches what the firm actually offers.
- [ ] Replace stock photos in `public/images/` with real office/attorney photos if available (captions currently make no claim that they show the firm).
- [ ] MFA on the GitHub, domain, analytics and form-delivery accounts; spam protection once the form is connected.
- [ ] Manual accessibility pass: VoiceOver/NVDA, 200% and 400% zoom, keyboard-only use of the mobile menu, carousel and form.

## Security notes

- The Content Security Policy lives in `lib/csp.ts` (a `<meta>` tag, since GitHub Pages cannot send headers). If you add a third-party script, iframe or API, add its origin there.
- Never add advertising pixels, session recording or heatmaps without updating the privacy policy.
