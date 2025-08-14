---
title: "shopify 国内启动cli网络问题"
outline: deep
desc: "shopify 国内启动cli网络问题"
tags: "shopify"
updateTime: "2025-08-07 10:36"
pic: https://cdn.pixabay.com/photo/2025/08/11/16/12/sea-9768639_1280.jpg
picSize: 1280x853
---

## 1. 将 cli 升级到 3.78+，目前这个版本支持设置代理

[shopify cli 文档](https://shopify.dev/docs/api/shopify-cli)

[GitHub 文档](https://github.com/Shopify/cli/blob/d0bbf05c28e22ad8b4ba17767bf7aff28ac71ddc/RELEASE_NOTES/3.78.md?plain=1#L2)

## 2. 设置系统环境变量

```bash
setx SHOPIFY_HTTP_PROXY "http://127.0.0.1:7897"
setx SHOPIFY_HTTPS_PROXY "http://127.0.0.1:7897"
```

![vpn](/notes/shopify/vpn.jpg)

> [!TIP]
> 我使用的是 clash verge，端口是 7897，其他 vpn 可以去对应的设置中查看端口

### 3. 其他

我这边设置好后运行还是有网络问题

```
Error: connect ETIMEDOUT 34.111.204.238:443
    at TCPConnectWrap.afterConnect [as oncomplete] (node:net:1634:16)
```

谷歌了一下说要开启 VPN 的 tun 模式

[问题帖子](https://community.shopify.dev/t/when-running-the-remix-application-an-error-occurred-connect-etimedout-and-the-project-was-terminated/16775)

但是我使用的是 clash verge 2.3.1 版本，开启 tun 模式后无法上网了，于是继续谷歌，按他的方法解决了，不过每次重启电脑都要设置一遍

[解决方法](https://github.com/clash-verge-rev/clash-verge-rev/issues/1490#issuecomment-2348704302)

开启 tun 模式后，能正常使用 shopify cli
