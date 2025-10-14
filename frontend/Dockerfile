# frontend/Dockerfile

# --- 第一阶段：构建环境 (Builder) ---
FROM node:24-alpine AS builder

WORKDIR /app

# 复制 package.json 和 package-lock.json (或 yarn.lock/pnpm-lock.yaml)
# 这样可以利用 Docker 的缓存机制，只有在依赖变化时才重新安装
COPY package*.json ./
RUN npm install
# 复制所有剩余的源代码到容器中
COPY . .
RUN npm run build

# --- 第二阶段：运行环境 (Runner) ---
FROM nginx:1.29-alpine 

# 将自定义的 nginx.conf 复制到容器中，覆盖默认配置
COPY nginx.conf /etc/nginx/conf.d/default.conf

# 将第一阶段构建好的静态文件复制到 Nginx 的网站根目录
COPY --from=builder /app/dist /usr/share/nginx/html

# 暴露 80 端口
EXPOSE 80

# 容器启动时，默认执行 Nginx 服务
CMD ["nginx", "-g", "daemon off;"]
