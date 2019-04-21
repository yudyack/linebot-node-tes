#!/bin/bash
# pwd

repourl='https://github.com/yudyack/linebot-node-tes.git';

gitrepo=${repourl##*/};
repo=${gitrepo%.*};
 
# if [ $# -eq 0 ]
# then
#     repourl=$1
# fi

echo $repourl

if ! [ -d ~/deploy-folder ]  # for file "if [-f /home/rama/file]" 
then 
    mkdir -p ~/deploy-folder/live
fi

cd deploy-folder \
&& git clone --bare $repourl \
&& echo "clone working dir" \
&& git clone "./$gitrepo" "./live/$repo" \
&& cd "./live/$repo" \
&& bash prepare-git.sh \
&& bash prepare.sh

