FROM node:lts-alpine

WORKDIR /usr/app/src

COPY ./packages ./packages
COPY ./services/ideas ./services/ideas

COPY package.json .
COPY ./tsconfig.settings.json ./

RUN yarn fire

WORKDIR /usr/app/src/services/ideas
CMD yarn start:prod