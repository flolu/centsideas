# Kubernetes for Local Development

> ⚠️ This guide is designed to work for Ubuntu 20.04 LTS

## 1. Install and Setup [MicroK8s](https://microk8s.io)

```bash
# install
sudo snap install microk8s --classic

# configure sudo permissions
sudo usermod -a -G microk8s $USER && \
sudo chown -f -R $USER ~/.kube && \
su - $USER

# allow local registry
sudo cp misc/daemon.json /etc/docker/daemon.json && \
sudo systemctl restart docker

# create aliases
sudo snap alias microk8s.kubectl kubectl && \
sudo snap alias microk8s.kubectl k

# start cluster
microk8s start
```

## 2. Deploy the Application for the First Time

```bash
# enbale necessary addons
microk8s enable dns ingress registry

# setup kafka
kubectl create namespace kafka
kubectl apply -f 'https://strimzi.io/install/latest?namespace=kafka' -n kafka
kubectl apply -f packages/kubernetes/kafka-ephemeral.yaml -n kafka

# setup mongodb
git clone https://github.com/mongodb/mongodb-kubernetes-operator && \
cd mongodb-kubernetes-operator && \
kubectl create namespace mongodb && \
kubectl create -f deploy/crds/mongodb.com_mongodb_crd.yaml && \
kubectl create -f deploy/ --namespace mongodb

cd ..
microk8s.kubectl apply -f packages/kubernetes/event-store.yaml -n mongodb && \
microk8s.kubectl apply -f packages/kubernetes/read-database.yaml -n mongodb

# setup elasticsearch
kubectl apply -f https://download.elastic.co/downloads/eck/1.1.2/all-in-one.yaml
kubectl apply -f packages/kubernetes/elasticsearch-local.yaml

# while everything is spinning up you can configure
# environment variables and secrets in the /env directory

# deploy services
yarn deploy:microk8s
```

## 3. Develop

After you've made your changes, just run

```bash
yarn dpeloy:microk8s
```
