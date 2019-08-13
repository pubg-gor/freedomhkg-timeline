const { aql } = require('arangojs')
const Umzug = require('umzug')
const { initDb, db } = require('./arangodb')

class ArangodbStorage {
  constructor({ db }) {
    this.db = db
    this.collection = db.collection('migrations')
    // this.initializationP = (async () => {
    //   if (!(await this.collection.exists())) {
    //     this.collection.create()
    //   }
    //   this.initiated = true
    // })()
  }

  async logMigration(migrationName) {
    // await this.initializationP
    await this.db.query(aql`
      INSERT {name: ${migrationName}} INTO migrations
    `)
  }

  async unlogMigration(migrationName) {
    // await this.initializationP
    await this.db.query(aql`
      FOR m IN migrations
        FILTER m.name == ${migrationName}
        REMOVE m IN migrations
    `)
  }

  async executed() {
    // await this.initializationP
    return await (await this.db.query(aql`
      FOR m IN migrations
        RETURN m.name
    `)).all()
  }
}

module.exports = ({ migrationPath }) => {
  const umzug = new Umzug({
    storage: new ArangodbStorage({ db }),
    migrations: {
      path: migrationPath,
      params: [db],
    },
    logging: console.log,
  })

  return {
    migrateDb: async () => {
      await initDb()
      await umzug.up()
    },
    undoAllDbMigration: () => umzug.down({ to: 0 }),
  }
}
