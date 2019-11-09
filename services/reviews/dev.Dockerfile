FROM node:10-alpine
WORKDIR /usr/app/src
COPY ./packages ./packages
COPY ./services/reviews ./services/reviews
COPY ./tsconfig.settings.json ./
WORKDIR /usr/app/src/services/reviews
CMD yarn start:dev