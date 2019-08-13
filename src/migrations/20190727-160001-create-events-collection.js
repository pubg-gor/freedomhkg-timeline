module.exports = {
  up: async db => {
    await db.collection('events').create()
    const collection = db.collection('events')
    await collection.createIndex({
      type: 'hash',
      fields: ['date'],
    })
  },

  down: async db => {
    await db.collection('events').drop()
  },
}
