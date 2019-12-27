FROM node:10-alpine
WORKDIR /usr/app/src
COPY ./packages ./packages
COPY ./services/users ./services/users
COPY ./tsconfig.settings.json ./
WORKDIR /usr/app/src/services/users
CMD yarn start:dev