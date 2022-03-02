# Schoolly

> Schoolly project

## Build Setup

``` bash
# install dependencies
$ npm run install

# serve with hot reload at localhost:3000
$ npm run dev

# build for production and launch server
$ npm run build
$ npm run start

# generate static project
$ npm run generate
```

For detailed explanation on how things work, check out [Nuxt.js docs](https://nuxtjs.org).

#HOW TO DEPLOY Schoolly (NGINX + PM2 + NuxtJs)
## PREPARATION:
- nginx: https://www.nginx.com/
- pm2: https://pm2.keymetrics.io/
- nodejs: https://nodejs.org/en/
- nuxt-start: https://www.npmjs.com/package/nuxt-start
- create folder to deploy on server: sudo mkdir /data/www/schoolly-enduser/

## DEPLOY
1. Step 1: get latest code from develop branch: https://git.famtechvn.net/schoolly/enduser
2. Step 2: Synchronize code build to server:
    - make sure you are at root project
    - install dependencies: npm i
    - build bundle code: npm run build
    - rsync code to server: rsync -aurvh --include='.nuxt/***' --include='.env' --include='package.json' --include='ecosystem.config.js' --include='assets/***' --include='static/***' --exclude='*' ./ username@host:/data/www/schoolly-enduser/
    
3. Step 3:
   - access to server deploy
   - make sure you are currently in /data/www/schoolly-enduser/ path.
   - pm2 start ecosystem.config.js (for the first starting)
   - or only need restart for the next time: pm2 restart all

4. Tail log
    - view logs: pm2 logs
    - monitor app: pm2 monit

