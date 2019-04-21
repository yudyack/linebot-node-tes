#!/bin/bash


DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"
echo "test"
echo "$DIR"
echo 'done dir'
pwd
cd $DIR

repo-url= ${echo 'https://github.com/yudyack/linebot-node-tes.git'}
#get repo name as 
repo=${DIR##*/}
echo $repo

# git clone --bare $repo-url ../../ \
# && git clone 

# assume bare gir exist
echo "load githooks.." \
&& cp hooks/* "../../$repo.git/hooks/" \
&& sudo chmod a+x "../../$repo.git/hooks/*" \


