FROM node:10

# Create app directory
WORKDIR /usr/src/app

COPY package.json /usr/src/app/
RUN yarn install && yarn cache clean

# Bundle app source
COPY . /usr/src/app

EXPOSE 3000
RUN ["yarn", "build"]
CMD ["yarn", "start"]