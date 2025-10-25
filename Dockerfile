# 🚧 构建阶段
# 🚧 构建阶段
FROM node:20-alpine AS builder

# 设置工作目录
WORKDIR /app

# 复制依赖文件（利用缓存）
COPY package.json package-lock.json ./

# 安装依赖（干净安装）
RUN npm ci

# 复制源代码并构建
COPY . .
ENV NEXT_TELEMETRY_DISABLED=1
RUN npm run build

# 🧼 运行阶段（精简独立产物）
FROM node:20-alpine
ENV NODE_ENV=production
WORKDIR /app

# 复制 standalone 产物
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public

# 暴露端口
ENV PORT=3000
EXPOSE 3000

# 健康检查（访问首页）
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=5 \
  CMD wget -qO- http://localhost:3000/ || exit 1

# 启动命令
CMD ["node", "server.js"]
