# Hill Chart

A collaborative hill chart tool for tracking project scope progress. Built with Next.js, Firebase Realtime Database, and Tailwind CSS v4.

## Setup

```bash
npm install
npx playwright install  # for E2E tests
```

Create `.env.local`:

```
NEXT_PUBLIC_FIREBASE_DB_URL=https://your-project.firebasedatabase.app/
NEXT_PUBLIC_FIREBASE_DB_PREFIX=dev
```

Run the dev server:

```bash
npm run dev
```

## Firebase

This app uses Firebase Realtime Database for persistence and real-time sync. No authentication SDK is needed — the app uses a simple password gate with a hashed password stored in the database.

### Database rules

Set these in Firebase Console > Realtime Database > Rules:

```json
{
  "rules": {
    "$env": {
      "password": {
        ".read": true,
        ".write": false
      },
      "$other": {
        ".read": true,
        ".write": true
      }
    }
  }
}
```

### Setting a password

Generate a SHA-256 hash of your password:

```bash
echo -n "your-password" | shasum -a 256
```

In the Firebase Console, create the key `{prefix}/password` (e.g. `dev/password` or `prod/password`) and set its value to the hash output.

If no password key exists, the app is accessible without a password.

## Deploy to Vercel

1. Push to GitHub and connect the repo to Vercel
2. Add environment variables in Vercel project settings:
   - `NEXT_PUBLIC_FIREBASE_DB_URL` — your Firebase RTDB URL
   - `NEXT_PUBLIC_FIREBASE_DB_PREFIX` — `prod` (or your preferred prefix)
3. Deploy

## Testing

```bash
npm test          # unit + E2E
npm run test:unit # vitest only
npm run test:e2e  # playwright only
```

Tests run against a separate `test` prefix in Firebase so they don't affect dev or prod data.

## Environment prefixes

The `NEXT_PUBLIC_FIREBASE_DB_PREFIX` variable namespaces all data in Firebase:

| Environment | Prefix | Data path |
|-------------|--------|-----------|
| Local dev | `dev` | `/dev/hills/...` |
| Tests | `test` | `/test/hills/...` |
| Production | `prod` | `/prod/hills/...` |
