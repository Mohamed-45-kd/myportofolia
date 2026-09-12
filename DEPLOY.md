# Deploying

## Fastest route — Vercel CLI (no GitHub repo needed)

From this folder:

```bash
npx vercel login
npx vercel --prod
```

`login` opens your browser — you have to do that step yourself. Accept the
defaults when `vercel` asks; it detects Next.js automatically.

## Environment variables

Set these in the Vercel dashboard (Project → Settings → Environment Variables),
or you will not be able to sign in to the dashboard on the live site:

| Variable | Value |
| --- | --- |
| `NEXT_PUBLIC_SITE_URL` | your live URL, e.g. `https://mohamedwelijama.vercel.app` |
| `ADMIN_EMAIL` | the address you sign in with |
| `ADMIN_PASSWORD_HASH` | copy from your local `.env.local` |
| `AUTH_SECRET` | copy from your local `.env.local` |

Copy the last two out of `.env.local` — do not regenerate them unless you want
a different password.

After adding them, redeploy: `npx vercel --prod`

## Making the dashboard save (required for the CMS to work live)

Vercel has no writable disk, so without a database the dashboard cannot persist
anything. Connecting one takes about a minute:

1. Vercel dashboard → your project → **Storage**
2. **Create Database** → **Neon (Postgres)** → **Connect**
3. Redeploy: `npx vercel --prod`

That injects `POSTGRES_URL` automatically — nothing to copy by hand. On the
first dashboard load the app creates its table and copies the current content
into it, so nothing is lost.

To confirm a connection string works before deploying:

```bash
npm run db:check
```

It connects, creates the table, writes a probe row, reads it back and deletes
it, then tells you exactly what failed if anything did.

### Any other Postgres works too

Supabase, Railway, Render or your own server: set `DATABASE_URL` to the
connection string. The app checks `DATABASE_URL`, `POSTGRES_URL`,
`POSTGRES_PRISMA_URL` and `POSTGRES_URL_NON_POOLING`, in that order.

TLS verification is relaxed by default because managed poolers commonly present
chains that fail strict verification. If your provider has a properly verifiable
certificate, set `DATABASE_SSL_STRICT=true` to tighten it.

### How the data is stored

The whole content document lives in one JSONB row in a table called
`app_state`. That is a deliberate shortcut rather than the relational schema in
§25 of the documentation: no migrations, no ORM, and `repo.ts` did not change,
so the dashboard started persisting immediately. Writes run inside a
transaction with `SELECT ... FOR UPDATE`, so concurrent edits queue rather than
overwrite. Splitting it into real tables is still worth doing later, and stays a
contained change because everything goes through `repo.ts`.

## Local development

With no connection string set, the app uses `data/content.json` on disk. That
keeps a fresh clone working with zero setup. Set `DATABASE_URL` locally if you
want to develop against the same database the live site uses.
