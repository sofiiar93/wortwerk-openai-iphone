# OpenAI API setup

This project uses the OpenAI Responses API from server-side Next.js route handlers.

## 1. Create `.env.local`

```bash
cp .env.example .env.local
```

## 2. Add your API key

```bash
OPENAI_API_KEY=sk-proj-your-real-key
OPENAI_MODEL=gpt-5.4-mini
```

Use `gpt-5.4-mini` for lower cost and latency. Use `gpt-5.5` for better linguistic reasoning when budget matters less.

## 3. Run locally

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Security rule

Never call OpenAI directly from a client component. Keep all OpenAI calls inside `/app/api/*/route.ts` so the API key remains server-only.
