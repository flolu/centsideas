FROM node:lts-alpine

WORKDIR /usr/app/src

COPY ./packages ./packages
COPY ./services/consumer ./services/consumer

COPY package.json .
COPY ./tsconfig.settings.json ./

RUN yarn fire

WORKDIR /usr/app/src/services/consumer
CMD yarn start:prod