// DEVELOPMENT
// PRODUCTION
module.exports = {
  apps: [{
    name: "SchoollyApp",
    exec_mode: 'cluster', // enables clustering
    instances: 'max', // or an integer
    cwd: './',
    script: '../../node_modules/nuxt-start/bin/nuxt-start.js',
    node_args: "",
    autorestart: true,
    watch: false,
    max_memory_restart: '7G',
    error_file: "/data/log/web/SchoollyApp.err.log",
    out_file: "/data/log/web/SchoollyApp.out.log",
    env: {
      HOST: "0.0.0.0",
      PORT: 4003
    },
  }, ],

};

// PRODUCTION
// PRODUCTION
module.exports = {
  apps: [{
    name: "SchoollyApp",
    exec_mode: 'cluster', // enables clustering
    instances: 'max', // or an integer
    cwd: './',
    script: '../../node_modules/nuxt-start/bin/nuxt-start.js',
    node_args: "",
    autorestart: true,
    watch: false,
    max_memory_restart: '7G',
    error_file: "/data/log/web/SchoollyApp.err.log",
    out_file: "/data/log/web/SchoollyApp.out.log",
    env: {
      HOST: "0.0.0.0",
      PORT: 4003
    },
  }, ],

};