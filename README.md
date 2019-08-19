# freedomhkg-timeline

Lookup things happening in Hong Kong, originated from the [反送中](https://www.google.com/search?q=反送中) issue.

## Tech

- [Svelte](https://svelte.dev/): Frontend rendering framework
- [Sapper](https://sapper.svelte.dev/): SSR framework for Svelte (just like [next.js](https://nextjs.org/) for react)
- [sqlite]
- [`telegram-export`](https://github.com/expectocode/telegram-export) CLI tool to export telegram data. This is a forked version that can skip downloading media if media url (our S3 url) is present.

## Production

Data source (telegram channels):
- 反送中已核實資訊頻道 https://t.me/antiextraditionverifiednews
- 實時現場新聞直播（及 獨家實時消息）https://t.me/realtimenewsbroadcasts

### Upload images to S3

To put exported telegram images to S3 and use them as
```bash
NODE_ENV=production yarn upload-s3
```

## Development

### Getting Started
1. create `src/server/config/credential-development.env` from sample file `src/server/config/credential.sample.env`

  - Get your telegram app credentials here: https://my.telegram.org/apps
  - to configure telegram channels to export, see [Add telegram channel to export](#add-telegram-channel-to-export)

2. run scripts below

```bash
# install dependencies
yarn install

# export telegram data
# 
# When starts to export telegram data, CLI will ask you to enter 
# the telegram login code sent to your account.
#
# The auth session will be saved to <rootDir>/telegram-exporter.session
# and free you from this manual step for a few days.
node scripts/exportTelegramData.js

# start server on http://localhost:3000
yarn dev
```

### Add telegram channel to export
1. Add channel to the telegram account
2. Update `telegramExportChannelList.js`

### Data processing explained

1. collect data & images from telegram channel periodically using `telegram-export`
2. `telegram-export` will:
  - exports sqlite db to `tg-export-sqlite.db`, images to `tg-media/`, and 
  - create an auth session `telegram-exporter.session` (if not exists)
3. Sapper server can handle by serving data from db and images from `/tg-media`

### Why Sqlite?

We're using the sqlite db exported from `telegram-export` for simplicity.

### TODO

#### Feature-wise

- UI update
- events tagging / grouping
...

#### Tech-wise

- automated / smooth telegram data sync
- put sqlite db & telegram images to S3 on production
- dockerize the app
- architecture-as-code