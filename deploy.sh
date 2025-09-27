#!/bin/bash

# 🚀 智能教育平台部署脚本

echo "🎓 开始部署智能教育平台..."

# 检查依赖
echo "📋 检查系统依赖..."
if ! command -v docker &> /dev/null; then
    echo "❌ Docker 未安装，请先安装 Docker"
    exit 1
fi

if ! command -v docker-compose &> /dev/null; then
    echo "❌ Docker Compose 未安装，请先安装 Docker Compose"
    exit 1
fi

# 创建必要的目录
echo "📁 创建必要的目录..."
mkdir -p uploads logs database nginx/ssl monitoring

# 复制配置文件
echo "⚙️ 配置环境变量..."
if [ ! -f .env ]; then
    cp .env.example .env
    echo "📝 请编辑 .env 文件配置您的环境变量"
    read -p "按 Enter 键继续..."
fi

# 构建和启动服务
echo "🔨 构建应用..."
docker-compose build

echo "🚀 启动服务..."
docker-compose up -d

# 等待服务启动
echo "⏳ 等待服务启动..."
sleep 30

# 检查服务状态
echo "🔍 检查服务状态..."
docker-compose ps

# 初始化数据库
echo "💾 初始化数据库..."
docker-compose exec education-platform npm run migrate

# 显示访问信息
echo "🎉 部署完成！"
echo ""
echo "📱 访问地址:"
echo "  - 主应用: http://localhost:3000"
echo "  - 数据库管理: http://localhost:5432"
echo "  - Redis管理: http://localhost:6379"
echo "  - 监控面板: http://localhost:9090"
echo ""
echo "📚 管理命令:"
echo "  - 查看日志: docker-compose logs -f"
echo "  - 停止服务: docker-compose down"
echo "  - 重启服务: docker-compose restart"
echo "  - 查看状态: docker-compose ps"
echo ""
echo "🎓 享受您的智能教育平台吧！"