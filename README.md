# Easy 2FA Saver

A Chrome Extension to manage your 2FA (TOTP) accounts securely.

## Tech Stack

| Layer | Tech |
|---|---|
| Extension | WXT + React + TypeScript + Ant Design + TailwindCSS |
| Forms | React Hook Form + Zod |
| State | TanStack Query + Zustand |
| Backend | NestJS + MongoDB Atlas |
| Auth | JWT |
| TOTP | `otpauth` (client-side code generation) |

## Monorepo Structure

```
packages/
├── extension/   # Chrome Extension (WXT)
└── backend/     # NestJS API
```

## Getting Started

### Backend
```bash
cd packages/backend
cp .env.example .env   # fill in your MongoDB Atlas URI + JWT secret
npm run start:dev
```

### Extension
```bash
cd packages/extension
cp .env.example .env   # fill in your API base URL
npm run dev            # opens Chrome with HMR
```

## Deploy

- **Backend**: [Railway](https://railway.app) — connect GitHub repo, set env vars
- **Database**: [MongoDB Atlas](https://mongodb.com/atlas) Free Tier (512MB)
- **Extension**: `npm run zip` → upload `.zip` to Chrome Web Store

## Chrome Web Store

1. Register at [Chrome Web Store Developer Dashboard](https://chrome.google.com/webstore/devconsole) ($5 one-time fee)
2. Run `npm run zip` in `packages/extension`
3. Upload the generated `.zip` file
4. Add screenshots (1280×800) and a Privacy Policy URL
5. Submit for review (1–7 business days)
