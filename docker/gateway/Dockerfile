# // FIXME automate creation of those files

FROM node:lts-alpine

WORKDIR /usr/app/src

COPY package.json .
COPY yarn.lock .
COPY ./packages ./packages
COPY ./services/gateway ./services/gateway

RUN yarn install

COPY ./tsconfig.settings.json ./
COPY ./docker/gateway/tsconfig.json ./

RUN yarn build

WORKDIR /usr/app/src/services/gateway
CMD yarn start:prod