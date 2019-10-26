FROM node:10-alpine AS build-env
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

FROM node:10-alpine
WORKDIR /usr/app/srcz<z
COPY --from=build-env /usr/app/src/services/frontend/dist ./dist
COPY --from=build-env /usr/app/src/services/frontend/package.json ./
RUN npm install envsub
CMD yarn serve:ssr