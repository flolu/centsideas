FROM node:lts-alpine

WORKDIR /usr/app/src

COPY package.json .
COPY yarn.lock .
COPY ./packages ./packages
COPY ./services/ideas ./services/ideas

RUN yarn install

COPY ./tsconfig.settings.json ./
COPY ./docker/ideas/tsconfig.json ./

RUN yarn build

WORKDIR /usr/app/src/services/ideas
CMD yarn start:prod