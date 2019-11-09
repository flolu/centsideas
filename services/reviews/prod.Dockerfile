FROM node:10-alpine
WORKDIR /usr/app/src
COPY package.json .
COPY yarn.lock .
COPY ./packages ./packages
COPY ./services/reviews ./services/reviews
RUN yarn install
COPY ./tsconfig.settings.json ./
ADD ./services/reviews/global-tsconfig.json ./tsconfig.json
WORKDIR /usr/app/src/services/reviews
CMD yarn start