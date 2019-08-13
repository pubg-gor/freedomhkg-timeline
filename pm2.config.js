module.exports = {
  apps: [
    {
      name: 'freedomhkg-timeline',
      instances: 'max',
      exec_mode: 'cluster',
      combine_logs: true,
      log_date_format: 'YYYY-MM-DD HH:mm Z',
      script: '__sapper__/build',
      env_production: {
        NODE_ENV: 'production',
        PORT: 80,
      },
      env_dev: {
        NODE_ENV: 'development',
      },
    },
  ],
}
