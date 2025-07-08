module.exports = {
  apps: [
    {
      name: 'offical-site',
      script: '.output/server/index.mjs',
      args: 'start',
      instances: 3,
      autorestart: true,
      watch: false,
      max_memory_restart: '512M',
      merge_logs: true,
      log_date_format: 'YYYY-MM-DD HH:mm Z',
      restart_delay: 1000,
      env: {
        APP_VERSION: '1.0.2',
        VERSION: '1.0.1',
        NODE_ENV: 'production',
        PORT: 9999,
      },
      env_production: {
        NODE_ENV: 'production',
      },
    },
  ],
}
