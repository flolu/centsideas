FROM node:10-alpine AS build-env
WORKDIR /usr/app/src
COPY package.json .
COPY yarn.lock .
COPY ./services/frontend/package.json ./services/frontend/
COPY ./tsconfig.settings.json ./
ADD ./services/frontend/global-tsconfig.json ./tsconfig.json
COPY ./packages ./packages
COPY ./services/frontend ./services/frontend
RUN yarn install
WORKDIR /usr/app/src/services/frontend
RUN yarn build:ssr

FROM node:10-alpine
WORKDIR /usr/app/src
COPY --from=build-env /usr/app/src/services/frontend/dist ./dist
COPY --from=build-env /usr/app/src/services/frontend/package.json ./
RUN npm install envsub
CMD yarn serve:ssr