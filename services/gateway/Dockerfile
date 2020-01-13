FROM node:alpine
WORKDIR /usr/app/src
COPY ./packages ./packages
COPY ./services/gateway ./services/gateway
COPY ./tsconfig.json ./
COPY ./package.json ./
#WORKDIR /usr/app/src/services/gateway
WORKDIR /usr/app/src
CMD yarn start:gateway