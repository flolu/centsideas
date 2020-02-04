FROM launcher.gcr.io/google/ubuntu16_04

# slim gcloud installation
RUN apt-get -y update && \
  apt-get -y install gcc python2.7 python-dev python-setuptools wget ca-certificates \
  software-properties-common python-software-properties && \
  add-apt-repository ppa:git-core/ppa && \
  apt-get -y update && \
  apt-get -y install git && \
  mkdir -p /builder && \
  wget -qO- https://dl.google.com/dl/cloudsdk/release/google-cloud-sdk.tar.gz | tar zxv -C /builder && \
  CLOUDSDK_PYTHON="python2.7" /builder/google-cloud-sdk/install.sh --usage-reporting=false \
  --bash-completion=false \
  --disable-installation-options && \
  easy_install -U pip && \
  pip install -U crcmod && \
  apt-get -y remove gcc python-dev python-setuptools wget && \
  rm -rf /var/lib/apt/lists/* && \
  rm -rf ~/.config/gcloud
ENV PATH=/builder/google-cloud-sdk/bin/:$PATH
ENTRYPOINT ["/builder/google-cloud-sdk/bin/gcloud"]

# install gcloud components and kubectl
RUN apt-get -y update && \
  apt-get -y install default-jre && \
  /builder/google-cloud-sdk/bin/gcloud -q components install \
  cloud-build-local \
  kubectl \
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