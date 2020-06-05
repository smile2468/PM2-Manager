<h1 align="center">PM2 Manager</h1>
<p>
  <img alt="Version" src="https://img.shields.io/badge/version-1.0.0-blue.svg?cacheSeconds=2592000" />
  <a href="#" target="_blank">
    <img alt="License: MIT" src="https://img.shields.io/github/license/smile2468/PM2-Manager" />
  </a>
</p>

## Install modules
```js
npm i or npm install
```

## Run PM2 Manager
```js
pm2 start start.config.js
```

```js
// Example-Linux) start.config.js

module.exports = {
  apps: [
    {
      name: 'PM2 Manager', // Process name
      script: './index.js', // Script file
      cwd: '/home/bot/pm2-manager' // Script file path
    },
    {
      name: 'UB-Main',
      script: './index.js',
      cwd: '/home/bot/ub-main'
    },
    {
      name: 'LostArk-Global',
      script: './cluster.js',
      cwd: '/home/bot/lostark-rwt'
    }
  ]
}
```

## Developer
👤 **Ungbeom-Kang (Discord : 웅범#0401)**
