FROM node:10-alpine
WORKDIR /usr/app/src
COPY package.json .
COPY yarn.lock .
COPY ./packages ./packages
COPY ./services/consumer ./services/consumer
RUN yarn install
COPY ./tsconfig.settings.json ./
ADD ./services/consumer/global-tsconfig.json ./tsconfig.json
WORKDIR /usr/app/src/services/consumer
CMD yarn start