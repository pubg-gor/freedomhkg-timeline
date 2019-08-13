const shell = require('shelljs')
const path = require('path')

shell.rm(
  '-rf',
  path.join(__dirname, '../tg-export/usermedia'),
  path.join(__dirname, '../tg-export/export.db')
)
