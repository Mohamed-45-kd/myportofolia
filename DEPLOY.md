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

## Known limitation on Vercel

Vercel's serverless filesystem is read-only and ephemeral, so on the live site:

- The public portfolio works fully. Content is baked in at build time from
  `src/content/*.ts`.
- **Dashboard edits will not persist.** They appear to work for the current
  request, then vanish.
- **Contact messages will not be stored.** The form tells the visitor to email
  instead rather than pretending it worked.

To make the dashboard fully work in production, either deploy somewhere with a
persistent disk (Railway, Render, a VPS), or connect Supabase by replacing
`readDatabase` / `writeDatabase` in `src/lib/db.ts`. Everything already goes
through `src/lib/repo.ts`, so nothing else changes.

For today's deadline: deploy as-is. The public site — which is what visitors
see — is complete and correct. Edit content in `src/content/*.ts` and redeploy
until the database is connected.
