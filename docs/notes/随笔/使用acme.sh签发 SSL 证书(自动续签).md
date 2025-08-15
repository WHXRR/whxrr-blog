---
title: "使用acme.sh签发 SSL 证书 (自动续签)"
outline: deep
desc: "使用acme.sh签发 SSL 证书 (自动续签)"
tags: "acme.sh|ssl|证书"
updateTime: "2025-08-14 16:40"
pic: https://cdn.pixabay.com/photo/2023/06/16/21/13/landscape-8068792_960_720.jpg
picSize: 960x640
---

## 安装 acme.sh

[原教程](https://github.com/acmesh-official/acme.sh/wiki/%E8%AF%B4%E6%98%8E)

```bash
curl https://get.acme.sh | sh -s email=my@example.com
```

> [!TIP]
> 如果安装完成后提示 -bash: acme.sh: command not found，需要手动执行 source ~/.bashrc

## 生成证书

我的项目是通过 docker 部署的，通过 nginx 进行了反向代理，所以使用 Nginx 模式

```bash
acme.sh --issue --nginx -d whxrr.top -d chat.whxrr.top
```

## 复制证书

1. 创建证书目录

```bash
mkdir /etc/nginx/tls
```

2. 执行命令

```bash
acme.sh --install-cert -d whxrr.top \
--key-file /etc/nginx/tls/key.pem \
--fullchain-file /etc/nginx/tls/cert.pem \
--reloadcmd "service nginx force-reload"
```

## 修改 nginx 配置文件

```bash
vim /etc/nginx/site-available/whxrr-blog
```

```nginx
server {
    listen 443 ssl http2;
    server_name whxrr.top;
    ssl_certificate /etc/nginx/tls/cert.pem;
    ssl_certificate_key /etc/nginx/tls/key.pem;
    ...
}
```

重启 nginx

```bash
service nginx force-reload
```
