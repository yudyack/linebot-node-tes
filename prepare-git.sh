#!/bin/bash

directory="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"
echo "$directory"
pwd
cd $directory

# repo-url=https://github.com/yudyack/linebot-node-tes.git
#get repo name as 
repo=${directory##*/}
echo $repo

# git clone --bare $repo-url ../../ \
# && git clone 

# assume bare gir exist
echo "load githooks.." \
&& cp hooks/* "../../$repo.git/hooks/" \
&& sudo chmod a+x "../../$repo.git/hooks/"* \


