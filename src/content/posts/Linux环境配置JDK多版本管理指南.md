---
title: Linux环境配置JDK多版本管理指南
date: 2024-04-04
lastMod: 2024-05-18T07:29:49.820Z
tags: [JDK, Linux]
category: 技术
summary: 这篇文章介绍了如何在配置多版本JDK。
---

## 一、使用 update-alternatives 管理 JDK

### 1. 下载并解压 JDK

```bash
# 下载JDK
cd /tmp
wget https://download.oracle.com/java/17/latest/jdk-17_linux-x64_bin.tar.gz

# 创建Java安装目录
sudo mkdir -p /usr/lib/jvm

# 解压JDK
sudo tar -xzf jdk-17_linux-x64_bin.tar.gz -C /usr/lib/jvm
```

### 2. 配置 update-alternatives

```bash
# 配置java命令
sudo update-alternatives --install /usr/bin/java java /usr/lib/jvm/jdk-17/bin/java 1700

# 配置javac命令
sudo update-alternatives --install /usr/bin/javac javac /usr/lib/jvm/jdk-17/bin/javac 1700

# 配置jar命令
sudo update-alternatives --install /usr/bin/jar jar /usr/lib/jvm/jdk-17/bin/jar 1700
java：运行Java程序
javac：编译Java源代码
jar：管理Java归档文件（打包、解包等）
### 3. 切换 Java 版本
sudo update-alternatives --config java
sudo update-alternatives --config javac
sudo update-alternatives --config jar

### 4. 验证安装
java -version
javac -version

```

## 二、环境变量配置（可选）

某些Java工具和IDE需要配置JAVA_HOME环境变量：

### 1. 不同环境变量配置文件

1. /etc/profile

- 系统级配置文件
- 对所有用户生效
- 用户登录时执行
- 需要root权限修改
- 适合配置系统级环境变量

2. ~/.bashrc

- 用户级配置文件
- 仅对当前用户生效
- 位于用户家目录
- 每次打开新终端执行
- 用户可自由修改
- 适合个人配置和别名设置

### 2. 环境变量配置文件区别

1. /etc/profile 执行 source 后：

- 只对当前终端会话立即生效
- 其他已经打开的终端不会生效
- 其他用户的终端不会生效
- 系统重启后对所有用户生效
- 用户新登录时生效

2. ~/.bashrc 执行 source 后：

- 只对当前用户的当前终端会话立即生效
- 当前用户的其他已打开终端不会生效
- 当前用户新开终端时会生效
- 其他用户不受影响
- 系统重启后对当前用户生效、

### 3. 要让配置全局立即生效的方法

1. 对于已经打开的终端，需要手动执行 source 命令
2. 或者关闭终端重新打开
3. 或者注销用户重新登录
4. 或者重启系统

### 4. 最佳实践

- 修改完配置文件后，建议在需要使用的终端都执行一下 source 命令
- 如果不确定配置是否生效，可以用 echo $变量名 来检查

### 5. 配置JAVA_HOME（根据需求选择配置文件）

```bash
# 在选定的配置文件中添加以下内容
export JAVA_HOME=/usr/lib/jvm/jdk-17
export PATH=$JAVA_HOME/bin:$PATH

# 使配置生效
source /etc/profile  # 或 source ~/.bashrc
```

## 三、注意事项

1. update-alternatives管理的优势：

- 方便切换不同Java版本
- 无需手动修改环境变量
- 系统级管理，更规范

2. JAVA_HOME配置的必要性：

- Maven、Gradle等构建工具需要
- 某些IDE依赖此变量
- 部分企业应用可能使用

3. 配置文件选择建议：

- 系统级配置使用/etc/profile
- 个人配置使用~/.bashrc
- 不确定时优先选择~/.bashrc

4. 路径和版本号注意事项：

- 路径要根据实际JDK安装位置调整
- 优先级数字(如1700)可根据需要调整
- 确保下载对应系统架构的JDK版本
