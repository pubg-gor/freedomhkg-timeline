/**
 * Use telegram-export to export user app data,
 * in the form of sqlite db and jpg images
 */
const fs = require('fs')
const ini = require('ini')
const path = require('path')
const config = require('../src/server/config')
const shell = require('shelljs')
const child_process = require('child_process')
const R = require('ramda')

const telegramChannel = require('../telegramExportChannelList').join(',')

// git clone telegram-export
if (fs.existsSync('telegram-export')) {
  console.log('Directory "telegram-export" already exists')
  shell.cd('telegram-export')
  shell.exec('python3 setup.py install', { silent: true })
} else {
  // our forked version
  shell.exec('git clone https://github.com/chauchakching/telegram-export.git')
  shell.cd('telegram-export')
}

// write telegram config to .ini file
const exportConfigPath = path.join(__dirname, '../telegram-export.config.ini')
if (!fs.existsSync(exportConfigPath)) {
  const exampleConfigPath = path.join(
    __dirname,
    '../telegram-export.config.example.ini'
  )
  shell.cp(exampleConfigPath, exportConfigPath)
}
const exportConfig = ini.parse(fs.readFileSync(exportConfigPath, 'utf-8'))
exportConfig.TelegramAPI.ApiId = config.telegram.apiId
exportConfig.TelegramAPI.ApiHash = config.telegram.apiHash
exportConfig.TelegramAPI.PhoneNumber = config.telegram.phoneNumber
fs.writeFileSync(exportConfigPath, ini.stringify(exportConfig))
console.log('telegram credentials written to telegram-export.config.ini')

// starts export telegram data
console.log('exporting telegram data...')
const commandToStartExport = `python3 -m telegram_export --config-file ${exportConfigPath} --contexts ${telegramChannel}`
child_process.execFileSync('python3', R.tail(commandToStartExport.split(' ')), {
  stdio: 'inherit',
})
