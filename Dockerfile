FROM node:10

# workaround for telegram-export
RUN apt update && \
    apt -y install python3-pip && \
    pip3 install telethon~=1.4.3 tqdm async_generator appdirs PySocks

# Create app directory
WORKDIR /usr/src/app

COPY package.json /usr/src/app/
RUN yarn install && yarn cache clean

# Bundle app source
COPY . /usr/src/app

# workaround to keep standalone folder for telegram-export
RUN mkdir /usr/src/app/telegram-export-data && \
    sed -i 's|OutputDirectory = ../|OutputDirectory = ../telegram-export-data|g' telegram-export.config.example.ini && \
    ln -s /usr/src/app/telegram-export-data/telegram-exporter.session /usr/src/app/telegram-exporter.session && \
    ln -s /usr/src/app/telegram-export-data/tg-export-sqlite.db /usr/src/app/tg-export-sqlite.db && \
    ln -s /usr/src/app/telegram-export-data/tg-media /usr/src/app/tg-media

EXPOSE 3000
RUN ["yarn", "build"]
CMD ["yarn", "start"]
