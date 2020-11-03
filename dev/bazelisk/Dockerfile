FROM ubuntu:20.04

ENV DEBIAN_FRONTEND=noninteractive

RUN apt-get update
RUN apt-get -y install curl gnupg unzip python python3 git build-essential

RUN apt-get -y install nodejs

RUN curl -sS https://dl.yarnpkg.com/debian/pubkey.gpg | apt-key add - && \
  echo "deb https://dl.yarnpkg.com/debian/ stable main" | tee /etc/apt/sources.list.d/yarn.list && \
  apt-get update && apt-get -y install yarn

RUN yarn global add @bazel/bazelisk --prefix /usr/local && bazelisk version

ENV DEBIAN_FRONTEND=

WORKDIR /app

ENTRYPOINT [ "bazelisk" ]