---
layout: post
title: "Ubuntu开发环境配置"
date: 2017-09-30 10:36
comments: true
reward: true
toc: true
tags: 
	- ubuntu
---

# Ubuntu开发环境配置
该项目记录开发环境常用的服务和工具的安装步骤,备不时之需.

<!-- more -->

<!-- vim-markdown-toc GFM -->
[安装软件](#安装软件)
  * [1.版本管理工具](#1.版本管理工具)
    * [安装Git](#安装Git)
    * [安装Svn](#安装Svn)
  * [2.前端开发环境](#2.前端开发环境)    
    * [安装配置angular2](#安装配置angular2)
  * [3.数据库服务](#3.数据库服务)    
    * [安装postgresql](#安装postgresql)
  * [4.其他软件](4.其他软件)    
      * [Nodepadqq](#Nodepadqq)
      * [集成开发环境jenkins](#集成开发环境jenkins)
      * [window支持软件](#wine安装)
  
[安装服务](#安装服务)
  * [1.安装ssh服务（用于xshell的连接）](#1.安装ssh服务 (用于xshell连接))  
  * [2.安装ftp服务](#2.安装ftp服务)
  
[安装SDK](#安装SDK)
  * [1.JAVA(JDK)](#1.JAVA(JDK))
  * [2.Go](#2.Go)

<!-- vim-markdown-toc GFM -->

## 安装软件
### 1.版本管理工具
#### 安装Git

* 安装Git

    > sudo apt-get install git
    
* 设置帐号

    > git config --global user.email "邮箱"     
      git config --global user.name "用户名"
      
* [可选]配置Git服务器
    
    > 当使用的是云服务器时，可以将git的配置作为中央git服务器
    添加用户
    
   * 创建一个git用户，用来运行git服务：
    
        > sudo adduser git
        
   * 管理公钥
   
        > 略
   
   * 禁用git用户shell登录
    
        > 修改 /etc/passwd 文件：  
          将
          git:x:1000:1000:,,,:/home/git:/bin/bash  
          改为
          git:x:1000:1000:,,,:/home/git:/usr/bin/git-shell  
          即把用户的登录Shell改为 /usr/bin/git-shell  
    
   * 初始化Git仓库
    
        > 切换到仓库存放目录，使用下面的命令初始化git仓库  
          sudo git init --bare project1.git   
          修改文件权限：  
          sudo chown -R git:git project1.git  
   
   * 克隆远程仓库
        
        > git clone git@www.darrenfang.com:/gits/project1.git   
        /gits/project1.git为服务器的绝对路径  

#### 安装Svn  

* 安装Svn

    > sudo apt-get install subversion
    
### 2.前端开发环境

#### 安装配置angular2
* 下载最新的nodejs  
    在[版本列表](https://nodejs.org/dist/)中下载：  
    > 如：  
    latest-v8.x/          26-Sep-2017 21:58         -    
    下载:  
    [node-v8.6.0-linux-x64](https://nodejs.org/dist/latest-v8.x/node-v8.6.0-linux-x64.tar.gz)
* 将下载的文件解压
    > 解压到文件夹：/xxx/node-v6.11.1-linux-x64
* 创建软链接
    > 打开bin目录可以看到node,npm文件  
    创建软链接：  
        sudo ln -s /xxx/node-v6.11.1-linux-x64/bin/node /usr/local/bin/node  
        sudo ln -s /xxx/node-v6.11.1-linux-x64/bin/npm /usr/local/bin/npm  
* 测试版本号
    > 在控制台打印版本号：  
    node -v  
    输出： v8.0.0  
    npm -v  
    输出： 5.0.0  
* 安装angular-cli
    > 确保原来不存在angular的安装记录或卸载干净后,执行：  
    npm install -g @angular/cli@latest
* [非必须步骤] 清除已有的angualr  

   > npm uninstall -g angular-cli  
    npm uninstall –save-dev angular-cli  
    npm cache clean  
    npm uninstall -g @angular/cli    
    npm cache clean  

* [非必须步骤] 重新安装本地文件

    > rm -rf node_modules dist  
    npm install –save-dev @angular/cli@latest  
    npm install  
    </code></pre>
    
* 为ng-cli创建软连接
    > 安装angular/cli完毕，nodejs的bin目录会多出ng文件，此时可以创建软链接  
    sudo ln -s /xxx/node-v6.11.1-linux-x64/bin/ng /usr/local/bin/ng
* [非必须步骤] 使用cnpm安装
    > npm i -g cnpm  
    cnpm i -g @angular/cli  
    如果已经安装过,需要先进行删除  
    npm uninstall -g angular-cli  
    npm cache clean  
    npm prune  
* 新建应用
    > ng new my-app  
    cd my-app  
    npm install  
    ng serve --open  
    
### 3.数据库服务
#### 安装postgresql

* 安装 PostgreSQL 的服务器和客户端

> sudo apt-get install postgresql postgresql-client

* 安装完成后 PostgreSQL 已经自动启动了,可尝试操作
    
    * 查看状态  
        > sudo /etc/init.d/postgresql status
    
    * 启动
        > sudo /etc/init.d/postgresql start
    
    * 停止
        > sudo /etc/init.d/postgresql stop
    
    * 重启
        > sudo /etc/init.d/postgresql restart

* 创建新用户

    * 创建数据库用户，并指定其为超级用户
    
        > sudo -u postgres createuser --superuser 用户名

* 登录数据库控制台，设置用户的密码，退出控制台：

    > sudo -u postgres psql  
      \password 用户名  
      # 输入密码  
      \q  

* 基本的数据操作

    * 创建数据库

        * 创建 test 数据库，指定用户为 [用户名]  

            > sudo -u postgres createdb -O [用户名] [数据库名]
            
    * 修改数据库 test 为 test1：

        > alter database test rename to test1;
    * 删除不需要的数据库

        > sudo -u postgres dropdb test

    * 登录数据库

        > psql -U root -d test -h 127.0.0.1 -p 5432  
          # -U 指定用户，-d 指定数据库，-h 指定服务器，-p 指定端口。
          实际的使用中，我们创建用户名和数据库跟系统名称一样（系统认证）
          然后通过：psql 即可登录我们指定的数据库。

    * 通过环境变量指定默认的数据库（test）：

        > export PGDATABASE=test
        
    * 常用控制台命令

        > \h：查看SQL命令的解释，比如\h select   
        \?：查看psql命令列表  
        \l：列出所有数据库  
        \c [database_name]：连接其他数据库  
        \d：列出当前数据库的所有表格  
        \d [table_name]：列出某一张表格的结构  
        \du：列出所有用户  
        \e：打开文本编辑器  
        \conninfo：列出当前数据库和连接的信息  
    
    * 创建表：
        
        > create table users (  
            id serial primary key,  
            username varchar(20),  
            password varchar(20)  
        );  

    * 插入数据：

        > insert into users(username, password) values('admin', 'admin');

    * 查询数据：

        > select * from users;

### 4.其他软件
#### Nodepadqq

* 安装  
> sudo add-apt-repository ppa:notepadqq-team/notepadqq  
sudo apt-get update  
sudo apt-get install notepadqq  

* 卸载  
> sudo apt-get remove notepadqq  
sudo add-apt-repository --remove ppa:notepadqq-team/notepadqq  

#### 集成开发环境jenkins

* 安装

    > 确保已经正确安装java后，用以下命令行安装  
    wget -q -O - http://pkg.jenkins-ci.org/debian/jenkins-ci.org.key | sudo apt-key add -  
    sudo sh -c 'echo deb http://pkg.jenkins-ci.org/debian binary/ > /etc/apt/sources.list.d/jenkins.list'  
    sudo apt-get update -y  
    sudo apt-get install jenkins -y  
    注：最后一个命令会等待较长时间，如果操作失败，换个时间重试即可。

* 启动/停止 服务
    
    > sudo /etc/init.d/jenkins  {start|stop|status|restart|force-reload}

* 查看初始密码

    > cat /var/lib/jenkins/secrets/initialAdminPassword

* 登录验证

    > 登录localhost:8080,初始化密码由上述步骤得到
    
* 相关

    > 安装目录：/var/lib/jenkins  
      日志目录：/var/log/jenkins/jenkins.log  
      配置文件：/etc/default/jenkins 可修改端口
#### wine安装

* 添加源、更新

    > sudo add-apt-repository ppa:wine/wine-builds
    > sudo apt-get update
    
* 安装
    
    > sudo apt-get install --install-recommends winehq-devel

* 查看版本
    
    > wine --version

* 配置wine

    > winecfg
    
# 安装QQ

    > 见http://blog.csdn.net/haofan_/article/details/78081404?utm_source=debugrun&utm_medium=referral

## 安装服务
### 1.安装ssh服务 (用于xshell连接)

* 更新源  
    > sudo apt-get update
    
* 安装ssh服务  
    > sudo apt-get install openssh-server
    
* 检测是否已启动  
    > ps -e | grep ssh  
    看到有ssh字样，说明已启动，如果没有就手动启动
* 启动ssh服务
    > /etc/init.d/ssh start  
* 配置ssh-server
    > 配置文件位于/etc/ssh/sshd_config，默认端口为22
    为了安全，一般自定义为其他端口，然后重启  
    sudo /etc/init.d/ssh restart

* 在windows中，使用putty或者SSH Secure Shell等登录虚拟机  

* 注意：若连接不上，尝试使用桥接方法，并使用ifconfig -a 查看ip

### 2.安装ftp服务
* 更新源  
    > sudo apt-get update
* 安装ftp服务  
    > apt-get install vsftpd  

* 解决只能下载不能上传  

    * 打开配置文件：
    
       >sudo vi /etc/vsftpd.conf  
       设置  
       write_enable=YES  
       
    * 重启服务：
    
       >sudo service vsftpd stop
       >sudo service vsftpd start
       
    * 同时，更改下Xftp下的权限。

## 安装SDK

### 1.JAVA(JDK)

#### Java有两个可选的安装版本 

* 1.安装openjdk



* 2.安装oracle Java JDK
    
    * 安装openjdk

    > $ sudo apt-get update  
      $ sudo apt-get install openjdk-8-jdk
    
    * 查看java版本：
   
    > $ java -version  
      java Ubuntu 16.04
    
* 下载Oracle Java JDK
    
    * 安装依赖包：
    
        > $ sudo apt-get install python-software-properties
    
    * 添加仓库源：
    
        > $ sudo add-apt-repository ppa:webupd8team/java
    
    * 更新软件包列表：
    
        > $ sudo apt-get update
    
    * 安装java JDK：
    
        > $ sudo apt-get install oracle-java8-installer
    
    * 安装过程中需要接受协议
    
    * 查看java版本：
    
    > $ java -version
    
* 如果你同时安装了以上两个版本，你可以自由的在这两个版本之间切换。执行：
    
    > $ sudo update-alternatives --config java  
    java Ubuntu 16.04
    前面带星号的是当前正在使用的java版本，键入编号选择使用哪个版本
    
* 编辑/etc/profile
    
    > 在文件尾添加java环境变量  
    $ sudo vim /etc/profile  
    ＃ 如果使用oracle java  
    export JAVA_HOME="/usr/lib/jvm/java-8-oracle/jre/bin"  
    
* 设置环境变量

    > 如果使用oracle java  
      export JAVA_HOME="/usr/lib/jvm/java-8-oracle/jre/bin"  
      如果使用openjdk  
      export JAVA_HOME="/usr/lib/jvm/java-8-openjdk-amd64/jre/bin"  
    

* 运行安装引导

    > sh jdk-8u141-nb-8_2-linux-x64.sh
    
### 2.Go

> 有两种方法安装Golang

#### 命令行安装

* 安装

    > sudo apt-get install golang  
      go env # 查看是否安装成功
      如果没有安装成功按照提示继续安装即可。
* 设置目录结构
  
  > 在命令行输入:  
   cd $HOME
   mkdir go //创建工作目录
   cd go       
   mkdir src bin pkg

* 环境变量设置
    
    >sudo vim /etc/profile   
     添加 export GOPATH=$HOME/go  
     使设置生效：source /etc/profile
     此外，GOROOT等环境变量已经按照默认的安装位置设置  

* 查看go环境变量

    > 命令行输入：  
    go env  


#### 下载安装包安装
* 打开[下载列表](https://golang.org/dl/)

* 选择合适版本下载,如：[go1.9.1-linux-64](https://storage.googleapis.com/golang/go1.9.1.linux-amd64.tar.gz)

* 解压到自己习惯的目录$THE_DIR，如：/usr/local/lib

    > 图形界面解压，或者：tar zxvf xxx.tar.gz -C $THE_DIR

* 设置环境变量

    > export PATH=$PATH:$THE_DIR/go/bin

* 测试版本

    > go version  
    输出：go version go1.9.1 linux/amd64
    


