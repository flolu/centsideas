FROM node:alpine

WORKDIR /usr/app/src
COPY ./packages ./packages
COPY ./tsconfig.json ./
COPY ./package.json ./
COPY ./services/consumer ./services/consumer
WORKDIR /usr/app/src

CMD yarn start:consumer