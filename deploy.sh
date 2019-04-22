#!/bin/bash
# echo 'checkout..' \
# && git checkout -f master \
. ~/.nvm/nvm.sh
. ~/.profile
. ~/.bashrc
# . $(brew --prefix nvm)/nvm.sh 

echo "install.." \
&& npm install \
&& echo "build..." \
&& npm run tsc \
&& echo "run" \
&& pm2 delete 'linebot' 
pm2 start build/app.js --name 'linebot' \
