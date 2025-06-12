---
title: "Docker + Jenkins + Nginx 部署前端项目全流程"
outline: deep
desc: "基于 Ubuntu 22.04，使用 Docker 安装 Jenkins, 配置Nginx, 实现 VitePress 项目的自动化部署"
tags: "css"
updateTime: "2025-06-12 17:33"
pic: https://cdn.pixabay.com/photo/2023/06/16/21/13/landscape-8068793_960_720.jpg
---

踩了两天的坑，终于成功将我的 VitePress 项目通过 Jenkins 自动部署到服务器上，以下是详细步骤记录与说明。

## Docker 安装与配置

### 1. 更新软件包

```bash
sudo apt update
```

### 2. 安装必要的软件包

```bash
sudo apt install apt-transport-https ca-certificates curl gnupg lsb-release
```

### 3. 添加 Docker 的 GPG 密钥

```bash
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /usr/share/keyrings/docker-archive-keyring.gpg
```

### 4. 添加 Docker 的仓库

```bash
echo "deb [arch=amd64 signed-by=/usr/share/keyrings/docker-archive-keyring.gpg] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
```

### 5. 安装 Docker

```bash
sudo apt-get install docker-ce docker-ce-cli containerd.io
```

### 6. 配置 Dockerhub 镜像源使用教程（可选）

```bash
sudo mkdir -p /etc/docker
sudo tee /etc/docker/daemon.json <<EOF
{
  "registry-mirrors": [
    "https://docker.1panel.live",
    "https://docker.1ms.run",
    "https://dytt.online",
    "https://lispy.org",
    "https://docker.xiaogenban1993.com",
    "https://docker.yomansunter.com",
    "https://666860.xyz",
    "https://a.ussh.net",
    "https://hub.rat.dev",
    "https://docker.m.daocloud.io"
  ]
}
EOF
sudo systemctl daemon-reload
sudo systemctl restart docker
```

> [!TIP]
> 查看详细教程 [Dockerhub 镜像源使用教程](https://github.com/dongyubin/DockerHub)

### 7. 设置 Docker 开机自启动

```bash
sudo systemctl enable docker
```

### 8. 启动 Docker

```bash
sudo systemctl start docker
```

### 9. 测试 Docker 是否安装成功

```bash
sudo docker run hello-world
```

输出以下内容则表示安装成功

```
Hello from Docker!
This message shows that your installation appears to be working correctly.

To generate this message, Docker took the following steps:
 1. The Docker client contacted the Docker daemon.
 2. The Docker daemon pulled the "hello-world" image from the Docker Hub.
    (amd64)
 3. The Docker daemon created a new container from that image which runs the
    executable that produces the output you are currently reading.
 4. The Docker daemon streamed that output to the Docker client, which sent it
    to your terminal.

To try something more ambitious, you can run an Ubuntu container with:
 $ docker run -it ubuntu bash

Share images, automate workflows, and more with a free Docker ID:
 https://hub.docker.com/

For more examples and ideas, visit:
 https://docs.docker.com/get-started/
```

### 10. 常用 Docker 命令

```bash
# 搜索镜像
docker search 镜像名

# 下载镜像
docker pull 镜像名

# 查看本地镜像
docker images

# 运行容器
docker run -it 镜像名

# 查看运行中的容器
docker ps

# 查看所有容器
docker ps -a

# 停止容器
docker stop 容器ID

# 删除容器
docker rm 容器ID

# 删除镜像
docker rmi 镜像ID

```

## Jenkins 安装与初始化

### 1. 拉取镜像

```bash
# 以 root 用户身份运行容器，方便在构建任务中执行如复制文件、安装依赖等需要高权限的操作
docker run -u root -d \
# 容器起名叫 jenkins, 执行 docker restart jenkins、docker logs jenkins 等命令管理它
  --name jenkins \
# 映射端口，将容器的 8080 端口映射到主机的 8080 端口
  -p 8080:8080 \
# Jenkins 的“代理端口”
  -p 50000:50000 \
# 把 Jenkins 的配置文件目录（插件、构建历史、任务数据等）持久化到一个 Docker 卷中，叫做 jenkins_home
  -v jenkins_home:/var/jenkins_home \
# 我部署的网站所在路径,后面要将容器中的打包文件拷贝到主机的 /var/www 目录下
  -v /var/www:/var/www \
# 把宿主机的 SSH 密钥文件夹挂载到容器中
  -v /root/.ssh:/root/.ssh \
# 允许容器内部访问宿主机的 Docker 服务
  -v /var/run/docker.sock:/var/run/docker.sock \
# 设置容器自动重启
  --restart unless-stopped \
# 使用官方 Jenkins 的 LTS（长期支持）版本 镜像
  jenkins/jenkins:lts

```

### 2. 访问 Jenkins

```
http://你的服务器IP:8080
```

> [!TIP]
> 访问不了，可能是防火墙的问题，需要开放端口，或者去控制台的防火墙添加 8080 端口。

初次访问需输入初始密码

```bash
docker exec -it jenkins cat /var/jenkins_home/secrets/initialAdminPassword
```

根据提示，安装插件，创建管理员用户，完成初始化。

### 3. 安装插件

- NodeJS plugin
- GitHub plugin
- Localization: Chinese (Simplified)

![安装步骤1](/notes/jenkins/插件1.jpg)

![安装步骤2](/notes/jenkins/插件2.jpg)

### 4. 配置 nodejs

![node](/notes/jenkins/node1.jpg)

![node](/notes/jenkins/node2.jpg)

![node](/notes/jenkins/node3.jpg)

### 5. 创建任务

#### 步骤 1

![step](/notes/jenkins/step1.jpg)

![step](/notes/jenkins/step2.jpg)

#### 步骤 2

> [!TIP]
> 这里的 Credentials 没有选择，因为前面拉取镜像的时候通过
> -v /root/.ssh:/root/.ssh \
> 把宿主机的 SSH 密钥文件夹挂载到容器中了，所以这里不需要选择。
> 如果你的服务器没有 SSH 密钥，需要在 Jenkins 中配置凭证。一种是通过配置 ssh，一种是通过配置用户名密码，我这里都试了一遍都不行。

![step](/notes/jenkins/step3.jpg)

#### 步骤 3

> [!TIP]
> 如果想配置 GitHub 推送代码时自动部署，需要去 GitHub 中配置 Webhooks。具体如下，不需要则跳到步骤 4

![step](/notes/jenkins/step4.jpg)

> [!TIP]
> Payload URL 填写 http://你服务器 ip:8080/github-webhook/

![step](/notes/jenkins/step5.jpg)

> [!TIP]
> Triggers 中勾上 GitHub hook trigger for GITScm polling

![step](/notes/jenkins/step6.jpg)

#### 步骤 4

> [!TIP]
> Build Steps 中选择 Execute NodeJS script，选择前面配置好的版本

![step](/notes/jenkins/step7.jpg)

#### 步骤 5

> [!TIP]
> 选择 Add build step，添加 Execute shell，根据你项目的打包命令填写，我的项目是 vitepress，填写的命令如下

```bash
#!/bin/bash
# 声明使用 Bash 解释器执行脚本
# （建议保留，确保脚本不会因解释器不同而出错）

node -v
# 输出当前 Node.js 版本（调试用，可选）

npm -v
# 输出当前 npm 版本（调试用，可选）

npm i -g pnpm
# 全局安装 pnpm 包管理工具，确保后续命令可用
# 注意：如果容器或服务器已装可跳过，提高构建速度

pnpm install
# 安装项目依赖，读取项目根目录下的 `package.json`

pnpm run docs:build
# 执行构建命令，通常是 VitePress 的 `vitepress build` 命令
# 构建后的静态页面会输出到 `docs/.vitepress/dist/` 目录

mkdir -p /xxxx
# 创建部署目录（如果不存在），此路径为 nginx 配置的根目录

rm -rf /xxxx/*
# 清空旧的构建文件，确保新部署不会被旧文件干扰

cp -r docs/.vitepress/dist/* /xxxx/
# 将构建好的静态文件复制到 nginx 服务的部署目录

```

![step](/notes/jenkins/step8.jpg)

#### 步骤 6

保存后点击左侧的 Build Now，如果失败可以点进去点左侧 Console Output 查看错误信息。

## Nginx

### 1. 安装 Nginx

```bash
sudo apt update
sudo apt install nginx -y
```

### 2. 设置 Nginx 开机自启动 & 启动服务

```bash
sudo systemctl enable nginx
sudo systemctl start nginx
```

### 3. 配置 Nginx

#### 编辑或创建配置文件

```bash
sudo nano /etc/nginx/sites-available/xxx  # 我这边方便管理，新建了个项目对应的配置文件
```

```nginx
server {
    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;

    listen 80;
    server_name 你的域名;

    index index.html;

    location / {
        root /var/www/whxrr-blog-dist; # 这里填写你的项目路径，我将项目放在 /var/www 目录下，放其他地方没有权限

        try_files $uri $uri.html $uri/ =404;
        error_page 404 /404.html;
        error_page 403 /404.html;

        location ~* ^/assets/ {
            expires 1y;
            add_header Cache-Control "public, immutable";
        }
    }
}

```

### 4. 测试配置是否正确

```bash
sudo nginx -t
```

### 5. 重新加载 Nginx

```bash
sudo systemctl reload nginx
```

### 6. 配合 Jenkins 的目录结构建议, 确保 Jenkins shell 构建脚本中的路径一致：

```bash
mkdir -p /var/www/whxrr-blog-dist
rm -rf /var/www/whxrr-blog-dist/*
cp -r docs/.vitepress/dist/* /var/www/whxrr-blog-dist/
```
