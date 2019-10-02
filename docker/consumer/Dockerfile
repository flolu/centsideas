FROM node:lts-alpine

WORKDIR /usr/app/src

COPY package.json .
COPY yarn.lock .
COPY ./packages ./packages
COPY ./services/consumer ./services/consumer

RUN yarn install

COPY ./tsconfig.settings.json ./
COPY ./docker/consumer/tsconfig.json ./

WORKDIR /usr/app/src/services/consumer
CMD yarn start