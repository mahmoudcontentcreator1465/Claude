# Different: travel & tourism portfolio

Bilingual (English / Arabic) portfolio site for **Different**, a creative marketing agency for travel
and tourism brands. Built with Next.js 16 (App Router), TypeScript, Tailwind CSS v4, Motion and next-intl.

- `/en/...` English (LTR), `/ar/...` Arabic (RTL). `/` redirects to the visitor's language and remembers the choice.
- Pages: Home · About · Our Clients · Our Work · Case study (`/work/[slug]`) · Services · Contact.
- Everything is statically generated except the contact form's server action.

## Development

```bash
npm install
npm run dev        # http://localhost:3000 (drafts are always visible in dev)
npm run lint
npx tsc --noEmit   # type check
npm run build && npm start
```

Node 20.9+ is required.

## Deploying to Vercel

The site lives at the repository root, and `vercel.json` pins the Next.js framework and build
commands, so the Vercel project needs no special settings (leave **Root Directory** empty).
`.vercelignore` keeps the repository's other projects (`ramadan-real-estate/`, `.agents/`) out of the upload.

1. Push a branch: every pull request gets a Preview deployment automatically.
2. Preview deployments show Draft / Pending content (with badges) so it can be reviewed;
   Production never does. Previews are also `noindex` via `robots.txt`.
3. Before launch, add `NEXT_PUBLIC_SITE_URL` (the final domain, e.g. `https://www.different.agency`)
   and, when ready, the contact-form variables from `.env.example`.

## Content model (no component changes needed)

All content lives in `src/content/`:

| File | Holds |
|---|---|
| `clients.ts` | Client list: `id, slug, name{en,ar}, logo, logoAlt?, services[], featured, order, caseStudies[], status` |
| `case-studies.ts` | Case studies, fully bilingual, with gallery and optional verified `results` |
| `services.ts` | The eight proposed services, all `draft` until confirmed |
| `site.ts` | Email, WhatsApp and social links (currently **placeholders**) |
| `types.ts` | The types for all of the above |

Every item has a `status`:

- `published`: live everywhere.
- `draft` / `pending`: visible only in `npm run dev`, on Vercel Preview deployments, or with `SHOW_DRAFT_CONTENT=true`, always
  with a visible *Draft* / *Pending* badge. Hidden on the live site.

Navigation, the sitemap, the home page section numbers and the contact form's service list all
adapt automatically to what's published (e.g. the Services link appears only once a service is published).

### Adding or updating client logos

1. Put the original file in `src/assets/clients/` (keep the original filename; never edit the artwork).
2. In `src/content/clients.ts`, import it and add an entry:
   ```ts
   import acmeLogo from "@/assets/clients/acme-travel.png";
   { id: "acme-travel", slug: "acme-travel", name: { en: "Acme Travel", ar: "أكمي للسياحة" },
     logo: { image: acmeLogo, treatment: "transparent-on-light" }, services: [], featured: true,
     order: 50, caseStudies: [], status: "published", source: "acme-travel.png" }
   ```
3. `treatment` controls the card:
   `artwork` = file has its own background (shown whole, uncropped),
   `transparent-on-light` = transparent file with dark marks (white card, padded),
   `transparent-on-dark` = transparent file with light marks (black card, padded).
4. Reorder with `order`; hide with `status: "draft"`. `featured` controls the home page selection.

The asset inventory and open questions are in `src/assets/clients/INVENTORY.md`.
**The client list is not final yet**: all current entries are `pending`.

### Adding a case study

1. Put images in `src/assets/work/<slug>/` and import them (they get width/height and blur placeholders automatically).
2. Copy one of the entries in `src/content/case-studies.ts` and fill in every field in both languages.
   Visuals can be `image`, `video` (`src` in `public/`), `embed` (YouTube/Vimeo/Instagram URL) or `art`.
3. Link it to its client with `clientId`, and add its slug to that client's `caseStudies`.
4. Only add `results` with figures the client has verified. The Results section doesn't render without them.
5. Set `status: "published"`. The page, sitemap entry and structured data are generated at build time.

The three current case studies are **placeholder templates** (`draft`), not real projects.

### Publishing services

In `src/content/services.ts`, change a service's `status` to `"published"`.

### Contact details

Edit `src/content/site.ts`: replace the value and remove `placeholder: true`. For WhatsApp also set
`number` in international format without `+` (e.g. `"201001234567"`) to enable the wa.me link.

## Contact form

`src/app/actions/contact.ts` (Server Action), with validation in `src/lib/contact-schema.ts`
(shared by browser and server) and delivery in `src/lib/contact-delivery.ts`.

- Validation: name, company, email and message (20–3000 characters) are required; phone and service are optional.
- Spam protection: hidden honeypot field, minimum fill time, per-IP rate limit (5 per 10 min, per
  server instance), and optional Cloudflare Turnstile.
- **Delivery is off.** Until `CONTACT_DELIVERY_ENABLED=true` and `RESEND_API_KEY`, `CONTACT_TO_EMAIL`
  and `CONTACT_FROM_EMAIL` are set, submissions are validated and the visitor is told plainly that the
  message was *not* sent, and pointed to email/WhatsApp.

To turn it on:
1. Create a Resend account, verify the sending domain, create an API key.
2. Set the four variables above in Vercel and redeploy.
3. Send a test inquiry from the live site. Replies go straight to the visitor (`replyTo`).

For strict rate limiting across all serverless instances, replace `src/lib/rate-limit.ts` with a shared
store such as Upstash Redis (same function signature).

## Design system

- Colours (`src/app/globals.css`): teal `#1ABC9C` (sampled from the logo) for shapes and dark sections;
  `#138D75` for large teal text on light backgrounds (3.8:1); `#0B7263` for small teal text (5.8:1);
  ink `#111111`; paper `#F5F7F6`.
- Type: Plus Jakarta Sans (English), Alexandria (Arabic display) + IBM Plex Sans Arabic (Arabic text),
  self-hosted via `next/font`. Scale: `.t-display`, `.t-h1`, `.t-h2`, `.t-h3`, `.t-lead`, `.t-label`,
  with dedicated Arabic metrics (no negative tracking, taller line height).
- Motion: scroll reveals are CSS driven by one IntersectionObserver (`RevealObserver`); Motion for React
  handles the header, mobile menu, hero postcards, route lines and the desktop-only cursor.
  Everything respects `prefers-reduced-motion`.

## Other scripts

- `node scripts/generate-og.mjs` re-renders `public/og/og-en.png` and `og-ar.png` (needs
  `playwright-core` and Chromium; set `CHROMIUM_PATH` if it isn't at `/opt/pw-browsers/chromium`).
