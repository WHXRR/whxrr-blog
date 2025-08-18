---
title: "Docker常用命令"
outline: deep
desc: "Docker常用命令"
tags: "docker"
updateTime: "2025-08-18 14:26"
pic: https://cdn.pixabay.com/photo/2021/08/17/17/52/cat-6553749_1280.jpg
picSize: 1096x782
---

## 🐳 基础命令

##### 查看 docker 版本

```bash
docker -v
```

##### 查看 docker 系统信息

```bash
docker info
```

## 📦 镜像

##### 拉取镜像

```bash
docker pull <镜像名>:<tag>
```

##### 查看本地镜像

```bash
docker images
```

##### 删除镜像

```bash
docker rmi <镜像ID>
docker rmi -f <镜像ID>  # 强制删除
```

## 🚀 容器

##### 查看正在运行的容器

```bash
docker ps
```

##### 查看所有容器（包含已停止）

```bash
docker ps -a
```

##### 停止容器

```bash
docker stop <容器ID/容器名>
```

##### 启动已停止容器

```bash
docker start <容器ID/容器名>
```

##### 重启容器

```bash
docker restart <容器ID/容器名>
```

##### 删除容器

```bash
docker rm <容器 ID/容器名>
docker rm -f <容器 ID/容器名>
```

##### 查看容器日志

```bash
docker logs -f <容器ID/容器名>   # -f 实时输出
```

##### 进入容器交互

```bash
docker exec -it <容器 ID/容器名> /bin/bash
```

## 📄 Docker Compose

##### 启动

```bash
docker-compose up -d --build  # -d 后台运行 --build 重新构建镜像
```

##### 停止

```bash
docker-compose down
```

##### 查看日志

```bash
docker-compose logs -f
```

##### 重启服务

```bash
docker-compose restart <服务名>
```
