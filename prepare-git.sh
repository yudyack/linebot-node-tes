#!/bin/bash

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"
# echo "$DIR"
# pwd
cd $DIR
#get repo name
repo=${DIR##*/}
echo $repo
# echo "load githooks.." \
# && cp hooks/* "../../$repo.git/hooks/" \
# && sudo chmod +x "../../$repo.git/hooks/*" \
