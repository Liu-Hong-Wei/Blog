# Architecture

## 3 dockers

- Nginx Proxy with acme-companion: handling all the requests from outside
- [Chevereto](https://github.com/chevereto/chevereto) using Redis: image host
- Blog: 
  - frontend using React: displaying blog
  - backend using Django: handling all the /api/* requests
  - database using PostgreSQL: storing data

## Diagram
```
+-------------------+      DNS      +-------------------------------------------+
|   User's Browser  |-------------> |              Your Server (Debian)           |
+-------------------+               | +-----------------------------------------+ |
                                    | |         Docker Engine Runs Here         | |
                                    | +-----------------------------------------+ |
                                    |                      |                      |
                                    |      Listens on Ports 80 & 443            |
                                    |                      |                      |
                                    | +--------------------V--------------------+ |
                                    | |      nginx-proxy (The Grand Central)    | |  <------->+--------------------+
                                    | +--------------------|--------------------+ |           |  acme-companion    |
                                    |                      |                      |           | (The SSL Manager)  |
                                    |   Reads Host Header & Routes Traffic      |           +--------------------+
                                    |                      |                      |
+-----------------------------------/                      \-----------------------------------+
| Host: liuhongwei.org                                       | Host: img.liuhongwei.org          |
|                                                            |                                   |
V                                                            V                                   V
+-------------------------------------------------+          +-----------------------------------+
|           Blog Frontend Container               |          |       Chevereto App Container     |
| +---------------------------------------------+ |          | +-------------------------------+ |
| | Nginx (serves static files, proxies /api)   | |          | | Apache (runs Chevereto PHP)   | |
| +---------------------|-----------------------+ |          | +---------------|---------------+ |
|                       | (API Request to /api)   |          |                 | (DB Query)      |
|                       V                         |          |                 V                 V
| +---------------------V-----------------------+ |          | +---------------V---------------+ +---------------+
| |     Blog Backend Container (Django)         | |          | |   Chevereto DB (MariaDB)      | |  Redis Cache  |
| +---------------------|-----------------------+ |          | +-------------------------------+ +---------------+
|                       | (DB Query)              |          |
|                       V                         |          |
| +---------------------V-----------------------+ |          |
| |    Blog Database Container (PostgreSQL)     | |          |
| +---------------------------------------------+ |          |
+-------------------------------------------------+          +-----------------------------------+
```
# setup

## blog setup example

```bash
$ ~/Blog: ls
backend  docker-compose.dev.yml  docker-compose.yml  frontend  package-lock.json  README.md
$ ~/Blog: cat docker-compose.yml
# docker-compose.yml

services:
  # 后端 Django 服务
  backend:
    build:
      context: ./backend
    container_name: blog_backend
    # 生产环境中，建议注释掉 volume 挂载，让代码固化在镜像里
    # volumes:
    #   - ./backend:/app
    networks:
      - blog-network
    environment:
      - DB_NAME=${DB_NAME}
      - DB_USER=${DB_USER}
      - DB_PASSWORD=${DB_PASSWORD}
      - DB_HOST=db
      - DB_PORT=5432
      - DJANGO_SECRET_KEY=${DJANGO_SECRET_KEY}
      - DJANGO_DEBUG=${DJANGO_DEBUG}
    depends_on:
      db:
        condition: service_healthy # 增加健康检查依赖 暂时不忽略数据库健康
    restart: unless-stopped

  # 前端 React 服务
  frontend:
    build:
      context: ./frontend
    container_name: blog_frontend
    # 生产环境中，建议注释掉 volume 挂载
    # volumes:
    #   - ./frontend:/app
    #   - /app/node_modules
    networks:
      - blog-network
      - nginx-proxy
    environment:
      - VIRTUAL_HOST=liuhongwei.org,www.liuhongwei.org
      - LETSENCRYPT_HOST=liuhongwei.org,www.liuhongwei.org
      - LETSENCRYPT_WEBROOT=/usr/share/nginx/html
    depends_on:
      - backend
    restart: unless-stopped

  # PostgreSQL 数据库服务
  db:
    image: postgres:18.0-alpine
    container_name: blog_db
    volumes:
      - postgres_data:/var/lib/postgresql/data/
    networks:
      - blog-network
    environment:
      - POSTGRES_DB=${DB_NAME}
      - POSTGRES_USER=${DB_USER}
      - POSTGRES_PASSWORD=${DB_PASSWORD}
    healthcheck: # 为数据库添加健康检查
      test: ["CMD-SHELL", "pg_isready -U ${DB_USER} -d ${DB_NAME}"]
      interval: 10s
      timeout: 5s
      retries: 5
    restart: unless-stopped

volumes:
  postgres_data:

networks:
  blog-network:
  nginx-proxy:
    external: true
$ ~/Blog: cat frontend/Dockerfile
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
$ ~/Blog: cat backend/Dockerfile
# backend/Dockerfile

# 使用官方的 Python 镜像
FROM python:3.12-slim

# 设置环境变量
ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

# 设置工作目录
WORKDIR /app

# 安装依赖
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# 复制项目代码
COPY . .

# 暴露 Django 运行的端口
EXPOSE 8000

# 运行 Django (推荐使用 Gunicorn)
CMD ["gunicorn", "--bind", "0.0.0.0:8000", "backend.wsgi:application"]
$ ~/Blog: cat .env
# .env.example - 复制此文件为 .env 并填入实际值

# =============================================================================
# Django 后端配置
# =============================================================================

# Django 安全密钥 - 生产环境必须修改！
# 可以使用: python -c 'from django.core.management.utils import get_random_secret_key; print(get_random_secret_key())'
DJANGO_SECRET_KEY=your_super_secret_key_here_change_this_in_production

# 调试模式 - 生产环境设为 False
DEBUG=True

# 允许的主机 - 生产环境需要设置实际域名
DJANGO_ALLOWED_HOSTS=localhost,127.0.0.1,0.0.0.0

# =============================================================================
# 数据库配置 (PostgreSQL)
# =============================================================================

# 数据库名称
DB_NAME=blog_db

# 数据库用户名
DB_USER=blog_user

# 数据库密码 - 请使用强密码
DB_PASSWORD=your_secure_database_password

# 数据库主机 (Docker 内部使用服务名)
DB_HOST=db

# 数据库端口
DB_PORT=5432

# =============================================================================
# CORS 配置 (跨域请求)
# =============================================================================

# 前端开发服务器地址
CORS_ALLOWED_ORIGINS=http://localhost:5173,http://127.0.0.1:5173,http://localhost:3000

# CSRF 信任域名
CSRF_TRUSTED_ORIGINS=http://localhost:5173,http://127.0.0.1:5173,http://localhost:3000

# =============================================================================
# 生产环境配置 (可选)
# =============================================================================

# 生产环境域名 (nginx-proxy 使用)
# VIRTUAL_HOST=yourdomain.com,www.yourdomain.com
# LETSENCRYPT_HOST=yourdomain.com,www.yourdomain.com

# =============================================================================
# 开发环境配置
# =============================================================================

# 开发模式设置
DJANGO_DEBUG=1
```

## nginx-proxy setup example

```bash
$ ls /opt/nginx-proxy/
docker-compose.yml  vhost.d
$ cat /opt/nginx-proxy/docker-compose.yml
# /opt/nginx-proxy/docker-compose.yml
services:
  nginx-proxy:
    image: jwilder/nginx-proxy:latest
    container_name: nginx-proxy
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - /var/run/docker.sock:/tmp/docker.sock:ro
      - certs:/etc/nginx/certs
      - vhost:/etc/nginx/vhost.d
      - html:/usr/share/nginx/html
      - /opt/nginx-proxy/vhost.d:/etc/nginx/vhost.d:ro
    networks:
      - nginx-proxy # 连接到我们创建的共享网络
    restart: always
    environment:
      # 启用IPv6支持（如果需要）
      ENABLE_IPV6: "true"

  acme-companion:
    image: nginxproxy/acme-companion:latest
    container_name: nginx-proxy-acme
    depends_on:
      - nginx-proxy
    volumes:
      - /var/run/docker.sock:/var/run/docker.sock:ro
      - certs:/etc/nginx/certs
      - vhost:/etc/nginx/vhost.d
      - html:/usr/share/nginx/html
      - /opt/nginx-proxy/vhost.d:/etc/nginx/vhost.d:ro
    environment:
      DEFAULT_EMAIL: xxx@gmail.com # 改成您自己的邮箱，用于接收Let's Encrypt的通知
      NGINX_PROXY_CONTAINER: nginx-proxy
    networks:
      - nginx-proxy # 连接到我们创建的共享网络
    restart: always

volumes:
  certs:
  html:
# vhost:

networks:
  nginx-proxy:
    external: true # 告诉它使用已经存在的同名网络
$ ls /opt/nginx-proxy/vhost.d/
img.liuhongwei.org       liuhongwei.org_location
$ cat /opt/nginx-proxy/vhost.d/img.liuhongwei.org
# 更改上传大小上限
client_max_body_size 2G;
$ cat /opt/nginx-proxy/vhost.d/liuhongwei.org_location
# liuhongwei.org 部分: 这告诉 nginx-proxy，这个配置文件只适用于 liuhongwei.org 这个虚拟主机。
# _location 后缀: 这是一个特殊的命名约定。它告诉 nginx-proxy：“请把这个文件的内容插入到为 liuhongwei.org 生成的 server { ... } 配置块的内部。”
location / {
    proxy_pass http://blog_frontend/;
}
```

## Chevereto Docker settup

```bash 
$ ~/chevereto: cat docker-compose.yml
# docker-compose.yml

services:
  # 数据库服务 (MariaDB)
  database:
    container_name: ${CONTAINER_BASENAME}_database
    image: mariadb:11.8
    networks:
      - chevereto
    # 在生产环境中，通常不需要将数据库端口暴露给主机
    # ports:
    #   - "33066:3306"
    volumes:
      # 使用Docker命名数据卷来持久化数据库文件，更稳定
      - database_data:/var/lib/mysql
    healthcheck:
      test: ["CMD", "healthcheck.sh", "--su-mysql", "--connect"]
      interval: 10s
      timeout: 5s
      retries: 3
    environment:
      # 从 .env 文件读取数据库密码和用户信息
      MYSQL_ROOT_PASSWORD: ${MYSQL_ROOT_PASSWORD}
      MYSQL_DATABASE: ${MYSQL_DATABASE}
      MYSQL_USER: ${MYSQL_USER}
      MYSQL_PASSWORD: ${MYSQL_PASSWORD}
    restart: unless-stopped

  # Chevereto 应用服务
  app:
    container_name: ${CONTAINER_BASENAME}_app
    image: chevereto/chevereto:4.3
    networks:
      - chevereto
      - nginx-proxy
        # - blog-network
    # 如果使用nginx-proxy，则不需要将端口映射到主机
    # ports:
    #   - "8080:80"
    volumes:
      # 使用Docker命名数据卷来持久化上传的图片
      - images_data:/var/www/html/images
    depends_on:
      database:
        condition: service_healthy
      redis:
        condition: service_healthy
    environment:
      # Chevereto 应用配置，从 .env 文件读取
      VIRTUAL_HOST: ${HOSTNAME}
      LETSENCRYPT_HOST: ${HOSTNAME}
      CHEVERETO_HOSTNAME: ${CHEVERETO_HOSTNAME}
      CHEVERETO_DB_HOST: database
      CHEVERETO_DB_PORT: 3306
      CHEVERETO_DB_NAME: ${MYSQL_DATABASE}
      CHEVERETO_DB_USER: ${MYSQL_USER}
      CHEVERETO_DB_PASS: ${MYSQL_PASSWORD}
      CHEVERETO_HEADER_CLIENT_IP: X-Real-IP
      CHEVERETO_HOSTNAME_PATH: ${HOSTNAME_PATH}
      CHEVERETO_HTTPS: ${HTTPS}
      CHEVERETO_ENCRYPTION_KEY: ${ENCRYPTION_KEY}
      CHEVERETO_MAX_UPLOAD_SIZE: 2G
      VIRTUAL_CLIENT_MAX_BODY_SIZE: 2G
      CHEVERETO_SESSION_SAVE_HANDLER: redis
      CHEVERETO_SESSION_SAVE_PATH: "tcp://redis:6379?auth[]=${REDIS_PASSWORD}&prefix=chv:SESSION:"
      CHEVERETO_CACHE_DRIVER: redis
      CHEVERETO_CACHE_HOST: redis
      CHEVERETO_CACHE_PORT: 6379
      CHEVERETO_CACHE_USER:
      CHEVERETO_CACHE_PASSWORD: ${REDIS_PASSWORD}
      CHEVERETO_SERVICING: server # 如果需要应用内升级，请取消此行注释，并确保 'app_data' 卷被正确配置
    restart: unless-stopped

  # Redis 缓存服务
  redis:
    container_name: ${CONTAINER_BASENAME}_redis
    image: redis:8
    networks:
      - chevereto
    volumes:
      # 使用Docker命名数据卷持久化Redis数据
      - redis_data:/data
    command: redis-server --appendonly yes --requirepass ${REDIS_PASSWORD}
    healthcheck:
      test: ["CMD", "redis-cli", "-a", "${REDIS_PASSWORD}", "ping"]
      interval: 5s
      timeout: 3s
      retries: 5
    restart: unless-stopped

# 声明所有使用的Docker命名数据卷
volumes:
  database_data:
  images_data:
  redis_data:
  app_data: # 如果启用 CHEVERETO_SERVICING=server，则需要此卷

# 声明所有使用的网络
networks:
  chevereto:
  nginx-proxy:
    external: true
$ ~/chevereto: cat .env
# .env 文件
# 请将所有 "your_..." 的值替换为您自己的安全配置

# --- 基础配置 ---
# 容器基础名称，用于生成唯一的容器名
CONTAINER_BASENAME=chevereto

# --- 域名和HTTPS配置 ---
# 您的域名
HOSTNAME=img.liuhongwei.org
CHEVERETO_HOSTNAME=img.liuhongwei.org

# Chevereto安装的子目录路径，如果没有，请留空
HOSTNAME_PATH=
# 是否启用HTTPS (true/false)
HTTPS=true

# --- 数据库配置 (MariaDB) ---
# 数据库 root 用户密码
MYSQL_ROOT_PASSWORD=
# Chevereto 使用的数据库名
MYSQL_DATABASE=
# Chevereto 使用的数据库用户名
MYSQL_USER=
# Chevereto 使用的数据库用户密码
MYSQL_PASSWORD=

# --- Redis 配置 ---
# Redis 服务的密码
REDIS_PASSWORD=

# --- Chevereto 应用密钥 ---
# 关键安全密钥！请使用一个长且随机的字符串
# 您可以使用 `openssl rand -base64 32` 命令生成
ENCRYPTION_KEY=
```


# notes

using docker develop locally with proper permission:
```
docker compose -f docker-compose.dev.yml up --build
```

| 特性 | 方法一：在 Runner 构建，推送/拉取镜像 (我上次推荐的) | 方法二：在 VPS 上直接构建 (您现在问的) |
| :--- | :--- | :--- |
| **流程简洁度** | 相对复杂，涉及 `build`, `push`, `pull` | **非常简洁**，只有 `git pull`, `build`, `run` |
| **服务器资源** | 构建过程不占用 VPS 资源，VPS 只负责运行 | **构建过程会消耗 VPS 的 CPU 和内存**，可能影响线上服务 |
| **部署速度** | 取决于镜像大小，网络传输占主要时间 | 取决于代码拉取速度和构建复杂度，通常更快 |
| **安全性** | **更高**。VPS 无需访问代码仓库，只需访问镜像仓库 | **稍低**。需要在 VPS 上配置 Git 仓库的访问权限 |
| **回滚能力** | **非常强**。可以轻松地从镜像仓库部署任意历史版本 | 较弱。需要手动 `git checkout` 到旧 commit 再重新构建 |
| **推荐场景** | 生产环境、多服务器集群、对可靠性和版本管理要求高的场景 | **个人项目、开发/测试环境、单服务器部署** |

# TODO

## Frontend

- Set up basic [tailwind CSS](https://tailwindcss.com/docs/)
- theme setup: selection style
- Dropdown menu:
  - create more fancy dropdown menu open and close animation
- convert Markdown to HTML
- to use React Query
- to use Zustand

## Backend

...
