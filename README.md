# Mohamed Weli Jama — Personal Developer Platform

The public portfolio for **Mohamed Weli Jama**, Software Developer & Web Developer.

> **My mission is to digitalize our Country.**

Built to the specification in
`Mohamed_Weli_Jama_Personal_Developer_Platform_Documentation_v1.0 (1).docx`
and styled entirely from the supplied **Mohamed Weli Jama Design System** — its
colour, type, spacing, radius, elevation and motion tokens are ported verbatim
into `src/app/globals.css`.

---

## Running it

```bash
npm install
npm run dev
```

Then open the URL printed in the terminal (http://localhost:3000 unless that
port is taken).

| Command | What it does |
| --- | --- |
| `npm run dev` | Development server with hot reload |
| `npm run build` | Production build (all pages prerendered) |
| `npm start` | Serve the production build |
| `npm run typecheck` | TypeScript, no emit |
| `npm run lint` | Next.js lint |
| `npm run admin:password` | Generate the dashboard credentials |

---

## What is here

All eight phases of the documentation's plan: the foundation, the public
portfolio, admin authentication, the project CMS, the content CMS, blog and
message management, the polish/SEO pass, and the production hardening.

Public pages are statically prerendered and revalidated when the dashboard
changes them. Dashboard pages are server-rendered per request and never cached.

| Route | Page |
| --- | --- |
| `/` | Home — hero, mission, featured projects, skills, achievements, services, contact CTA |
| `/about` | Profile, the mission section (`#mission`), the ICT Club background |
| `/skills` | The five skill groups from §10, with meters |
| `/projects` | Filterable project gallery |
| `/projects/[slug]` | Full case study — problem, solution, features, challenges, results |
| `/services` | The six services from §17, plus how a project runs |
| `/journey` | Experience (`#experience`), education (`#education`), achievements (`#achievements`) |
| `/blog` | Blog index |
| `/blog/[slug]` | Post |
| `/contact` | Validated contact form plus direct channels |
| `/sitemap.xml`, `/robots.txt`, `/opengraph-image` | SEO |

### Dashboard (private)

| Route | Page |
| --- | --- |
| `/admin/login` | Sign in |
| `/admin` | Overview — counters, recent projects, recent messages |
| `/admin/projects` | Project list: publish, feature, edit, delete |
| `/admin/projects/new`, `/admin/projects/[id]` | Full project editor including the case study |
| `/admin/technologies` | Reusable technology list |
| `/admin/services`, `/admin/skills`, `/admin/experience`, `/admin/education`, `/admin/achievements` | Ordered content, with reordering |
| `/admin/blog`, `/admin/blog/new`, `/admin/blog/[id]` | Blog management |
| `/admin/messages` | Contact inbox — New / Read / Replied |
| `/admin/settings` | Identity, mission, contact channels, CV |

`/experience`, `/education`, `/achievements` and `/mission` redirect to the
corresponding section anchors.

---

## Signing in to the dashboard

Generate the credentials once:

```bash
npm run admin:password
```

It prompts for a password (hidden), then prints three lines. Put them in
`.env.local` and set `ADMIN_EMAIL` to the address you will sign in with:

```
ADMIN_EMAIL="you@example.com"
ADMIN_PASSWORD_HASH="scrypt:..."
AUTH_SECRET="..."
```

Restart the server and sign in at `/admin/login`. The password itself is never
stored — only its scrypt hash, which the password cannot be recovered from.
Changing `AUTH_SECRET` signs every existing session out.

> The separator in the hash is a colon, not `$`. Next.js expands `$` inside
> `.env` files, which silently corrupts the value.

---

## Editing the content

Everything on the public site is editable from the dashboard: projects and their
case studies, technologies, services, skills, experience, education,
achievements, blog posts, the mission and contact details. Saving revalidates
the affected public pages, so a change is live immediately.

### Where the data lives

| Layer | File | Role |
| --- | --- | --- |
| Store | `data/content.json` | The live content. Created on first run; gitignored. |
| Seed | `src/content/*.ts` | The initial content, and a readable record of it. |
| Access | `src/lib/repo.ts` | The only module that reads or writes content. |
| Storage | `src/lib/db.ts` | Where the JSON is read and written. |

`src/content/*.ts` seeds the store the first time a page loads and is not
consulted again. **Deleting `data/content.json` reseeds from those files** — a
clean reset, and also how you discard test data. Stored contact messages live in
that same file and are not recoverable afterwards.

### Moving to Supabase

`db.ts` is the seam. Replace `readDatabase` and `writeDatabase` with queries, or
replace the individual functions in `repo.ts` with per-table queries — the
better shape once the data is relational. Nothing else changes: every page and
every action already goes through `repo.ts`. `src/lib/auth.ts` is the equivalent
seam for Supabase Auth: `getSession` and `requireAdmin` are the only two
functions the rest of the application calls.

### Project images

Image slots render the design system's deliberate blueprint-grid `SCREENSHOT`
placeholder until a real capture exists. To add one, put the file in `public/`
and reference it by path in the project editor's Gallery field.

---

## Before this goes live

The dashboard's Settings page covers the contact channels and the mission. The
rest are values the documentation did not specify — search `src/content/` for
`TODO`:

1. **Contact handles** — email, WhatsApp number and LinkedIn URL are
   placeholders. Edit them in Settings.
2. **Technology stacks, dates and repository links** on each project.
3. **Employment history** — the documentation gave the education and the ICT
   Club but no job history, so the experience entries describe the project work
   and need real roles and dates.
4. **Skill percentages** — the one judgement call on the site.
5. **`NEXT_PUBLIC_SITE_URL`** — set the real domain. Canonical URLs, the sitemap
   and Open Graph tags all read it.
6. **CV** — drop the PDF into `public/` and switch the CV toggle on in Settings.

---

## Security

The measures in place, against §23 of the documentation:

- **Passwords** are hashed with scrypt and compared in constant time. The
  sign-in failure message never distinguishes a wrong address from a wrong
  password, so it cannot be used to discover the admin address.
- **Sessions** are httpOnly, `SameSite=Lax`, `Secure` in production cookies
  carrying an HMAC over the subject and expiry. They cannot be forged or
  extended without `AUTH_SECRET`.
- **Sign-in attempts** are throttled per client address; contact-form
  submissions are limited to five per hour per address.
- **Middleware is not the security boundary.** It runs on the edge runtime and
  only checks that a cookie is present and well-formed, as a fast redirect.
  The real check is `requireAdmin()`, which verifies the signature — it runs in
  the dashboard layout and again inside **every** server action, because server
  actions are independently reachable HTTP endpoints.
- **All writes are validated server-side**, including slug format and
  uniqueness. Collection and field names arriving from a form are checked
  against an allowlist.
- **JSON-LD is escaped**, not just `JSON.stringify`d. Now that titles and
  excerpts are editable, unescaped `<` in a `<script>` block would be a stored
  XSS vector; `src/lib/jsonld.ts` escapes `<`, `>`, `&`, U+2028 and U+2029.
- **`/admin` is excluded from `robots.txt`**, and every dashboard page sends
  `noindex` and is rendered per request rather than cached.
- **Secrets stay in `.env.local`**, which is gitignored, and never reach the
  browser.

---

## Deploying

```bash
npm run build
```

Set these in the host's environment settings: `NEXT_PUBLIC_SITE_URL`,
`ADMIN_EMAIL`, `ADMIN_PASSWORD_HASH`, `AUTH_SECRET`.

**One thing to decide before production.** The content store is a JSON file. It
works on any host with a writable disk — a VPS, a container, a Node server — but
a serverless filesystem is read-only and ephemeral, so on Vercel's serverless
runtime dashboard edits are lost and contact messages are never stored. The
dashboard detects this and shows a banner rather than pretending a save worked.

So either deploy somewhere with a persistent disk, or connect Supabase first by
replacing the two functions in `db.ts`. The seed data and the schema are already
shaped for it.

---

## Design system notes

Tokens are ported unchanged. Two deliberate additions, both to satisfy the
design system's own accessibility rule (body text clears 4.5:1):

- `--text-accent` — an accent for text and icons that deepens from `#00C2FF` to
  `#0066FF` in the light theme. `--brand-accent` stays a fixed brand value.
- Light-theme status colours are deepened, because the dark-theme green, amber
  and red are tuned for a near-black ground and fall below 4.5:1 on white.

Icons are drawn inline in `src/components/ui/Icon.tsx` at Lucide's 1.75px
stroke, rather than loaded from a CDN, so the site ships no icon runtime.

A copy of the design system's tokens and guideline cards is in
`docs/design-system/` for reference.
#   m y p o r t o f o l i a  
 