#!/bin/bash
echo "install node" \
&& curl -o- https://raw.githubusercontent.com/creationix/nvm/v0.34.0/install.sh | bash \
&& npm install -g pm2 \
&& npm install -g typescript \
\
\
&& echo 'install nginx..' \
&& sudo apt update \
&& sudo apt install nginx \
\
\
&& echo "configure ufw" \
&& sudo ufw allow ssh \
&& sudo ufw allow 'Nginx Full' \

# TODO
# configure nginx
# configure certbot
# configure  

