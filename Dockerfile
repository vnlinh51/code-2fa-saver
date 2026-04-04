# Stage 1: Build
FROM node:24-alpine AS builder

WORKDIR /app

# Cài đặt các thư viện hệ thống cần thiết cho một số node_modules (nếu có)
RUN apk add --no-cache python3 make g++

# Copy toàn bộ mã nguồn trước để tránh lỗi thiếu file khi chạy thư viện có postinstall hook
COPY . .

# Cài đặt toàn bộ dependencies
RUN npm ci

# Build riêng backend
RUN npm run build --workspace=packages/backend

# Stage 2: Production
FROM node:24-alpine AS production

WORKDIR /app

ENV NODE_ENV=production

# Chỉ copy những file config phục vụ install libs
COPY package.json package-lock.json ./
COPY packages/backend/package.json ./packages/backend/
COPY packages/extension/package.json ./packages/extension/

# Chỉ cài production dependencies (bỏ qua devDependencies như vite, wxt, v.v.) giúp image nhẹ hơn rất nhiều
RUN npm ci --omit=dev --ignore-scripts

# Copy thư mục dist đã được build ở bước trước sang
COPY --from=builder /app/packages/backend/dist ./packages/backend/dist

# Nếu có file .env thì copy sang (Dù trên Railway bạn nên cấu hình Environment Variables trên web)
# COPY packages/backend/.env ./packages/backend/.env 

# Railway sẽ tự động cung cấp biến môi trường PORT, báo cho container biết
ENV PORT=3000
EXPOSE 3000

# Lệnh khởi chạy server Node.js backend
CMD ["node", "packages/backend/dist/main"]
