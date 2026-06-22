# iPhone PWA deployment

This project is configured as an installable iPhone-first Progressive Web App.

## What was added

- `app/manifest.ts` for the web app manifest.
- `public/apple-touch-icon.png` for iOS Home Screen icon.
- `public/icons/*` for PWA icons.
- `public/sw.js` for a basic app-shell cache.
- `components/PwaRegister.tsx` for service worker registration in production.
- `components/PwaInstallGuide.tsx` with iPhone installation guidance.
- `metadata.appleWebApp` and mobile viewport configuration in `app/layout.tsx`.

## Deploy

You can deploy to Firebase App Hosting, Vercel, Cloud Run, or any HTTPS Node hosting.
For MVP testing, Vercel is the fastest. For Firebase-first architecture, use Firebase App Hosting.

### Required production environment variables

```bash
OPENAI_API_KEY=sk-proj-your-real-key
OPENAI_MODEL=gpt-5.4-mini
```

Firebase variables are optional until you switch from localStorage demo mode to signed-in Firestore mode.

## Install on iPhone

1. Deploy the app to an HTTPS URL.
2. Open the URL in Safari on iPhone.
3. Tap Share.
4. Tap Add to Home Screen.
5. Launch Wortwerk from the Home Screen icon.

## Native App Store build later

A PWA is the correct MVP. A native App Store build should come later if retention is proven.
When needed, wrap the web app with Capacitor or rebuild the client in React Native/Expo.
