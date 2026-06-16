---
title: 使用Docker部署Misskey实例
published: 2026-01-16
description: 使用Docker部署Misskey去中心化社交网络实例的详细教程
tags:
 - Misskey
 - Docker
category: Tutorial
draft: false
---
# 前言
Misskey 是一个开源的、去中心化的社交网络平台，它提供了丰富的功能和高度的自定义性，让用户能够自由地构建和管理自己的社交空间。与传统社交媒体不同，Misskey 支持联邦宇宙（Fediverse）协议，允许不同实例之间的用户相互交流，同时保持数据的控制权和隐私性。
# 开始部署你的 Misskey 实例
## 拉取代码
```bash
git clone -b master https://github.com/misskey-dev/misskey.git
cd misskey
```
## 复制配置文件示例
```bash
cp .config/docker_example.yml .config/default.yml
cp .config/docker_example.env .config/docker.env
cp ./compose_example.yml ./compose.yml
```
## 编辑 default.yml
`default.yml` 是 Misskey 的核心配置文件。以下列出需要关注的关键配置项：

```yaml
url: https://example.tld/       # 必改：替换为你的实际域名

port: 3000                      # Misskey 监听端口，通常无需修改

db:
  host: db                     # 数据库主机名
  port: 5432                   # 数据库端口号
  db: misskey                   # 数据库名称
  user: example-misskey-user    # 数据库用户名
  pass: example-misskey-pass    # 数据库密码

dbReplications: false # 数据库复制，建议关闭

redis:
  host: redis                     # Redis 主机名
  port: 6379                      # Redis 端口号

id: 'aidx'                      # ID 生成方式，启动后请勿更改

fulltextSearch:
  provider: sqlLike             # 全文搜索，可选 sqlLike / sqlPgroonga / meilisearch

proxyBypassHosts: # 反向代理绕过主机名，用于访问外部服务
  - api.deepl.com               # DeepL API 主机名
  - api-free.deepl.com         # DeepL API 主机名，用于免费翻译
  - www.recaptcha.net          # reCAPTCHA 主机名，用于验证码
  - hcaptcha.com               # hCaptcha 主机名，用于验证码
  - challenges.cloudflare.com # Cloudflare 主机名，用于验证码
```

> **注意事项：**
> - `url` 和 `id` 这两项一旦启动实例后**不可更改**，请务必在首次启动前确认正确。
> - 更多可选配置（如 Sentry 错误追踪、Meilisearch、Redis 分离等）可参考 [Misskey 官方文档](https://misskey-hub.net/docs/admin/install-resources/)，此处不一一展开。
## 编辑 docker.env
`docker.env` 包含 PostgreSQL 的连接凭据，**必须与 `default.yml` 中的 `db` 配置保持一致**：
```env
POSTGRES_PASSWORD=example-misskey-pass
POSTGRES_USER=example-misskey-user
POSTGRES_DB=misskey
DATABASE_URL="postgres://${POSTGRES_USER}:${POSTGRES_PASSWORD}@db:5432/${POSTGRES_DB}"
```

> 如果修改了 `default.yml` 中的数据库用户名、密码或数据库名，请同步修改此处，否则 Misskey 将无法连接数据库。
## 编辑compose.yml
`compose.yml`文件定义了 Docker 容器的配置：
```yaml
services:
  web:
    build: .
    restart: always
    links:
      - db
      - redis
#     - mcaptcha
#     - meilisearch
    depends_on:
      db:
        condition: service_healthy
      redis:
        condition: service_healthy
    ports:
      - "3000:3000" # 映射主机端口到容器端口
    networks:
      - internal_network
      - external_network
    # env_file:
    #   - .config/docker.env
    volumes:
      - ./files:/misskey/files
      - ./.config:/misskey/.config:ro

  redis:
    restart: always
    image: redis:7-alpine
    networks:
      - internal_network
    volumes:
      - ./redis:/data
    healthcheck:
      test: "redis-cli ping"
      interval: 5s
      retries: 20

  db:
    restart: always
    image: postgres:18-alpine
    networks:
      - internal_network
    env_file:
      - .config/docker.env
    volumes:
      - ./db:/var/lib/postgresql
    healthcheck:
      test: "pg_isready -U $$POSTGRES_USER -d $$POSTGRES_DB"
      interval: 5s
      retries: 20

#  mcaptcha:
#    restart: always
#    image: mcaptcha/mcaptcha:latest
#    networks:
#      internal_network:
#      external_network:
#        aliases:
#          - localhost
#    ports:
#      - 7493:7493
#    env_file:
#      - .config/docker.env
#    environment:
#      PORT: 7493
#      MCAPTCHA_redis_URL: "redis://mcaptcha_redis/"
#    depends_on:
#      db:
#        condition: service_healthy
#      mcaptcha_redis:
#        condition: service_healthy
#
#  mcaptcha_redis:
#    image: mcaptcha/cache:latest
#    networks:
#      - internal_network
#    healthcheck:
#      test: "redis-cli ping"
#      interval: 5s
#      retries: 20

#  meilisearch:
#    restart: always
#    image: getmeili/meilisearch:v1.3.4
#    environment:
#      - MEILI_NO_ANALYTICS=true
#      - MEILI_ENV=production
#    env_file:
#      - .config/meilisearch.env
#    networks:
#      - internal_network
#    volumes:
#      - ./meili_data:/meili_data

networks:
  internal_network:
    internal: true
  external_network:

```
## 构建镜像与初始化数据库
使用以下命令进行Misskey的构建和数据库初始化。这可能需要一些时间。
```bash
docker compose build                # 构建 Docker 镜像（首次较慢）
docker compose run --rm web pnpm run init  # 初始化数据库
```
## 启动Misskey实例
完成构建和初始化后，使用以下命令启动Misskey容器：
```bash
docker compose up -d
```
## 故障排除
### INTERNAL_ERROR错误处理
访问实例时出现 `Misskey Internal error occurred`，通常是文件权限问题：
```bash
chmod -R 777 ./files
docker compose restart web
```
## 更新Misskey
当有新版本发布时，可以使用以下步骤更新Misskey实例：
```bash
git stash # 保存当前工作目录的更改
git checkout master # 切换到master分支
git pull # 拉取最新代码
git submodule update --init # 更新子模块
git stash pop # 恢复之前的更改
docker compose build # 构建新镜像
docker compose stop && docker compose up -d # 重启容器
```
# 结语
通过本教程，你已经完成了 Misskey 实例的部署。日常维护中，定期执行更新命令并关注日志输出，可以确保实例的稳定运行。  
如需进一步配置（如对象存储、邮件发送、防垃圾措施等），请参考 [Misskey Hub 官方文档](https://misskey-hub.net/)。