FROM node:alpine

WORKDIR /usr/app/src
COPY ./packages ./packages
COPY ./tsconfig.json ./
COPY ./package.json ./
COPY ./services/ideas ./services/ideas
WORKDIR /usr/app/src

CMD yarn start:ideas