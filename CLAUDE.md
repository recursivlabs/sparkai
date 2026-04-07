# SPARK AI — Claude Code Instructions

## What This Is

A Next.js website for SPARK AI (sparkai.network) — SDSC's AI consortium at UC San Diego. Built on the Recursiv SDK for auth, email, billing, and storage.

## Architecture

- **Framework:** Next.js 16 (App Router) with TypeScript and Tailwind CSS
- **Backend:** All backend services via `@recursiv/sdk` — no direct Stripe/Resend/database clients
- **Styling:** Dark theme (black/slate palette), Geist font, Tailwind v4
- **Deploy target:** Vercel or Recursiv platform

## Recursiv SDK Usage

The SDK is the only external dependency for backend services. Initialize lazily (see `src/lib/recursiv.ts`) to avoid build-time errors when env vars aren't set.

```typescript
import { getRecursiv } from "@/lib/recursiv";
const r = getRecursiv();
```

### Auth
```typescript
const session = await r.auth.signUp({ email, password, name }); // returns AuthSession
const session = await r.auth.signIn({ email, password });        // returns AuthSession
const session = await r.auth.getSession(token);                  // returns AuthSession | null
```
Returns `AuthSession` directly (NOT `{ data: session }`). AuthSession has `{ token, user: { id, name, email, image } }`.

### Email (transactional)
```typescript
await r.email.send({
  to: "user@example.com",
  subject: "Subject",
  html: "<html>...</html>",
  from: "SPARK AI <events@sparkai.network>",  // branded from address
});
```
Uses the Resend API key configured in the Recursiv org settings. Emails are fully branded as SPARK AI.

### Email (campaigns / bulk)
```typescript
const { data: campaign } = await r.email.createCampaign({
  name: "Weekly Digest",
  subject: "SPARK AI Weekly",
  from_email: "digest@sparkai.network",
  from_name: "SPARK AI",
  html_content: "<html>...</html>",
  segment: "all",
});
await r.email.startCampaign(campaign.id);
```

### Billing
SPARK uses Recursiv's platform Stripe account (not BYOK). The university can't have its own Stripe.
```typescript
const { data } = await r.billing.createCheckoutSession({
  organization_id: orgId,
  return_url: "https://sparkai.network/member/dashboard",
});
// Redirect user to data.url
```
Tier prices (Forum, ARC) are configured in Recursiv org settings as `stripePriceIds`.

### Storage (for PDFs)
```typescript
const { data } = await r.storage.getDownloadUrl({
  project_id: PROJECT_ID,
  bucket_name: "papers",
  key: "ai-governance.pdf",
});
// data.url is a presigned download URL
```

### Databases
```typescript
import { query } from "@/lib/db";  // auto-ensures DB + tables
const result = await query("SELECT * FROM rsvps WHERE event_id = $1", [eventId]);
```

## Membership Tiers

Three tiers — all managed via Recursiv roles, NOT custom code:
- **Community** — free, sign up on the site
- **Forum** — paid via Recursiv billing or manually assigned by admin
- **ARC** — paid via Recursiv billing or manually assigned by admin

Tier assignment: use Recursiv dashboard, MCP tools (`admin_set_user_role`), or `sdk.billing` for paid upgrades.

## Email System

All emails go through `sdk.email.send()`. No direct Resend client.
- **Welcome email** — auto-sent on registration (`src/lib/email.ts`)
- **RSVP confirmation** — auto-sent when user RSVPs (`src/lib/email.ts`)
- **Event reminders** — scheduled via Recursiv agent or Vercel cron
- **Digest emails** — scheduled via Recursiv campaign system

## Key Files

- `src/lib/recursiv.ts` — SDK client (lazy init via Proxy)
- `src/lib/constants.ts` — Org ID, Project ID, DB name, storage bucket
- `src/lib/db.ts` — Database helper (auto-creates tables, wraps sdk.databases.query)
- `src/lib/email.ts` — email templates (welcome, RSVP confirmation)
- `src/lib/session.ts` — Server-side session resolution via sdk.auth.getSession
- `src/lib/tiers.ts` — MembershipTier type
- `src/components/membership/TierGate.tsx` — content gating by tier
- `src/components/ui/RsvpButton.tsx` — RSVP form component
- `src/app/api/rsvp/route.ts` — RSVP API endpoint (stores in DB + sends email)
- `src/app/api/auth/register/route.ts` — registration via sdk.auth.signUp
- `src/app/api/auth/login/route.ts` — login via sdk.auth.signIn
- `src/app/api/billing/checkout/route.ts` — Stripe checkout via sdk.billing (uses org ID)
- `src/app/api/pdf/[slug]/route.ts` — PDF serving (tries Recursiv storage, falls back to local)

## Environment

```
RECURSIV_API_KEY=your_recursiv_api_key
NEXT_PUBLIC_RECURSIV_URL=https://api.recursiv.io
RECURSIV_ORG_ID=<org-id-from-mcp>
RECURSIV_PROJECT_ID=<project-id-from-mcp>
```

Create the org and project via MCP:
```
mcp__recursiv__create_org({ name: "SPARK AI", slug: "sparkai" })
mcp__recursiv__create_project({ name: "sparkai-web", organization_id: orgId })
```

## Design System

- **Background:** black (#000), alternating with slate-900
- **Cards:** bg-slate-900 or bg-slate-800, border-slate-800/700, rounded-xl
- **Feature cards:** gradient `from-slate-900/90 to-slate-800/50`, rounded-2xl, hover:scale-[1.02]
- **Buttons:** bg-blue-600 hover:bg-blue-700, rounded-full (CTAs) or rounded (inline)
- **Text:** white (headings), slate-300/400 (body)
- **Accents:** blue-600 (primary), emerald (POV/free access), amber (restricted), purple (research)
- **Accent bars:** w-20 h-1 bg-blue-600 under section headings
- **Hero:** background image with bg-black/40 overlay + grid pattern at 2% opacity

## Content Source

All page content was scraped verbatim from the live sparkai.network site (v0 build). The content is static in the page files. PDFs that were on Scribd are now served internally via `/insights/[slug]` with an iframe viewer — actual PDF files go in `public/pdfs/`.

## What Still Needs Doing

- **Create Recursiv org + project** via MCP and set IDs in .env.local
- Add image assets: hero-bg.jpg, spark-ai-logo.png, SDSC/UCSD logos
- Upload PDF files to Recursiv storage bucket (`papers`) or keep in public/pdfs/
- Build automated cron routes for event reminders and digest emails
- Verify sparkai.network domain in Resend (via Recursiv org settings)
- Configure Forum/ARC price IDs in Recursiv org settings
- Deploy
