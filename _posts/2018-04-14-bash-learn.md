---
layout:     post
title:      bash-learn
subtitle:   shell学习记录
date:       2018-04-14 11:00
author:     Youga
header-img: https://static.cjwddz.cn/blog/img/post-bg-ios9-web.jpg
catalog: 	 true
tags:
  - tools
---


`shell` 学习记录。

### shall运行

文件以`#!/bin/bash`开头，**/bin/bash** 指调用的程序

- 直接运行
```bash
chmod +x ./test.sh  # 使脚本具有执行权限
./test.sh           # 执行脚本
test.sh             # 在PATH中寻找test.sh的脚本
```
- 作为解释器参数运行  
```bash
/bin/sh test.sh
/bin/php test.php
```

#### 变量

- 定义变量
使用变量时,`{}`可以选择加或者不加，仅仅作为变量名**边界**区分
```bash
your_name="runoob.com"      # 定义
echo $your_name             # 变量使用,{}作为变量边界
echo ${your_name}       
echo "I am good at ${skill}Script"    
# 将变量设置为只读，再次赋值报错
readonly your_name         
```
- 删除变量
```bash
unset variable_name
# !!不能删除只读变量
```
### 获取脚本参数

```bash
echo "执行的文件名：$0";
echo "第一个参数为：$1";
echo "第二个参数为：$2";
echo "第三个参数为：$3";
```
用来处理参数的特殊字符：
- \$# 传递到脚本的参数个数  
- \$* 以一个单字符串显示所有向脚本传递的参数。
- \$$ 脚本运行的当前**进程ID号**  
- \$! 后台运行的最后一个进程的ID号
- \$@ 与$*相同，但是使用时加引号，并在引号中返回每个参数。
如"$@"用「"」括起来的情况、以"$1" "$2" … "$n" 的形式输出所有参数。
- \$- 显示Shell使用的当前选项，与set命令功能相同。
- \$? 显示最后命令的退出状态。0表示没有错误，其他任何值表明有错误。
### 数组
- 定义
```bash
array_name=(value0 value1 value2 value3)
# 或者
array_name[0]=value0
array_name[1]=value1
array_name[n]=valuen
```
- 使用
```bash
${数组名[下标]}
# @符号可以获取数组中的所有元素
echo ${array_name[@]}
# 取得数组元素的个数
length=${#array_name[@]}
# 或者
length=${#array_name[*]}
# 取得数组单个元素的长度
lengthn=${#array_name[n]}
```
### for
```bash
for file in `ls /etc`
# 或
for file in $(ls /etc)
# 完整
for skill in Ada Coffe Action Java; do
    echo "I am good at ${skill}Script"
done
```

### 字符串操作

```bash
# 获取字符串长度
string="abcd"
echo ${#string} #输出 4

# 提取子字符串
string="runoob is a great site"
echo ${string:1:4} # 输出 unoo

# 查找子字符串
# 查找字符 "i 或 s" 的位置：
string="runoob is a great company"
echo `expr index "$string" is`  # 输出 8
```

### shell运算

- 数学运算  
	原生bash不支持简单的数学运算，但是可以通过其他命令来实现，例如 awk 和 expr。
```bash
val=`expr 2 + 2`
echo "两数之和为 : $val"
# 乘法运算需要在运算符前加 \
val=`expr $a + $b - $c \* $d / $e % $f`

echo `expr 1 == 1`  # 打印 1
echo `expr 1 != 1`  # 打印 0

#  [] 执行基本的算数运算
result=$[a+b] # 注意等号两边不能有空格
if test $[num1] -eq $[num2] 
```

- 关系运算

	关系运算符只支持*数字*，不支持字符串，除非字符串的值是数字。
	输出 true,false  
	- -eq	是否相等  
	- -ne	判断是否不相等
	- -gt	左边的数是否大于右边的
	- -lt	检测左边的数是否小于右边
	- -ge	检测左边的数是否大于等于右边的
	- -le	检测左边的数是否小于等于右边的

- 布尔运算

	- ! 非运算
	- -o 或运算
	- -a 与运算

- 逻辑运算符
	- && 逻辑的 AND	[[ $a -lt 100 && $b -gt 100 ]]
	- || 逻辑的 OR	[[ $a -lt 100 || $b -gt 100 ]]
- 字符串运算符

	|运算符|说明|举例|
	| - | :-: | -: |
	|=|检测两个字符串是否相等|[ $a = $b ]  |
	|!=|是否不相等|[ $a != $b ]|
	|-z|检测字符串长度是否为0|[ -z $a ]|
	|-n|检测字符串长度是否不为0|[ -n $a ]|
	|str|检测字符串是否为空|[ $a ]|

- 文件测试运算符  
文件测试运算符用于检测 Unix 文件的各种属性。  
file="/var/www/runoob/test.sh"  

	|操作符|说明|举例
	|-|:-:|-|
	-b file|检测文件是否是块设备文件|[ -b $file ] 返回 false。
	-c file|检测文件是否是字符设备文件|[ -c $file ] 返回 false。
	-d file|检测文件是否是目录|[ -d $file ] 返回 false。
	-f file|检测文件是否是普通文件（既不是目录，也不是设备文件）|[ -f $file ] 返回 true。
	-g file|检测文件是否设置了 SGID 位|[ -g $file ] 返回 false。
	-k file|检测文件是否设置了粘着位(Sticky Bit)|[ -k $file ] 返回 false。
	-p file|检测文件是否是有名管道|[ -p $file ] 返回 false。
	-u file|检测文件是否设置了 SUID 位，|[ -u $file ] 返回 false。
	-r file|检测文件是否可读|[ -r $file ] 返回 true。
	-w file|检测文件是否可写|[ -w $file ] 返回 true。
	-x file|检测文件是否可执行|[ -x $file ] 返回 true。
	-s file|检测文件是否为空（文件大小是否大于0）|[ -s $file ] 返回 true。
	-e file|检测文件（包括目录）是否存在，|[ -e $file ] 返回 true。

*以上，也可以使用**test**表达式,如：*
```bash
if [ $a -le $b ]
# 写成
if test $a -le $b
```
### echo 输出
```bash
# 输出定向到文件
echo "It is a test" > myfile
# 打印日期
echo `date`
```

### read 输入
```bash
read firstStr secondStr
echo "第一个参数:$firstStr; 第二个参数:$secondStr"
# 输入控制
read -p "请输入密码:" -n 6 -t 5 -s password
echo "\npassword is $password"
# -p 输入提示文字
# -n 输入字符长度限制(达到6位，自动结束)
# -t 输入限时
# -s 隐藏输入内容
```

### print 输出

printf 不会像 echo 自动添加换行符，我们可以手动添加 \n。  
- %s %c %d %f都是格式替代符  
- %-10s 指一个宽度为10个字符（-表示左对齐，没有则表示右对齐），任何字符都会被显示在10个字符宽的字符内，如果不足则自动以空格填充，超过也会将内容全部显示出来。  
```bash
printf "Hello, Shell\n"
printf "%-10s %-8s %-4.2f\n" 郭靖 男 66.1234 # 输出：郭靖 男 66.12
```

### shell 流程控制

以下，循环控制可以使用*break,continue*

- if
```bash
if condition1
then
    commands
elif condition2 
then 
    commands
else
    commands
fi
```
- for
```bash
// example1
for var in item1 item2 ... itemN
do
    command1
    ...
done
# 写成一行：
for var in item1 item2 ... itemN; do command1; command2… done;

// example2
# 依次打印0，1，2，3，4
for ((a=0;a<5;a++));do
echo $a
done
```
- while
```bash
// example1
while condition
do
    command
done
// example2
# 依次打印 1，2，3，4，5
int=1
while(( $int<=5 ))
do
    echo $int
    let "int++"
done
```

- until
```bash
# 条件不满足的时候运行
until condition
do
    command
done
```

- case
```bash
echo '你输入的数字为:'
read aNum
case $aNum in
    1)  echo '你选择了 1'
    ;;
    2)  echo '你选择了 2'
    ;;
    *)  echo '你没有输入 1 到 2 之间的数字'
    ;;
esac
```

### 函数

- 定义

**不带任何参数！！**  
**return** 返回，如果不加，*将以最后一条命令运行结果，作为返回值*。
```bash
function A(){
	// ...
}
# 或者
A(){
	// ...
}
```
- 调用
```bash
funWithParam(){
    echo "第一个参数为 $1 !"
    echo "第二个参数为 $2 !"
    echo "参数总数有 $# 个!"
    echo "作为一个字符串输出所有参数 $* !"
}
funWithParam 1 param2
```
### 重定向

命令|说明
|-|:-:|-|
command > file|将输出重定向到 file。
command < file|将输入重定向到 file。
command >> file|将输出以追加的方式重定向到 file。
n > file|将文件描述符为 n 的文件重定向到 file。
n >> file|将文件描述符为 n 的文件以追加的方式重定向到 file。
n >& m|将输出文件 m 和 n 合并。
n <& m|将输入文件 m 和 n 合并。
<< tag|将开始标记 tag 和结束标记 tag 之间的内容作为输入。

*需要注意的是文件描述符 0 通常是标准输入（STDIN），1 是标准输出（STDOUT），2 是标准错误输出（STDERR）。*

```bash
cat A.txt
# 输出：abcdefg
echo "菜鸟教程：www.runoob.com" > A.txt
cat A.txt
# 输出：菜鸟教程：www.runoob.com
echo "菜鸟教程：www.runoob.com" >> A.txt
cat A.txt
# 输出：菜鸟教程：www.runoob.com \n 菜鸟教程：www.runoob.com
```

### 文件包含
```bash
. filename   # 注意点号(.)和文件名中间有一空格
# 或
source filename

// example
# test1.sh 文件
url="http://www.runoob.com"
# test2.sh 文件
. ./test1.sh
# 或者
source ./test1.sh
echo "菜鸟教程官网地址：$url"
```

### 命令大全

[shell 命令大全](http://www.runoob.com/linux/linux-command-manual.html)

