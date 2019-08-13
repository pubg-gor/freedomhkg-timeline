module.exports = {
  up: async db => {
    await db.collection('telegramMessages').create()
    await db.collection('telegramChannels').create()
  },

  down: async db => {
    await db.collection('telegramMessages').drop()
    await db.collection('telegramChannels').drop()
  },
}
