<!-- readme-pjcrm: este README é do PJ CRM; scripts/marca-pjcrm.sh o preserva na sincronização -->
<div align="center">

[🇧🇷 Português](README.md) · 🇺🇸 English · [🇪🇸 Español](README.es.md)

<picture>
  <source media="(prefers-color-scheme: dark)" srcset="docs/brand/logo-escuro.png">
  <img src="docs/brand/logo-claro.png" alt="PJ CRM" width="240">
</picture>

# PJ CRM

**A sales CRM with AI agents for WhatsApp, open source, running on your own server.**

</div>

---

## How it works

PJ CRM brings **WhatsApp**, the **sales pipeline** and **AI agents** that work alongside your
team into a single screen:

1. **The customer messages you on WhatsApp.** The number is connected by QR code or through
   Meta's official channel, and the conversation shows up in the **Inbox**.
2. **The AI agent answers.** It replies with what you taught it (your company's knowledge
   base), qualifies the customer, books appointments and creates the deal in the pipeline.
3. **Your team takes over when needed.** The agent knows when to hand off to a person, and
   any agent on your team can step into the conversation at any time. Everything is logged.
4. **Nothing dies in silence.** Follow-ups revive conversations that went cold, automations
   move deals through the pipeline, and the Central flags what needs a human decision.
5. **You track the numbers.** Pipeline performance, per-agent performance and AI cost.

It fits clinics, real estate, stores, agencies, digital products and service providers: the
names adapt to the business (a lead can become a *Patient*, a win can become *Paid*).

Your data stays on **your VPS**, with several companies kept apart in the same installation
and data protection (LGPD) built in. No subscription, no locked features.

---

## Install on a VPS

You need:

| Item | Details |
|---|---|
| **VPS with Docker** | 4 GB of RAM recommended. x86_64 or ARM64 |
| **Domain** | An **A** record pointing to the VPS IP (e.g. `crm.yourcompany.com`) |
| **Database** | A free account at [supabase.com](https://supabase.com), or Supabase on the VPS itself |
| **AI** | An OpenRouter, Anthropic or OpenAI key |
| **WhatsApp** | Your number, connected by QR code on first access |

Log into the VPS (`ssh root@YOUR_IP`) and run:

```bash
git clone https://github.com/nesqj/pj-crm.git
cd pj-crm
bash hostgator-setup-kit/install.sh
```

The installer only asks for what is yours (domain, keys, admin password), validates each
answer, sets up the database, creates the first admin and brings everything up with HTTPS.
Nothing is compiled: the images come ready. If the VPS already has its own proxy (Hostinger,
Coolify, Dokploy), it detects it.

Then open `https://<your-domain>`, sign in as the admin and connect WhatsApp during onboarding.
If you did not choose a password, the initial one is in `.env`, under `OWNER_PASSWORD`.

Details and common problems: [`hostgator-setup-kit/README.md`](hostgator-setup-kit/README.md).

---

## Update

**From the screen:** when a new version is out, the side menu shows **"New version"** to the
server owner. Under **Settings › Update** you see what changes and click update: the system
backs up the database, switches versions and checks it came back up. If the new version
fails, it rolls back on its own.

**From the terminal:**

```bash
cd /path/to/pj-crm
bash hostgator-setup-kit/update.sh
```

Before updating, read that version's section in [`CHANGELOG.md`](CHANGELOG.md): anything
that needs action from you shows up under **⚠️ Requer atenção**.

---

## Development

To work on the code (to use the CRM, use the installer above):

```bash
git clone https://github.com/nesqj/pj-crm.git
cd pj-crm
nvm use                     # Node 22
pnpm install
cp .env.example .env.local  # full guide in docs/SETUP.md

# The schema is baseline.sql (the same one the installer applies), not the migrations.
# On a new Supabase project, enable the extensions the schema uses first.
psql "$SUPABASE_DB_URL" -v ON_ERROR_STOP=1 -c \
  'create extension if not exists vector with schema public;
   create extension if not exists citext with schema public;
   create extension if not exists pg_trgm with schema public;'

psql "$SUPABASE_DB_URL" -v ON_ERROR_STOP=1 -f supabase/baseline.sql

pnpm dev                    # http://localhost:3000
```

Tests: `pnpm typecheck`, `pnpm lint`, `pnpm test:unit` and `pnpm test:db`.

Stack: Next.js, React, TypeScript, Supabase (Postgres with RLS), WAHA for WhatsApp and the
Vercel AI SDK for AI. Architecture in [`ARCHITECTURE.md`](ARCHITECTURE.md), integrations in
[`docs/SETUP.md`](docs/SETUP.md) and the rest of the docs in [`docs/index.md`](docs/index.md)
(in Portuguese).

---

## Problems

Found a bug? Open an issue at
[github.com/nesqj/pj-crm/issues](https://github.com/nesqj/pj-crm/issues), with the installed
version and what happened. Security issue: see [`SECURITY.md`](SECURITY.md).
