FROM ubuntu:18.04

RUN apt-get update
RUN apt-get -y install curl

# bazel deps
RUN apt-get -y install pkg-config zip g++ zlib1g-dev unzip python python3 git

# nodejs
RUN apt-get -y install nodejs

# yarn
RUN curl -sS https://dl.yarnpkg.com/debian/pubkey.gpg | apt-key add - && \
  echo "deb https://dl.yarnpkg.com/debian/ stable main" | tee /etc/apt/sources.list.d/yarn.list && \
  apt-get update && apt-get -y install yarn

# bazelisk
RUN yarn global add @bazel/bazelisk --prefix /usr/local && bazelisk version

WORKDIR /app

ENTRYPOINT [ "bazelisk" ]