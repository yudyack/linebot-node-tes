#!/bin/bash
curl -o- https://raw.githubusercontent.com/creationix/nvm/v0.34.0/install.sh | bash
npm install -g pm2
npm install -g typescript


## install nginx
sudo apt update
sudo apt install nginx

## TODO load githooks
cp hooks/* .git/hooks/
