FROM node:10-alpine
WORKDIR /usr/app/src
COPY package.json .
COPY yarn.lock .
COPY ./packages ./packages
COPY ./services/gateway ./services/gateway
RUN yarn install
COPY ./tsconfig.settings.json ./
ADD ./services/gateway/global-tsconfig.json ./tsconfig.json
WORKDIR /usr/app/src/services/gateway
CMD yarn start