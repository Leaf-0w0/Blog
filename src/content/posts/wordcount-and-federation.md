---
title: 词频统计与Federation机制的实现
published: 2025-12-09
description: Hadoop词频统计与Federation机制实现指南
tags:
  - Linux
  - Hadoop
category: Tutorial
draft: false
image: ./post-cover/hadoop.webp
---
# 词频统计
1. 在 HDFS 中创建输入目录：
   ```bash
   hdfs dfs -mkdir -p /wordcount/input
   ```
2. 在 `hadoop1` 节点本地创建 `word.txt` 文件并写入测试文本，然后上传至 HDFS：
   ```bash
   hdfs dfs -put ./word.txt /wordcount/input
   ```
3. 进入 MapReduce 示例 JAR 所在目录，运行 WordCount 作业：
   ```bash
   cd /export/servers/hadoop-3.1.3/share/hadoop/mapreduce/
   hadoop jar hadoop-mapreduce-examples-3.1.3.jar wordcount /wordcount/input /wordcount/output
   ```
> **注意**：输出路径 `/wordcount/output` 默认应为不存在，否则将操作失败
# Federation 机制配置
参考：NameNode和SecondaryNameNode部署在hadoop2和hadoop3上
## 1. 停止现有 Hadoop 服务
在 `hadoop1` 上依次执行以下命令，关闭 YARN 和 HDFS：
```bash
stop-yarn.sh
stop-dfs.sh
```
## 2. 清理旧数据
在 `hadoop1`、`hadoop2` 和 `hadoop3` 上删除 HDFS 数据目录（根据实际配置路径）：
```bash
rm -rf /export/data/hadoop-wfb-3.1.3/*
```
## 3. 修改 `hdfs-site.xml` 配置文件
在 `hadoop1` 上编辑 Hadoop 配置文件：
```bash
vi /export/servers/hadoop-3.1.3/etc/hadoop/hdfs-site.xml
```
替换为以下支持 Federation 的配置：
```xml
<?xml version="1.0" encoding="UTF-8"?>
<?xml-stylesheet type="text/xsl" href="configuration.xsl"?>

<configuration>
    <property>
        <name>dfs.replication</name>
        <value>2</value>
    </property>
    <property>
        <name>dfs.nameservices</name>
        <value>ns1,ns2</value>
    </property>
    <property>
        <name>dfs.namenode.rpc-address.ns1</name>
        <value>hadoop2:9000</value>
    </property>
    <property>
        <name>dfs.namenode.http-address.ns1</name>
        <value>hadoop2:9870</value>
    </property>
    <property>
        <name>dfs.namenode.secondary.http-address.ns1</name>
        <value>hadoop2:9880</value>
    </property>
    <property>
        <name>dfs.namenode.rpc-address.ns2</name>
        <value>hadoop3:9000</value>
    </property>
    <property>
</configuration>
```
## 4. 分发配置文件
将更新后的 `hdfs-site.xml` 同步到 `hadoop2` 和 `hadoop3`：
```bash
scp /export/servers/hadoop-3.1.3/etc/hadoop/hdfs-site.xml root@hadoop2:/export/servers/hadoop-3.1.3/etc/hadoop/
scp /export/servers/hadoop-3.1.3/etc/hadoop/hdfs-site.xml root@hadoop3:/export/servers/hadoop-3.1.3/etc/hadoop/
```
## 5. 格式化 NameNode（带统一 Cluster ID）
在 `hadoop2` 上格式化第一个命名空间：
```bash
hdfs namenode -format -clusterId fed1
```
在 `hadoop3` 上格式化第二个命名空间（**必须使用相同的 `-clusterId`**）：
```bash
hdfs namenode -format -clusterId fed1
```
> **关键说明**：Federation 要求所有 NameNode 使用相同的 `clusterId`，否则无法共存于同一集群。
## 6. 启动 Hadoop 集群
在 `hadoop2` 上启动 HDFS（YARN 仍由原 ResourceManager 节点管理，此处建议按实际架构调整）：
```bash
start-dfs.sh
```
> **注意**：
> YARN 通常不需要随 Federation 改动。若 ResourceManager 仍在 `hadoop2`，可继续执行：
> ```bash
> start-yarn.sh
> ```
## 7. 验证进程
在 `hadoop1`、`hadoop2`、`hadoop3` 上分别执行：
```bash
jps
```
预期结果：
- **hadoop2**：NameNode（ns1）、DataNode、SecondaryNameNode、ResoureceManager、NodeManager
- **hadoop3**：NameNode（ns2）、DataNode、NodeManager、SecondaryNameNode
- **hadoop1**：DataNode、NodeManager
