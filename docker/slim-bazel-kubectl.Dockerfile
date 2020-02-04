FROM google/cloud-sdk

# install gcloud components and kubectl
RUN apt-get -y update && \
  apt-get -y install default-jre && \
  /builder/google-cloud-sdk/bin/gcloud -q components install \
  alpha beta \
  app-engine-go \
  app-engine-java \
  app-engine-php \
  app-engine-python \
  app-engine-python-extras \
  bigtable \
  cbt \
  cloud-datastore-emulator \
  cloud-firestore-emulator \
  cloud-build-local \
  datalab \
  docker-credential-gcr \
  emulator-reverse-proxy \
  kubectl \
  pubsub-emulator \
  && \
  /builder/google-cloud-sdk/bin/gcloud -q components update && \
  /builder/google-cloud-sdk/bin/gcloud components list && \
  rm -rf /var/lib/apt/lists/*

# install bazel
RUN apt-get update \
  && apt-get install -y --no-install-recommends \
  ca-certificates \
  curl \
  gnupg \
  && echo "deb [arch=amd64] http://storage.googleapis.com/bazel-apt stable jdk1.8" > \
  /etc/apt/sources.list.d/bazel.list \
  && curl https://bazel.build/bazel-release.pub.gpg | apt-key add - \
  && apt-get update \
  && apt-get install -y --no-install-recommends \
  bazel=2.0.0 \
  git \
  python-dev \
  python3-dev \
  libxml2-dev \
  && apt-get purge --auto-remove -y curl gnupg \
  && rm -rf /etc/apt/sources.list.d/bazel.list \
  && rm -rf /var/lib/apt/lists/*