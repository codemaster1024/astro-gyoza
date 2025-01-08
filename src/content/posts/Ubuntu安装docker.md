---
title: 在 Ubuntu 20.04 上安装 Docker
date: 2023-07-08
lastMod: 2023-07-08T07:29:49.820Z
tags: [Ubuntu, Docker]
category: 技术
summary: 这篇文章介绍了如何在ubuntu上安装Docker
---

## 在 Ubuntu 20.04 上安装 Docker

在 Ubuntu 上安装 Docker 非常直接。我们将会启用 Docker 软件源，导入 GPG key，并且安装软件包。

首先，更新软件包索引，并且安装必要的依赖软件，来添加一个新的 HTTPS 软件源：

```sql
sudo apt update
sudo apt install apt-transport-https ca-certificates curl gnupg-agent software-properties-common
```

使用下面的 `curl` 导入源仓库的 GPG key：

```cpp
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo apt-key add -
```

将 Docker APT 软件源添加到你的系统：

```dockerfile
sudo add-apt-repository "deb [arch=amd64] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable"
```

现在，Docker 软件源被启用了，你可以安装软件源中任何可用的 Docker 版本。

01.想要安装 Docker 最新版本，运行下面的命令。如果你想安装指定版本，跳过这个步骤，并且跳到下一步。

```lua
sudo apt update
sudo apt-get install docker-ce docker-ce-cli containerd.io -y


```

02.想要安装指定版本，首先列出 Docker 软件源中所有可用的版本：

```css
sudo apt update
apt list -a docker-ce
```

可用的 Docker 版本将会在第二列显示。在写作这篇文章的时候，在官方 Docker 软件源中只有一个 Docker 版本（`5:19.03.9~3-0~ubuntu-focal`）可用：

```bash
docker-ce/focal 5:19.03.9~3-0~ubuntu-focal amd64
```

通过在软件包名后面添加版本`=<VERSION>`来安装指定版本：

```xml
sudo apt install docker-ce=<VERSION> docker-ce-cli=<VERSION> containerd.io
```

一旦安装完成，Docker 服务将会自动启动。你可以输入下面的命令，验证它：

```lua
sudo systemctl status docker
```

输出将会类似下面这样：

```yaml
● docker.service - Docker Application Container Engine
     Loaded: loaded (/lib/systemd/system/docker.service; enabled; vendor preset: enabled)
     Active: active (running) since Thu 2020-05-21 14:47:34 UTC; 42s ago
...
```

当一个新的 Docker 发布时，你可以使用标准的`sudo apt update && sudo apt upgrade`流程来升级 Docker 软件包。

如果你想阻止 Docker 自动更新，锁住它的版本：

```css
sudo apt-mark hold docker-ce
```

## 以非 Root 用户身份执行 Docker

默认情况下，只有 root 或者 有 sudo 权限的用户可以执行 Docker 命令。

想要以非 root 用户执行 Docker 命令，你需要将你的用户添加到 Docker 用户组，该用户组在 Docker CE 软件包安装过程中被创建。想要这么做，输入：

```bash
sudo usermod -aG docker $USER
```

`$USER`是一个环境变量，代表当前用户名。

登出，并且重新登录，以便用户组会员信息刷新。

## 验证安装过程

想要验证 Docker 是否已经成功被安装，你可以执行`docker`命令，前面不需要加`sudo, 我们将会运行一个测试容器:

```dockerfile
docker container run hello-world
```

如果本地没有该镜像，这个命令将会下载测试镜像，在容器中运行它，打印出 “Hello from Docker”，并且退出。

## 卸载 Docker

在卸载 Docker 之前，你最好 移除所有的容器，镜像，卷和网络。

运行下面的命令停止所有正在运行的容器，并且移除所有的 docker 对象：

```scss
docker container stop $(docker container ls -aq)
docker system prune -a --volumes
```

现在你可以使用`apt`像卸载其他软件包一样来卸载 Docker：

```shell
sudo apt purge docker-ce
sudo apt autoremove
```

```
查看docker是否卸载干净
dpkg -l | grep docker
dpkg -l |grep ^rc|awk '{print $2}' |sudo xargs dpkg -P # 删除无用的相关的配置文件
```

删除没有删除的相关插件

```
apt-get autoremove docker-ce-*
```

删除docker的相关配置&目录

```javascript
rm -rf /etc/systemd/system/docker.service.d
rm -rf /var/lib/docker
```

确定docker卸载完毕

```javascript
docker --version
```

## 修改默认存储路径

```
sudo vim /etc/docker/daemon.json
```

默认情况下这个配置文件是没有的，这里实际也就是新建一个，然后写入以下内容：

```html
{ "data-root": "/var/www/dockerdata" }
```

此文件还涉及默认源的设定，如果设定了国内源，那么实际就是在源地址下方加一行，写成：

```html
{ "registry-mirrors": [ "https://kfwkfulq.mirror.aliyuncs.com",
"https://2lqq34jg.mirror.aliyuncs.com", "https://pee6w651.mirror.aliyuncs.com",
"https://registry.docker-cn.com", "http://hub-mirror.c.163.com" ], "data-root":
"/var/www/dockerdata" }
```

保存退出，然后重启 docker 服务：

```bash
sudo systemctl restart docker
```
