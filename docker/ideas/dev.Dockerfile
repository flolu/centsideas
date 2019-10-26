FROM node:10-alpine
WORKDIR /usr/app/src
COPY ./packages ./packages
COPY ./services/ideas ./services/ideas
COPY ./tsconfig.settings.json ./
WORKDIR /usr/app/src/services/ideas
CMD yarn start:dev