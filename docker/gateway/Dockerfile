FROM node:lts-alpine

WORKDIR /usr/app/src

# TODO automatically gnerate those files
COPY ./packages ./packages
COPY ./services/gateway ./services/gateway

COPY package.json .
COPY ./tsconfig.settings.json ./

RUN yarn fire

WORKDIR /usr/app/src/services/gateway
CMD yarn start:prod