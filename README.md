# notes

using docker with proper permission:
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

## Backend

...
