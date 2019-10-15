FROM node:10-alpine

WORKDIR /usr/app/src

COPY package.json .
COPY yarn.lock .
COPY ./services/frontend/package.json ./services/frontend/

RUN yarn install

COPY ./packages ./packages
COPY ./services/frontend ./services/frontend

COPY ./tsconfig.settings.json ./
COPY ./docker/frontend/tsconfig.json ./

WORKDIR /usr/app/src/services/frontend
RUN yarn build:ssr

CMD yarn serve:ssr