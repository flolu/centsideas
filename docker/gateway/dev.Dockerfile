FROM node:lts-alpine

WORKDIR /usr/app/src

COPY ./packages/enums ./packages/enums
COPY ./services/gateway ./services/gateway

WORKDIR /usr/app/src/services/gateway
CMD yarn start:watch