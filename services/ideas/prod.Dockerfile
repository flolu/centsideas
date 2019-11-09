FROM node:10-alpine
WORKDIR /usr/app/src
COPY package.json .
COPY yarn.lock .
COPY ./packages ./packages
COPY ./services/ideas ./services/ideas
RUN yarn install
COPY ./tsconfig.settings.json ./
ADD ./services/ideas/global-tsconfig.json ./tsconfig.json
WORKDIR /usr/app/src/services/ideas
CMD yarn start