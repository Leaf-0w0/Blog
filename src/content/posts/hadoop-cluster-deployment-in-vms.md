---
title: 部署Hadoop完全分布式集群
published: 2025-12-08
description: Hadoop 3.1.3完全分布式集群部署详细指南
tags:
  - Linux
  - Hadoop
category: Tutorial
draft: false
image: ./post-cover/hadoop.webp
---
# 环境
**虚拟化平台**：VMware Workstation Pro 17  
**操作系统**：CentOS 7  
**Hadoop 版本**：3.1.3  
**Java 环境**：OpenJDK 1.8.0 
# 正式开始
## 一、准备工作
### 1. 克隆虚拟机
1. 启动 VMware Workstation Pro 17。  
2. 右键点击已配置好的 `hadoop1` 虚拟机，选择 **“管理” > “克隆”**。  
3. 在克隆向导中选择 **“完整克隆”**，创建两台新虚拟机。  
4. 克隆完成后，将拥有三台虚拟机：`hadoop1`、`hadoop2` 和 `hadoop3`。
### 2. 配置 VMware 虚拟网络
1. 点击顶部菜单栏 **“编辑” > “虚拟网络编辑器”**。  
2. 选中 **VMnet8（NAT 模式）**，取消勾选 **“使用本地 DHCP 服务将 IP 地址分配给虚拟机”**。  
3. 设置子网 IP 为：`192.168.121.0`。  
4. 点击 **“NAT 设置”**，将网关 IP 设为：`192.168.121.2`。  
5. 点击 **“应用”** 保存配置。
## 二、配置网络与 hosts 文件
### 1. 配置静态 IP
在每台虚拟机中执行以下操作：

编辑网络接口配置文件（假设网卡为 `ens33`）：
```bash
vi /etc/sysconfig/network-scripts/ifcfg-ens33
```
修改或添加如下内容（以 `hadoop1` 为例）：
```ini
BOOTPROTO=static
ONBOOT=yes
IPADDR=192.168.121.160
GATEWAY=192.168.121.2
DNS1=223.5.5.5
```

> **注意**：`hadoop2` 和 `hadoop3` 分别使用 `.161` 和 `.162` 作为 `IPADDR`。

保存后重启网络服务：
```bash
systemctl restart network
```
### 2. 设置主机名
分别在三台机器上设置唯一主机名：
```bash
# hadoop1
hostnamectl set-hostname hadoop1

# hadoop2
hostnamectl set-hostname hadoop2

# hadoop3
hostnamectl set-hostname hadoop3
```
### 3. 配置 `/etc/hosts`
在所有节点的 `/etc/hosts` 中添加以下内容：
```plaintext
192.168.121.160 hadoop1
192.168.121.161 hadoop2
192.168.121.162 hadoop3
```
确保三台机器的 `hosts` 文件完全一致。
## 三、配置 SSH 免密登录与安装基础环境
### 1. 生成 RSA 密钥
在每台机器上执行（一路回车使用默认路径）：
```bash
ssh-keygen -t rsa
```
### 2. 配置免密登录
以 `hadoop1` 为主控节点，执行以下命令将公钥分发到所有节点（包括自身）：
```bash
ssh-copy-id hadoop1
ssh-copy-id hadoop2
ssh-copy-id hadoop3
```
> 首次连接时会提示确认主机指纹，输入 `yes`，然后输入对应主机的 root 密码。
> **注意**：每台机子都需配置免密登录
### 3. 安装 OpenJDK
在所有节点安装含开发工具的 OpenJDK：
```bash
yum install -y java-1.8.0-openjdk-devel.x86_64
```
验证安装：
```bash
java -version
```
### 4. 安装 Hadoop
1. 安装文件上传工具：
   ```bash
   yum install -y lrzsz
   ```
2. 使用 `rz` 命令上传本地 Hadoop 安装包（如 `hadoop-3.1.3.tar.gz`）。
3. 解压至指定目录（例如 `/export/servers/`）：
   ```bash
   mkdir -p /export/servers
   tar -xzvf hadoop-3.1.3.tar.gz -C /export/servers/
   ```
## 四、配置 Hadoop 环境
### 1. 配置全局环境变量
编辑 `/etc/profile`，在文件末尾添加：
```bash
export JAVA_HOME=/usr/lib/jvm/java-1.8.0-openjdk
export HADOOP_HOME=/export/servers/hadoop-3.1.3
export PATH=$PATH:$JAVA_HOME/bin:$HADOOP_HOME/bin:$HADOOP_HOME/sbin
```
使配置生效：
```bash
source /etc/profile
```
### 2. 修改 Hadoop 配置文件
进入配置目录：
```bash
cd /export/servers/hadoop-3.1.3/etc/hadoop/
```
#### **core-site.xml**
```xml
<?xml version="1.0" encoding="UTF-8"?>
<?xml-stylesheet type="text/xsl" href="configuration.xsl"?>

<configuration>
<property>
    <name>fs.defaultFS</name>
    <value>hdfs://hadoop1:9000</value>
</property>
<property>
    <name>hadoop.tmp.dir</name>
    <value>/export/data/hadoop-wfb-3.1.3</value>
</property>
<property>
   <name>hadoop.http.staticuser.user</name>
   <value>root</value>
</property>
</configuration>
```
#### **hdfs-site.xml**
```xml
<?xml version="1.0" encoding="UTF-8"?>
<?xml-stylesheet type="text/xsl" href="configuration.xsl"?>

<configuration>
<!-- nn web端访问地址-->
    <property>
        <name>dfs.namenode.http-address</name>
        <value>hadoop1:9870</value>
    </property>
	<!-- 2nn web端访问地址-->
    <property>
        <name>dfs.namenode.secondary.http-address</name>
        <value>hadoop3:9868</value>
    </property>
</configuration>
```
#### **hadoop-env.sh**
```shell
export HADOOP_OS_TYPE=${HADOOP_OS_TYPE:-$(uname -s)}
export JAVA_HOME=/export/servers/jdk1.8.0_212
export HDFS_NAMENODE_USER=root
export HDFS_DATANODE_USER=root
export HDFS_SECONDARYNAMENODE_USER=root
export YARN_RESOURCEMANAGER_USER=root
export YARN_NODEMANAGER_USER=root
```
#### **mapred-site.xml**
```xml
<?xml version="1.0"?>
<?xml-stylesheet type="text/xsl" href="configuration.xsl"?>

<configuration>
    <property>
        <name>mapreduce.framework.name</name>
        <value>yarn</value>
    </property>
</configuration>
```
#### **yarn-site.xml**
```xml
<?xml version="1.0"?>

<configuration>
<!-- Site specific YARN configuration properties -->
<!-- 指定MR走shuffle -->
    <property>
        <name>yarn.nodemanager.aux-services</name>
        <value>mapreduce_shuffle</value>
    </property>

    <!-- 指定ResourceManager的地址-->
    <property>
        <name>yarn.resourcemanager.hostname</name>
        <value>hadoop2</value>
    </property>
    <!-- 环境变量的继承 -->
    <property>
        <name>yarn.nodemanager.env-whitelist</name><value>JAVA_HOME,HADOOP_COMMON_HOME,HADOOP_HDFS_HOME,HADOOP_CONF_DIR,CLASSPATH_PREPEND_DISTCACHE,HADOOP_YARN_HOME,HADOOP_MAPRED_HOME</value>
    </property>
<property>
    <name>yarn.resourcemanager.webapp.address</name>
    <value>hadoop2:8088</value> <!-- ResourceManager WebUI端口 -->
</property>
  <property>
    <name>yarn.resourcemanager.address</name>
    <value>hadoop2:8032</value> <!-- 资源管理器地址 -->
</property>
  <property>
    <name>yarn.resourcemanager.scheduler.address</name>
    <value>hadoop2:8030</value> <!-- 调度器地址 -->
</property>
</configuration>
```
#### **workers**
```plaintext
hadoop1
hadoop2
hadoop3
```
### 3. 分发配置
将 Hadoop 安装目录和 `/etc/profile` 配置同步到其他节点（以 `hadoop1` 为源）：
```bash
scp -r /export/servers/hadoop-3.1.3 root@hadoop2:/export/servers/
scp -r /export/servers/hadoop-3.1.3 root@hadoop3:/export/servers/

scp /etc/profile root@hadoop2:/etc/
scp /etc/profile root@hadoop3:/etc/
```
在 `hadoop2` 和 `hadoop3` 上执行：
```bash
source /etc/profile
```
### 4. 初始化与启动集群
#### 格式化 HDFS（仅在 hadoop1 执行一次）
```bash
hdfs namenode -format
```
#### 启动 HDFS（在 hadoop1）
```bash
start-dfs.sh
```
#### 启动 YARN（在 hadoop2）
```bash
start-yarn.sh
```
### 验证进程
在各节点运行 `jps`，预期输出：
- **hadoop1**：NameNode、DataNode、NodeManager  
- **hadoop2**：ResourceManager、NodeManager、DataNode  
- **hadoop3**：NodeManager、DataNode、SecondaryNameNode
## 五、访问 Web 管理界面
### 1. 关闭防火墙（所有节点）
```bash
systemctl stop firewalld
systemctl disable firewalld
```
### 2. 配置本地 hosts（Windows）
编辑本地 Windows 的 `C:\Windows\System32\drivers\etc\hosts` 文件，添加：
```plaintext
192.168.121.160 hadoop1
192.168.121.161 hadoop2
192.168.121.162 hadoop3
```
### 3. 访问 Web UI
- **HDFS 管理界面**：http://hadoop1:9870  
- **YARN 资源管理器**：http://hadoop2:8088
