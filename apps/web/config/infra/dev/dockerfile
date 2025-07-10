# --- Stage 1: Build ---
  FROM node:22-alpine AS builder
  WORKDIR /repo
  # 使用 corepack 自动管理 pnpm 版本
  RUN corepack enable && corepack prepare pnpm@latest --activate
  COPY . .
  RUN pnpm install --frozen-lockfile
  RUN  pnpm run build
  # --- Stage 2: Runtime ---
  FROM node:22-alpine AS runtime
  WORKDIR /work/wallet/nodejs
  RUN corepack enable && corepack prepare pnpm@latest --activate
  # 创建一个非特权用户
  RUN addgroup -g 1002 bdy && \
      adduser -u 1002 -G bdy -s /bin/sh -D bdy
  # 只复制运行所需文件（Next.js）
  COPY --chown=bdy:bdy --from=builder /repo/apps ./apps
  COPY --chown=bdy:bdy --from=builder /repo/package.json ./package.json
  COPY --chown=bdy:bdy --from=builder /repo/pnpm-lock.yaml ./pnpm-lock.yaml
  RUN pnpm install --frozen-lockfile
  RUN chown -R bdy:bdy /work
  USER bdy
  EXPOSE 3000
  # 设置工作目录
  WORKDIR /work/wallet/nodejs/apps/web
  CMD ["pnpm", "start"]