#! /usr/bin/env bash
cd /opt/workspace/node/cluster; # 进入项目根目录
nodepid=`ps auxww | grep node | grep master.js | grep -v grep | awk '{print $2}' `
if [ -z "$nodepid" ]; then
	echo 'node service is not running'
	nohup node master.js > log.log 2>&1 &
else
	echo 'node service is running'
	kill -s USR2 $nodepid
	echo 'gracefull restart'
fi