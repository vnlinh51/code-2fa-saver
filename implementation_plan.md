# Easy 2FA Saver — Chrome Extension Implementation Plan

Xây dựng Chrome Extension **"Easy 2FA Saver"** quản lý mã 2FA (TOTP) với backend NestJS + MongoDB Atlas, dưới dạng monorepo.

---

## Trả lời các câu hỏi của bạn

### 6. Deploy BE ở đâu miễn phí tốt nhất?

**Khuyến nghị: [Railway](https://railway.app)**

| Tiêu chí | Railway | Render | Fly.io |
|---|---|---|---|
| Free tier | $5 credit/tháng (~500h) | Free nhưng **ngủ sau 15p** | Generous nhưng phức tạp hơn |
| Always-on | ✅ | ❌ (sleep) | ✅ |
| GitHub integration | ✅ | ✅ | ❌ cần CLI |
| NestJS support | ✅ native | ✅ | ✅ |
| DX | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐ |

➡️ **Dùng Railway**: connect GitHub repo → auto deploy khi push. MongoDB dùng **MongoDB Atlas Free Tier (512MB)** — không deploy cùng Railway.

**BE cần deploy riêng không?** → **Có**, Chrome Extension là static file, BE phải là một server public có URL như `https://your-api.railway.app`.

### 7. GitHub → Monorepo structure sẵn sàng cho push

### 8. Yêu cầu để lên Chrome Web Store

| Yêu cầu | Chi tiết |
|---|---|
| 💳 Developer fee | **$5 USD** (một lần duy nhất) tại [Chrome Web Store Developer Dashboard](https://chrome.google.com/webstore/devconsole) |
| 📋 Manifest V3 | Bắt buộc từ 2024, plan này dùng MV3 |
| 🖼️ Icons | 16×16, 48×48, 128×128 px (PNG) |
| 📸 Screenshots | Ít nhất 1 ảnh (1280×800 hoặc 640×400) |
| 📄 Privacy Policy | **Bắt buộc** vì extension xử lý dữ liệu user (URL công khai) |
| ⏱️ Review time | 1–7 ngày làm việc |
| 🔐 Permissions | Phải khai báo rõ `storage`, `host_permissions` |

---

## Kiến trúc tổng quan

```
code-2fa-ext/                    ← monorepo root
├── packages/
│   ├── extension/               ← Chrome Extension (WXT + React + TS)
│   └── backend/                 ← NestJS API
├── package.json                 ← npm workspaces
├── .gitignore
└── README.md
```

### Luồng hoạt động

```
[Chrome Extension]
      │  HTTPS requests (JWT in header)
      ▼
[NestJS Backend / Railway]
      │  Mongoose queries
      ▼
[MongoDB Atlas]
```

- TOTP codes được tính **client-side** bằng thư viện `otpauth` → secret lấy từ DB một lần, tính mã real-time trong extension
- JWT lưu trong `chrome.storage.local` (an toàn hơn localStorage)

---

## Cấu trúc chi tiết

### Backend — `packages/backend/`

```
src/
├── auth/
│   ├── auth.controller.ts    # POST /auth/login, POST /auth/register
│   ├── auth.service.ts
│   ├── auth.module.ts
│   ├── jwt.strategy.ts
│   └── dto/
│       ├── login.dto.ts
│       └── register.dto.ts
├── users/
│   ├── users.schema.ts       # { _id, username, passwordHash, createdAt }
│   ├── users.service.ts
│   └── users.module.ts
├── accounts/                  # 2FA accounts
│   ├── accounts.controller.ts # GET/POST/PUT/DELETE /accounts
│   ├── accounts.service.ts
│   ├── accounts.schema.ts    # { _id, userId, name, secret, url, createdAt }
│   ├── accounts.module.ts
│   └── dto/
│       ├── create-account.dto.ts
│       └── update-account.dto.ts
├── app.module.ts
└── main.ts                   # CORS config cho extension
```

**API endpoints:**

| Method | Path | Auth | Mô tả |
|--------|------|------|-------|
| POST | `/auth/register` | ❌ | Tạo tài khoản |
| POST | `/auth/login` | ❌ | Đăng nhập → JWT |
| GET | `/accounts` | ✅ JWT | Lấy danh sách 2FA accounts |
| POST | `/accounts` | ✅ JWT | Thêm account mới |
| PUT | `/accounts/:id` | ✅ JWT | Cập nhật account |
| DELETE | `/accounts/:id` | ✅ JWT | Xóa account |

### Frontend — `packages/extension/`

**WXT file-based structure** (tự động generate `manifest.json`):
```
entrypoints/
└── popup/
    ├── index.html             # Entry point
    ├── App.tsx                # Router (login → dashboard → add → edit)
    └── main.tsx
src/
├── pages/
│   ├── LoginPage.tsx          # Form login + register
│   ├── DashboardPage.tsx      # Danh sách 2FA + countdown + copy
│   ├── AddAccountPage.tsx     # Form thêm account mới
│   └── EditAccountPage.tsx    # Form sửa account (simple)
├── components/
│   ├── AccountCard.tsx        # Card 1 account (code + timer + copy + actions)
│   ├── CountdownBar.tsx       # Thanh đếm ngược 30s
│   └── Layout.tsx             # Header + navigation
├── hooks/
│   ├── useTotp.ts             # Hook tính TOTP code từ secret
│   └── useAuth.ts             # Hook quản lý auth state
├── services/
│   └── api.ts                 # Axios instance + API calls
└── store/
    └── authStore.ts           # Zustand lưu JWT, user info

public/
└── icons/                     # icon16.png, icon48.png, icon128.png

wxt.config.ts                  # WXT config (tên, permissions, host_permissions)
```

**`wxt.config.ts`** (thay cho manifest.json thủ công):
```ts
export default defineConfig({
  manifest: {
    name: 'Easy 2FA Saver',
    version: '1.0.0',
    description: 'Quản lý mã 2FA của bạn một cách dễ dàng',
    permissions: ['storage'],
    host_permissions: ['https://your-api.railway.app/*'],
  },
})
```

---

## Stack chi tiết

### Frontend packages
| Package | Mục đích |
|---------|---------|
| `react` + `typescript` | Core |
| `vite` + `vite-plugin-web-extension` | Build Chrome Extension |
| `antd` | UI components |
| `tailwindcss` | Utility CSS |
| `react-hook-form` + `zod` | Form validation |
| `@tanstack/react-query` | Server state / API caching |
| `axios` | HTTP client |
| `otpauth` | Tính TOTP code client-side |
| `zustand` | Auth state management |
| `react-router-dom` | Navigation giữa pages |

### Backend packages
| Package | Mục đích |
|---------|---------|
| `@nestjs/core` | NestJS framework |
| `@nestjs/jwt` + `passport-jwt` | JWT auth |
| `@nestjs/mongoose` + `mongoose` | MongoDB ODM |
| `bcryptjs` | Hash password |
| `class-validator` + `class-transformer` | DTO validation |

---

## Thứ tự thực hiện

### Phase 1: Setup monorepo
- [ ] Init npm workspaces
- [ ] Setup `.gitignore`, `README.md`

### Phase 2: Backend
- [ ] Init NestJS project
- [ ] Setup MongoDB Atlas connection
- [ ] Auth module (register/login/JWT)
- [ ] Accounts CRUD module
- [ ] CORS config cho Chrome Extension

### Phase 3: Frontend (Extension)
- [ ] Init WXT + React + TS project (`npx wxt@latest init`)
- [ ] Setup TailwindCSS + Ant Design
- [ ] Setup TanStack Query + Axios + Zustand
- [ ] `LoginPage` + `RegisterPage` với React Hook Form
- [ ] `DashboardPage` với countdown timer, copy, delete
- [ ] `AddAccountPage` với form validation
- [ ] `EditAccountPage` (simple — sửa name/url)
- [ ] `wxt dev` test HMR trong Chrome
- [ ] `wxt build` + load unpacked test cuối

### Phase 4: Polish & Deploy
- [ ] Generate extension icons (16/48/128px)
- [ ] Responsive popup (min-width: 380px)
- [ ] Error handling & loading states (Ant Design Spin, Alert)
- [ ] `wxt zip` → tạo file upload Chrome Web Store
- [ ] Deploy BE lên Railway
- [ ] README với hướng dẫn deploy + store submission

---

## Đã xác nhận ✅

| Câu hỏi | Quyết định |
|---|---|
| Popup size | **Responsive** (min-width: 380px) |
| Register | **Có trong extension** (tab Login/Register toggle) |
| Tên extension | **"Easy 2FA Saver"** |
| Edit account | **Có** — màn hình đơn giản (sửa name, url) |

---

## Verification Plan

### Local Testing
- Backend: `npm run start:dev` → test Swagger UI tại `localhost:3000/api`
- Extension: `npm run build` → load unpacked trong Chrome → test 3 màn hình

### Deploy Testing
- Railway: push code → check deployment logs → test API endpoints production

### Chrome Store Checklist
- MV3 compliant ✅
- Icons đầy đủ kích thước ✅
- Privacy Policy URL ✅
- Permissions tối thiểu ✅
