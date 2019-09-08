FROM node:lts-alpine

WORKDIR /usr/app/src

COPY ./packages/enums ./packages/enums
COPY ./packages/models ./packages/models
COPY ./packages/event-sourcing ./packages/event-sourcing
COPY ./packages/utils ./packages/utils
COPY ./services/ideas ./services/ideas

WORKDIR /usr/app/src/services/ideas
CMD yarn start:watch