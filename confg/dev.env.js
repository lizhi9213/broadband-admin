var merge = require('webpack-merge')
var prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
  // API_ROOT: '"//192.168.20.112/api"'
  API_ROOT: '"//127.0.0.1/api"'
})