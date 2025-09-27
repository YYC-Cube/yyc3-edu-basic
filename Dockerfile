# 🚧 构建阶段
FROM node:18-alpine AS builder

# 设置工作目录
WORKDIR /app

# 复制依赖文件（利用缓存）
COPY package.json pnpm-lock.yaml ./

# 安装 pnpm 和依赖
RUN npm install -g pnpm && pnpm install --frozen-lockfile

# 复制源代码并构建
COPY . .
RUN pnpm build

# 🧼 运行阶段
FROM node:18-alpine

# 设置工作目录
WORKDIR /app

# 安装 pnpm
RUN npm install -g pnpm

# 复制构建产物和依赖
COPY --from=builder /app ./

# 安装仅生产依赖
RUN pnpm install --prod --frozen-lockfile

# 暴露端口
EXPOSE 3000

# 健康检查
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:3000/api/health || exit 1

# 启动命令
CMD ["pnpm", "start"]
