import path from 'path'
import Sequelize from 'sequelize'
import * as R from 'ramda'
const LosslessJSON = require('lossless-json')

export const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: path.join(process.cwd(), 'tg-export-sqlite.db'),
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
  },
  {
    sequelize,
    freezeTableName: true,
    createdAt: false,
    updatedAt: false,
    scopes: {
      channel: {
        include: [{ model: Channel, as: 'channel' }],
      },
      media: {
        include: [{ model: Media, as: 'media' }],
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
    extra: {
      type: Sequelize.INTEGER,
      field: 'Extra',
    },
  },
  {
    sequelize,
    freezeTableName: true,
    createdAt: false,
    updatedAt: false,
    getterMethods: {
      photoId() {
        return R.unless(
          R.isNil,
          String,
          R.path(['photo', 'id'], LosslessJSON.parse(this.extra))
        )
      },
    },
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
    pictureId: {
      type: Sequelize.INTEGER,
      field: 'PictureID',
    },
  },
  {
    sequelize,
    freezeTableName: true,
    createdAt: false,
    updatedAt: false,
  }
)

Message.belongsTo(Channel, { foreignKey: 'contextId', as: 'channel' })
Message.hasOne(Media, { sourceKey: 'mediaId', foreignKey: 'id', as: 'media' })
