# Wortwerk — OpenAI + iPhone PWA MVP

Wortwerk turns messy German vocabulary lists from class into structured cards, grammar notes, examples, review exercises, and error analytics.

This version is configured as an **iPhone-first Progressive Web App** and uses the **OpenAI Responses API** through server-side Next.js route handlers.

## Stack

- Next.js App Router
- TypeScript
- localStorage demo mode
- Optional Firebase Auth + Firestore scaffolding
- OpenAI Responses API via `/app/api/*/route.ts`
- PWA manifest, iOS Home Screen icon, and service worker

## What works in MVP

- Paste a raw vocabulary list.
- Parse cards locally.
- Normalize cards with OpenAI.
- Save cards to localStorage.
- Review cards with SRS scheduling.
- Check learner answers with OpenAI.
- View error categories.
- Install on iPhone from Safari with Add to Home Screen.

## Run locally

```bash
npm install
cp .env.example .env.local
npm run dev
```

Open:

```text
http://localhost:3000
```

## OpenAI setup

Add this to `.env.local`:

```bash
OPENAI_API_KEY=sk-proj-your-real-key
OPENAI_MODEL=gpt-5.4-mini
```

Use `gpt-5.4-mini` for lower cost. Use `gpt-5.5` for stronger language reasoning if cost matters less.

## iPhone install

1. Deploy the app to an HTTPS URL.
2. Open the URL in Safari on iPhone.
3. Tap Share.
4. Tap Add to Home Screen.
5. Launch Wortwerk from the Home Screen.

See `docs/IPHONE_PWA_DEPLOYMENT.md`.

## API spec

An OpenAPI spec for the internal AI routes is included at:

```text
docs/openapi.yaml
```

## Important security note

Never call OpenAI directly from the browser. The OpenAI key must stay server-only in `.env.local` or production hosting environment variables.
