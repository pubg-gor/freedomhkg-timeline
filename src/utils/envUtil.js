const env = process.env.NODE_ENV

module.exports = {
  ENV: env,
  isTesting: env === 'testing',
  isDev: env === 'development',
  isProd: env === 'production',
  isNotProd: env !== 'production',
}
