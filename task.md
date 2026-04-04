# Easy 2FA Saver — Task Tracker

## Phase 1: Monorepo Setup
- [x] Create root `package.json` (npm workspaces)
- [x] Create `.gitignore`
- [x] Create `README.md`

## Phase 2: Backend (NestJS)
- [x] Scaffold NestJS project
- [x] Install extra dependencies (mongoose, jwt, bcrypt, passport, etc.)
- [x] MongoDB Atlas connection config
- [x] Users schema + service
- [x] Auth module (register, login, JWT strategy)
- [x] Accounts module (CRUD, scoped per user)
- [x] CORS config for Chrome Extension
- [x] Swagger docs setup
- [x] Railway deploy config (`railway.json`)
- [x] Backend builds successfully (`npm run build` ✅)

## Phase 3: Frontend (WXT Extension)
- [ ] Scaffold WXT + React + TS project
- [ ] Install dependencies (antd, tailwind, tanstack-query, axios, zustand, otpauth, etc.)
- [ ] Configure TailwindCSS + Ant Design
- [ ] TanStack Query provider + Axios instance
- [ ] Zustand auth store
- [ ] `LoginPage` (login + register toggle) with React Hook Form
- [ ] `DashboardPage` (list, countdown, copy, delete)
- [ ] `AddAccountPage` (create form with validation)
- [ ] `EditAccountPage` (edit name/url)
- [ ] `AccountCard` component (code + timer + copy + actions)
- [ ] `CountdownBar` component
- [ ] `Layout` component (header + nav)
- [ ] `useTotp` hook (TOTP code generation)
- [ ] `useAuth` hook
- [ ] WXT config (manifest, permissions)

## Phase 4: Polish & Deploy
- [ ] Generate extension icons (16/48/128px)
- [ ] Error handling + loading states ← (done in components)
- [ ] `wxt build` + load unpacked test ← builder works, manual Chrome test needed
- [ ] Deploy BE to Railway: instructions in README
- [ ] Railway + MongoDB Atlas env vars documented (.env.example)
- [ ] `wxt zip` ready for Chrome Web Store
- [ ] Update README with deploy + store guide
