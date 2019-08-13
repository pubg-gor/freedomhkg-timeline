const dotenv = require('dotenv')
const fs = require('fs')
const path = require('path')

module.exports = (...paths) => {
  const buf = fs.readFileSync(path.join(...paths))
  const config = dotenv.parse(buf)

  return config
}
