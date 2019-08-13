# freedomhkg-timeline

Lookup things happening in Hong Kong, originated from the [反送中](https://www.google.com/search?q=反送中) issue.

## Tech

- [Svelte](https://svelte.dev/): Frontend rendering framework
- [Sapper](https://sapper.svelte.dev/): SSR framework for Svelte (just like [next.js](https://nextjs.org/) for react)
- [ArangoDB](https://www.arangodb.com/): Mongo-like collection-document + graph database

## Production

Data source (telegram channels):
- 反送中已核實資訊頻道 https://t.me/antiextraditionverifiednews
- 實時現場新聞直播（及 獨家實時消息）https://t.me/realtimenewsbroadcasts

## Development

### Getting Started
1. create `src/server/config/credential-development.env` from sample file `src/server/config/credential.sample.env`

  - Get your telegram app credentials here: https://my.telegram.org/apps
  - to configure telegram channels to export, see [Add telegram channel to export](#add-telegram-channel-to-export)

2. run scripts below

```bash
# start docker services (arangodb)
docker-compose up -d

# install dependencies
yarn install

# setup data
# 
# When starts to export telegram data, CLI will ask you to enter 
# the telegram login code sent to your account.
#
# The auth session will be saved to tg-export and free you from 
# this manual step for a few days.
yarn setup-proj

# start server on http://localhost:3000
yarn dev
```

### Add telegram channel to export
1. Add channel to the telegram account
2. Update `telegramExportChannelList.js`

### Data processing explained

1. collect data & images from telegram channel periodically using [`telegram-export`](https://github.com/expectocode/telegram-export)
2. `telegram-export` exports sqlite db & images to `tg-export`
3. use js to port sqlite data to arangodb + some data transformation
4. put images to `/static` for Sapper to serve
5. Sapper server can handle by serving data from db and images from `/static`

### Arangodb

Visit the db web interface on http://localhost:8529

### TODO

#### Feature-wise

- UI update
- events tagging / grouping
...

#### Tech-wise

- automated / smooth telegram data sync
- extract telegram export part as a separate service
  - `telegram-export` sqlite -> mysql
  - put media data to S3, instead of `/static` managed by Sapper
- arangodb OOM issue: OOM after 5 hrs on production EC2 T2.micro
- dockerize the app
- architecture-as-code