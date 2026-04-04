# Easy 2FA Saver — Walkthrough

## Kết quả

Monorepo hoàn chỉnh tại `/home/linhvn/Documents/code-2fa-ext/` với 2 packages đều build thành công.

---

## Cấu trúc thực tế

```
code-2fa-ext/
├── packages/
│   ├── extension/                        ← Chrome Extension
│   │   ├── entrypoints/popup/            ← WXT entry (index.html, main.tsx)  [đã move vào src/]
│   │   ├── src/
│   │   │   ├── entrypoints/popup/        ← index.html + main.tsx (providers)
│   │   │   ├── pages/
│   │   │   │   ├── LoginPage.tsx         ← Login + Register (Tab toggle)
│   │   │   │   ├── DashboardPage.tsx     ← Danh sách 2FA, search, countdown
│   │   │   │   ├── AddAccountPage.tsx    ← Form thêm (Base32 validation)
│   │   │   │   └── EditAccountPage.tsx   ← Form sửa name/url
│   │   │   ├── components/
│   │   │   │   ├── AccountCard.tsx       ← TOTP code + copy + countdown + actions
│   │   │   │   ├── CountdownBar.tsx      ← Progress bar (đỏ khi ≤5s)
│   │   │   │   └── Layout.tsx            ← Header + nav + logout
│   │   │   ├── hooks/useTotp.ts          ← TOTP generation (otpauth, realtime)
│   │   │   ├── services/api.ts           ← Axios + JWT interceptors
│   │   │   ├── store/authStore.ts        ← Zustand + chrome.storage.local
│   │   │   ├── styles/globals.css        ← Tailwind + Ant Design overrides
│   │   │   └── App.tsx                   ← MemoryRouter + protected routes
│   │   ├── public/
│   │   │   ├── icon-16.png, icon-48.png, icon-128.png
│   │   ├── wxt.config.ts                 ← WXT config (srcDir, manifest, icons)
│   │   └── .output/chrome-mv3/          ← Build output (load vào Chrome)
│   │
│   └── backend/                          ← NestJS API
│       ├── src/
│       │   ├── auth/                     ← JWT auth (register, login, strategy)
│       │   ├── users/                    ← User schema + service
│       │   ├── accounts/                 ← 2FA accounts CRUD
│       │   ├── app.module.ts
│       │   └── main.ts                   ← CORS, Swagger, port
│       ├── .env.example
│       ├── railway.json                  ← Railway deploy config
│       └── dist/                         ← Build output
│
├── package.json                          ← npm workspaces
├── .gitignore
└── README.md
```

---

## Bắt đầu phát triển

### 1. Setup Backend

```zsh
cd packages/backend
cp .env.example .env
# Điền MongoDB Atlas URI và JWT_SECRET vào .env
npm run start:dev
# → Server chạy tại http://localhost:3000
# → Swagger UI tại http://localhost:3000/api
```

### 2. Setup Extension

```zsh
cd packages/extension
cp .env.example .env
# Điền VITE_API_URL=http://localhost:3000 cho local dev
npm run dev
# → Mở Chrome với HMR đã kích hoạt
```

### 3. Load Extension vào Chrome (manual)

1. Build: `npx wxt build`
2. Mở Chrome → `chrome://extensions/`
3. Bật **Developer mode**
4. Click **Load unpacked** → chọn `packages/extension/.output/chrome-mv3/`

---

## Deploy Production

### Backend → Railway

1. Push code lên GitHub
2. Vào [railway.app](https://railway.app) → New Project → Deploy from GitHub
3. Chọn thư mục `packages/backend` (hoặc set root directory trong Railway)
4. Thêm Environment Variables:
   ```
   MONGODB_URI=mongodb+srv://...
   JWT_SECRET=your_long_random_secret
   PORT=3000
   ```
5. Railway tự build và deploy

### Extension → Chrome Web Store

```zsh
cd packages/extension
# Điền VITE_API_URL=https://your-api.railway.app trong .env
npx wxt zip
# → Tạo file .zip trong packages/extension/
```

Upload `.zip` lên [Chrome Web Store Developer Dashboard](https://chrome.google.com/webstore/devconsole).

---

## Build Status

| | Status |
|---|---|
| Extension (WXT build) | ✅ Thành công |
| Backend (NestJS build) | ✅ Thành công |
| Icons (16/48/128px) | ✅ Generated |
| Manifest V3 | ✅ Compliant |

---

## Còn cần làm trước khi publish

1. **MongoDB Atlas**: Tạo cluster miễn phí, lấy connection string
2. **Railway**: Deploy backend, lấy URL public
3. **Cập nhật `.env`** của extension với URL backend production
4. **Test thực tế** trong Chrome: load unpacked và test all 4 màn hình
5. **Privacy Policy**: Cần 1 trang web có Privacy Policy URL (bắt buộc với Chrome Store)
6. **Screenshots**: Chụp ảnh extension đang hoạt động (1280×800 hoặc 640×400)
