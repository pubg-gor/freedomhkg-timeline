// access sqlite
const SQL = require('sql-template-strings')
const sqlite = require('sqlite')
const path = require('path')
const R = require('ramda')
const { aql } = require('arangojs')
const shell = require('shelljs')
const rootPath = path.join(__dirname, '../../')
const { db: arangodb, initDb: initArangodb } = require(path.join(
  rootPath,
  'src/drivers/arangodb'
))
const {
  transformSqliteTelegramMessages,
  transformTelegramMessageToEvent,
} = require(path.join(rootPath, 'src/utils/dataTransformUtil'))

async function job() {
  console.log('--- sync telegram data from sqlite to arango ---')
  console.log('connecting sqlite db...')
  const sqlitedb = await sqlite.open(path.join(rootPath, 'tg-export/export.db'))

  // get all message id in sqlite db
  const data = await sqlitedb.all(SQL`SELECT ID AS id FROM Message`)
  const sqliteMessageIds = data.map(R.prop('id'))
  console.log('total telegram messages in sqlite:', data.length)

  // get all telegram message id in arangodb
  await initArangodb()
  const arangodbMessageIds = await (await arangodb.query(
    `
      FOR tm IN telegramMessages
        RETURN tm.idFromSqlite
    `
  )).all()
  console.log('total telegram messages in arango:', arangodbMessageIds.length)

  // compare id list
  const newMessageIds = R.difference(sqliteMessageIds, arangodbMessageIds)
  console.log('total new telegram messages', newMessageIds.length)

  if (newMessageIds.length === 0) {
    console.log('--- sync telegram data from sqlite to arango DONE ---')
    return
  }

  // get those messages from sqlite
  const sqliteNewMessages = await sqlitedb.all(
    `SELECT * FROM Message WHERE ID in (${newMessageIds.join(',')})`
  )

  const mediaIds = R.pipe(
    R.map(R.prop('MediaID')),
    R.reject(R.isNil)
  )(sqliteNewMessages)
  const medias = await sqlitedb.all(`
    SELECT * FROM Media WHERE ID in (${mediaIds.join(',')})
  `)

  const arangoNewMessages = transformSqliteTelegramMessages({
    messages: sqliteNewMessages,
    medias,
  })

  // transform & insert them into arangodb
  await saveTelegramChannels({
    sqlitedb,
    db: arangodb,
  })

  console.log('inserting telegram messages to arango...')
  const insertedNewMessages = await (await arangodb.query(
    aql`
      LET tes = ${arangoNewMessages}
      FOR te IN tes
        INSERT te INTO telegramMessages RETURN NEW
    `
  )).all()

  // transform & insert them into arangodb events
  console.log('inserting events to arango...')
  await arangodb.query(
    aql`
      LET es = ${insertedNewMessages.map(transformTelegramMessageToEvent)}
      FOR e IN es
        INSERT e INTO events
    `
  )

  // copy media (images) to static/telegram-images
  console.log('copying media data to static...')
  arangoNewMessages.forEach(message => {
    if (!R.path(['media', 'photoId'], message)) {
      return
    }
    const media = medias.find(R.propEq('ID', message.media.id))
    const oldFilename = `photo-${media.Name}.${media.ID}.jpg`
    const newFilename = `${message.media.photoId}.jpg`
    shell.cp(
      path.join(
        rootPath,
        `tg-export/usermedia/${message.channelId}/${oldFilename}`
      ),
      path.join(rootPath, `static/telegram-images/${newFilename}`)
    )
  })

  // done
  console.log('--- sync telegram data from sqlite to arango DONE ---')
}

async function saveTelegramChannels({ sqlitedb, db }) {
  console.log('inserting channels to arango...')
  const dataFromSqlite = await sqlitedb.all('SELECT * FROM Channel')
  const transformedData = dataFromSqlite.map(
    ({
      ID: id,
      About: about,
      Title: title,
      Username: name,
      PictureID: pictureId,
    }) => ({ _key: String(id), about, title, name, pictureId })
  )
  const insertedChannels = await (await db.query(
    aql`
      LET cs = ${transformedData}
      FOR c IN cs
        UPSERT { _key: c._key }
          INSERT c
          UPDATE UNSET(c, '_key')
        INTO telegramChannels
        RETURN NEW
    `
  )).all()
  return insertedChannels
}

module.exports = job
