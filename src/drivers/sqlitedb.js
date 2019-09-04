import path from 'path'
import Sequelize from 'sequelize'
// import * as R from 'ramda'
// const LosslessJSON = require('lossless-json')
const Op = Sequelize.Op

export const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: path.join(process.cwd(), 'tg-export-sqlite.db'),
  logging: false,
})

export class Message extends Sequelize.Model {}
export class Media extends Sequelize.Model {}
export class Channel extends Sequelize.Model {}

Message.init(
  {
    id: {
      primaryKey: true,
      type: Sequelize.INTEGER,
      allowNull: false,
      field: 'ID',
    },
    contextId: {
      primaryKey: true,
      type: Sequelize.INTEGER,
      allowNull: false,
      field: 'ContextID',
    },
    date: {
      type: Sequelize.INTEGER,
      allowNull: false,
      field: 'Date',
    },
    message: {
      type: Sequelize.TEXT,
      field: 'Message',
    },
    mediaId: {
      type: Sequelize.INTEGER,
      field: 'MediaID',
    },
    serviceAction: {
      type: Sequelize.TEXT,
      field: 'ServiceAction',
    },
  },
  {
    sequelize,
    freezeTableName: true,
    tableName: 'Message',
    createdAt: false,
    updatedAt: false,
    scopes: {
      hasMedia: {
        where: { mediaId: { [Op.ne]: null } },
      },
      media: {
        include: [{ model: Media, as: 'media', required: false }],
      },
    },
  }
)

Media.init(
  {
    id: {
      primaryKey: true,
      type: Sequelize.INTEGER,
      allowNull: false,
      field: 'ID',
    },
    name: {
      type: Sequelize.TEXT,
      field: 'Name',
    },
    mimeType: {
      type: Sequelize.TEXT,
      field: 'MimeType',
    },
    type: {
      type: Sequelize.TEXT,
      field: 'Type',
    },
    // extra: {
    //   type: Sequelize.INTEGER,
    //   field: 'Extra',
    // },
    url: {
      type: Sequelize.TEXT,
      field: 'Url',
    },
  },
  {
    sequelize,
    tableName: 'Media',
    freezeTableName: true,
    createdAt: false,
    updatedAt: false,
    // getterMethods: {
    //   photoId() {
    //     return R.unless(
    //       R.isNil,
    //       String,
    //       R.path(['photo', 'id'], LosslessJSON.parse(this.extra))
    //     )
    //   },
    // },
  }
)

Channel.init(
  {
    id: {
      primaryKey: true,
      type: Sequelize.INTEGER,
      allowNull: false,
      field: 'ID',
    },
    title: {
      type: Sequelize.TEXT,
      field: 'Title',
      allowNull: false,
    },
    name: {
      type: Sequelize.TEXT,
      field: 'Username',
      allowNull: false,
    },
    pictureId: {
      type: Sequelize.INTEGER,
      field: 'PictureID',
    },
    dateUpdated: {
      primaryKey: true,
      type: Sequelize.INTEGER,
      field: 'DateUpdated',
    },
  },
  {
    sequelize,
    tableName: 'Channel',
    freezeTableName: true,
    createdAt: false,
    updatedAt: false,
    defaultScope: {
      order: [['dateUpdated', 'DESC']],
    },
  }
)

Message.belongsTo(Channel, { foreignKey: 'contextId', as: 'channel' })
Message.hasOne(Media, { sourceKey: 'mediaId', foreignKey: 'id', as: 'media' })
