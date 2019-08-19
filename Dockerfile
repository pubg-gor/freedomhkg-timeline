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

EXPOSE 3000
RUN ["yarn", "build"]
CMD ["yarn", "start"]
