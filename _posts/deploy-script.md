---
layout: post
title: "小水管和blog的构建脚本"
date: 2018-01-02 12:24
real-date: 2018-05-15 16:53
comments: false
reward: false
toc: true
tags: 
	- ubuntu
	- tools
---

小水管和blog的构建脚本。

<!--more-->

### 小水管自动构建

// killApp.sh

通过名字或者占用的端口号查杀进程。

```bash
killAppByName(){
        if [ -z $# ];then echo '请指定任务.';return; fi
        for app in $@;do
                pid=`ps -ef | grep $app | grep -v "grep" | awk '{print $2}'`
                if [ -z $pid ];then echo "找不到${app}相关进程." ; continue; fi
                echo 找到${app}相关进程：${pid[@]}
                for id in $pid;do
                kill -9 $id
                echo "杀死进程 + ${id}"
                done
        done
}
killAppByPort(){
        if [ -z $# ];then echo "请指定端口！";return;fi
        for port in $@;do
                t_pid=`lsof -n -P -t -i :$port`
                if [ -n "$t_pid" ]
                then
                echo 找到占用${port}端口的程序[${t_pid}]
                kill -9 $t_pid
                else
                echo 端口${port}未被占用
                fi
        done
}

```

// rebuildFangtan.sh

查杀进程->更新代码->编译程序->运行程序
```bash
export GOPATH="/home/ubuntu/go"
export GOROOT="/usr/local/go"

AppPath=/home/ubuntu/project/golang-web/src
AppPort=80
AppName=fangtan

. ./killApp.sh && killAppByPort $AppPort
cd $AppPath
rm -rf ./$AppName
echo 更新远程代码中...
git pull
$GOROOT/bin/go build -o fangtan
(sudo ./fangtan &)
echo 'finish！'
```

### 博客编译到小水管静态目录

```bash
# 项目路径
blogPath=/home/ubuntu/project/jblog
cd $blogPath
hexo generate -f
echo 'build ok!'
```