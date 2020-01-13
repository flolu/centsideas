FROM node:alpine

WORKDIR /usr/app/src
COPY ./packages ./packages
COPY ./tsconfig.json ./
COPY ./package.json ./
COPY ./services/users ./services/users
WORKDIR /usr/app/src

CMD yarn start:users