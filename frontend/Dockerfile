# --- 第一阶段：构建环境 (Builder) ---
# 使用一个特定版本的 Node.js 镜像作为构建基础
FROM node:24-alpine AS builder

# 设置工作目录
WORKDIR /app

# 复制 package.json 和 package-lock.json (或 yarn.lock/pnpm-lock.yaml)
# 这样可以利用 Docker 的缓存机制，只有在依赖变化时才重新安装
COPY package*.json ./

# 安装项目依赖
RUN npm install

# 复制所有剩余的源代码到容器中
COPY . .

# 执行构建命令，生成静态文件
# 【重要】请根据您博客的实际命令修改！
# Hexo 通常是: hexo generate
# VuePress/VitePress 通常是: npm run docs:build 或 npm run build
RUN npm run build

# --- 第二阶段：运行环境 (Runner) ---
# 使用一个非常轻量的 Nginx 镜像
FROM nginx:1.25-alpine

# 将第一阶段构建好的静态文件，从 builder 的 /app/public (或 /app/dist) 目录
# 复制到 Nginx 的网站根目录 /usr/share/nginx/html
# 【重要】请确认您的构建输出目录是 public, dist, .vuepress/dist 还是其他
COPY --from=builder /app/dist /usr/share/nginx/html

# 暴露 80 端口
EXPOSE 80

# 容器启动时，默认执行 Nginx 服务
CMD ["nginx", "-g", "daemon off;"]