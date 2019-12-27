FROM node:10-alpine
WORKDIR /usr/app/src
COPY package.json .
COPY yarn.lock .
COPY ./packages ./packages
COPY ./services/users ./services/users
RUN yarn install
COPY ./tsconfig.settings.json ./
ADD ./services/users/global-tsconfig.json ./tsconfig.json
WORKDIR /usr/app/src/services/users
CMD yarn start