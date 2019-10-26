FROM node:10-alpine
WORKDIR /usr/app/src
COPY ./packages ./packages
COPY ./services/consumer ./services/consumer
COPY ./tsconfig.settings.json ./
WORKDIR /usr/app/src/services/consumer
CMD yarn start:dev