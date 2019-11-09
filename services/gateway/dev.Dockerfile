FROM node:alpine
WORKDIR /usr/app/src
COPY ./packages ./packages
COPY ./services/gateway ./services/gateway
COPY ./tsconfig.settings.json ./
WORKDIR /usr/app/src/services/gateway
CMD yarn start:dev