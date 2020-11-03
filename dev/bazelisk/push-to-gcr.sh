#!/bin/sh

PROJECT_ID="centsideas"
IMAGE="bazelisk"
TAG="latest"

sudo snap install google-cloud-sdk --classic && \
gcloud init && \

docker build -t gcr.io/$PROJECT_ID/$IMAGE:$TAG . && \
docker push gcr.io/$PROJECT_ID/$IMAGE:$TAG