---
layout: post
title: "Git实践"
date: 2017-11-03 12:32
comments: false
reward: false
toc: true
tags: 
	- github
	- tools
---

### Git-flow 工作方式

上次敲错了 git命令，大佬给推荐了**git-flow**。我还只是看了大概的介绍，因为自己想先把git命令敲熟悉了，使用git-flow还需要整个团队其它人也接受并熟悉这种工作方式，所以暂时也没有安装git-flow。

git-flow是一种流行并行之有效的工作方式，它使用脚本组合了系列 git指令，可以通过简短的指令来控制工作流程。

此外，建议安装**GitKraken**，这是一个 Git可视化的程序。不知道用可视化的东西会不会被鄙视 = =。。。实际上，**GitKraken**可以用来辅助自己熟悉Git命令，在敲打命令之后可以打开GitKraken，看看整个Git线条是怎么变化的，这样可以更直观的理解 Git的运行机制。在处理复杂的事务的时候使用可视化也可以避免敲错命令，搞得一团糟。

<!--more-->

详见：[git-flow 的工作流程](https://www.git-tower.com/learn/git/ebook/cn/command-line/advanced-topics/git-flow)

<!--more-->

### Git常用命令

![Git常用命令](git-commonds.jpg)

- 忽略本地对已经在版本控制中的文件的修改
  
  git update-index --assume-unchanged index.jsp
  
- 取消本地忽略
  
  git update-index --no-assume-unchanged index.jsp
  
- 查看本地仓库哪些文件被加入忽略列表
  
  git  ls-files -v

### Git概念和实践

#### 分支

- 创建 A功能分支。习惯用 feature创建新功能，使用 fix修复bug
```bash
git branch feature/A
  创建本地分支
git checkout feature/A
  切换到dev分支
# 或者
git checkout -b dev 
  新建并切换到分支
```
- 分支处理
```bash
git branch -a
 列出全部分支
git branch -r
 列出远程分支
git branch
 列出本地分支
git branch --set-upstream-to=remotes/origin/dev dev
  关联本地和中心服务器分支
git branch -D dev
  删除本地分支(先切换分支，再删除)
git push origin :xx/dev
  删除远程分支
git branch -vv
 查看本地分支和远程分支绑定关系
```

- 查看本地分支和远程分支绑定关系
  > （未绑定的分支）
  第一次操作，发现fix/indexDb没有绑定到远程分支。这时候没法提交和拉取代码  
  **git status**  
  On branch fix/indexDb
  nothing to commit, working tree clean  
  **git branch -vv**  
    developer   8e85abb [origin/developer: behind 2] Merge branch 'feature/my-tags' of finoapp-desktop/net-disk into developer  
  **\*** fix/indexDb a6a23d7 [Add] add indexDb class
    master      60ef2d8 [origin/master] 添加文件

  >（绑定的分支）
  通过 --set-upstream-to将本地和远程分支绑定。  
  **git status**  
  On branch fix/indexDb  
  Your branch is up to date with 'origin/fix/indexDb'.  
  nothing to commit, working tree clean  
  **git branch --set-upstream-to=origin/fix/indexDb**  
  Branch 'fix/indexDb' set up to track remote branch   'fix/indexDb' from 'origin'.  
  **git branch -vv**  
    developer   8e85abb [origin/developer: behind 2] Merge     branch 'feature/my-tags' of finoapp-desktop/net-disk into     developer    
  **\*** fix/indexDb a6a23d7 [origin/fix/indexDb] [Add] add   indexDb   class  
    master      60ef2d8 [origin/master] 添加文件

#### 修改和缓存

- 当本地存在修改，不能直接 git pull时

  git commit 再 git pull 解决冲突
  git stash ，git pull 再 git stash pop 再解决冲突
