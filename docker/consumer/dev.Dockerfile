FROM node:lts-alpine

WORKDIR /usr/app/src

COPY ./packages/event-sourcing ./packages/event-sourcing
COPY ./packages/utils ./packages/utils
COPY ./services/consumer ./services/consumer

WORKDIR /usr/app/src/services/consumer
CMD yarn start:dev