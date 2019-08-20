/**
 * Upload telegram images to S3 and save the url to sqlite db
 */
import path from 'path'
import fs from 'fs'
import shell from 'shelljs'
import * as R from 'ramda'
import { Message, Media } from '../src/drivers/sqlitedb'
import config from '../src/server/config'

async function task() {
  const bucketPathForCLI = R.path(['s3', 'public', 'bucketPathForCLI'], config)
  if (!bucketPathForCLI) {
    console.error('Error: s3 bucket path not found in config')
    return
  }
  const messages = await Message.scope(['hasMedia', 'media']).findAll()
  console.log('total messages:', messages.length)

  const targetMessages = messages.filter(message => {
    const { media } = message
    if (media.url) {
      // media file already saved with s3 url
      return false
    }

    if (media.type !== 'photo' || media.mimeType !== 'image/jpeg') {
      // TODO: currently only support jpg photo
      return false
    }

    if (fs.existsSync(getPhotoPath(message))) {
      return true
    }
  })
  console.log(`total message photos to upload: ${targetMessages.length} `)

  for (let message of targetMessages) {
    const { contextId: channelId } = message
    const s3FilePath = `${bucketPathForCLI}/${channelId}/${getPhotoFilename(
      message
    )}`
    shell.exec(`aws s3 cp "${getPhotoPath(message)}" "${s3FilePath}"`)
    await Media.update(
      { url: `${channelId}/${encodeURIComponent(getPhotoFilename(message))}` },
      { where: { id: message.mediaId } }
    )
  }

  console.log('s3 upload DONE')
}

function getPhotoFilename(message) {
  const { media } = message
  return `photo-${media.name}.${media.id}.jpg`
}

function getPhotoPath(message) {
  return path.join(__dirname, '../tg-media', getPhotoSubpath(message))
}

function getPhotoSubpath(message) {
  const { contextId: channelId } = message
  return path.join(String(channelId), getPhotoFilename(message))
}
task()
