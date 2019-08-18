const shell = require('shelljs')
const path = require('path')

shell.rm(
  '-rf',
  path.join(__dirname, '../tg-media'),
  path.join(__dirname, '../tg-export-sqlite.db')
)
