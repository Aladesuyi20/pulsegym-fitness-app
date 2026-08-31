# Deploying PulseGym

This is a **TanStack Start** app (React 19 + Vite + SSR). It needs a server
runtime — a plain "static site" host will show a blank page.

## 1. Set up your environment variables

Copy `.env.example` to `.env` and fill it in. At minimum you need the
Supabase variables. See `.env.example` for full details on every variable —
summary below.

| Variable | Required | Purpose |
|---|---|---|
| `SUPABASE_URL` / `VITE_SUPABASE_URL` | Yes | Your Supabase project URL |
| `SUPABASE_PUBLISHABLE_KEY` / `VITE_SUPABASE_PUBLISHABLE_KEY` | Yes | Public/publishable Supabase key (safe in the browser) |
| `SUPABASE_PROJECT_ID` / `VITE_SUPABASE_PROJECT_ID` | Yes | Your Supabase project ref |
| `SUPABASE_SERVICE_ROLE_KEY` | Only if you use `client.server.ts` admin ops | Server-only, bypasses RLS — never expose to the browser |
| One of `LOVABLE_API_KEY`, `OPENAI_API_KEY`, `GEMINI_API_KEY`/`GOOGLE_API_KEY`, `ANTHROPIC_API_KEY` | Yes, for the AI chat coach | Powers `/member`'s AI Health Coach — the app auto-detects which one you set |
| `AI_PROVIDER` | No | Force a specific provider if you've set more than one key |

The Supabase project already wired into this app (`mjgbgisdlgsxuvyubptm`) has
the `profiles`, `chat_threads`, and `chat_messages` tables from
`supabase/migrations/` already applied. If you point this app at a different
Supabase project, run those migrations there first (Supabase dashboard ->
SQL Editor, or `supabase db push` with the Supabase CLI).

## 2. Choose an AI provider for the chat coach

`src/lib/ai-provider.ts` auto-detects a provider from whichever key you set.
You don't need a Lovable account — any one of these works:

- **OpenAI** — set `OPENAI_API_KEY` (get one at platform.openai.com)
- **Google Gemini** — set `GEMINI_API_KEY` (get one at aistudio.google.com)
- **Anthropic Claude** — set `ANTHROPIC_API_KEY` (get one at console.anthropic.com)
- **Lovable AI Gateway** — set `LOVABLE_API_KEY` (only if staying on Lovable Cloud)

If the chat feature isn't essential to your launch, you can skip this — the
rest of the site works fine, and the chat panel will just show a clear error
message asking you to configure a provider instead of crashing.

## 3. Sign-in method

This app uses email/password sign-up only (Google sign-in was removed for
simplicity). One thing to know if this Supabase project is Lovable
Cloud-managed (i.e. you never created it yourself on supabase.com): the
Auth "Site URL" that confirmation-email links redirect to is not currently
editable from the Lovable UI — this is a known gap, not something in your
project's code. In practice this just means the confirmation link may land
on the wrong page after clicking it; the account is still confirmed
server-side regardless, so logging in manually afterward works fine. If you
want this fully fixed, that requires reaching Lovable support, or migrating
to your own Supabase project (Settings -> API on supabase.com), where you'd
set Site URL yourself under Authentication -> URL Configuration.

## 4. Deploy

### Vercel (recommended)

1. Push this folder to GitHub.
2. In Vercel: **Add New → Project → Import** the repo.
3. Leave everything at the defaults. `vercel.json` already sets:
   - Framework preset: **Other** (`framework: null`)
   - Build command: `npm run build`
   - Output directory: `.vercel/output`
4. Add the environment variables from step 1 (Production + Preview).
5. Deploy. Node 22 is the recommended runtime version.

`vite.config.ts` picks the Nitro build target automatically:
- Plain local `npm run build` -> `node-server` preset (works with `npm run preview` out of the box).
- Vercel's build (`VERCEL=1` set automatically by Vercel) -> `vercel` preset.
- Anything else -> override explicitly, see "Other hosts" below.

This is why an earlier deploy elsewhere may have shown a blank page: without
this, the underlying config's own default is a Cloudflare Worker bundle,
which isn't what Vercel or a plain Node host expects.

### Other hosts

Set `NITRO_PRESET` before building:

```bash
NITRO_PRESET=netlify      npm run build   # Netlify
NITRO_PRESET=node-server  npm run build   # any Node host (Render/Railway/VPS)
NITRO_PRESET=cloudflare-module npm run build  # Cloudflare Workers/Pages
```

Local production preview: `npm run build && npm run preview`. The `preview`
script runs the built Nitro server directly (`node .output/server/index.mjs`)
on port 3000 — the `vite preview` command that ships with TanStack Start
looks for an old `dist/server/server.js` path that this Nitro-based build
doesn't produce, so it doesn't work here. This only works right after a
plain local `npm run build` (which defaults to the `node-server` preset);
if you build with `NITRO_PRESET=vercel` or similar, use that platform's own
way to test instead.

## Notes

- Contact form emails go through EmailJS (client-side, no server config
  needed — the public key in the code is meant to be public).
- The "Notify my doctor" button in the member chat also uses EmailJS.
- `src/components/NeuralBody.tsx` is an unused canvas animation left over
  from an earlier hero design (the current hero uses a video instead). It's
  harmless dead code — delete it if you want, or keep it around in case you
  want to swap the hero background later.
