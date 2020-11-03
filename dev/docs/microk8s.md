# Microk8s

## 1. Install and Setup [MicroK8s](https://microk8s.io)

```bash
sudo snap install microk8s --classic

sudo usermod -a -G microk8s $USER && \
sudo chown -f -R $USER ~/.kube && \
su - $USER

sudo cp dev/daemon.json /etc/docker/daemon.json && \
sudo systemctl restart docker

sudo snap alias microk8s.kubectl kubectl && \
sudo snap alias microk8s.kubectl k

microk8s start

microk8s enable dns ingress registry metrics-server
```

## 2. Setup Kafka with [Strimzi][0]

Download latest release from [GitHub][1] (`strimzi-x.y.z.zip`) and unzip.

```
cd strimzi-x.y.z.zip
kubectl create ns kafka
sed -i 's/namespace: .*/namespace: kafka/' install/cluster-operator/*RoleBinding*.yaml
kubectl apply -f install/cluster-operator/ -n kafka

cd centsideas
kubectl apply -f packages/kubernetes/kafka-ephemeral.yaml -n kafka
```

## 3. Setup MongoDB

```
kubectl create namespace mongodb && \
git clone https://github.com/mongodb/mongodb-kubernetes-operator && \
cd mongodb-kubernetes-operator && \
kubectl apply -f deploy/crds/mongodb.com_mongodb_crd.yaml && \
kubectl apply -f deploy/ --namespace mongodb && \
cd ..

yarn run config microk8s && \
kubectl apply -f packages/kubernetes/secrets.yaml -n mongodb && \
kubectl apply -f packages/kubernetes/event-store.yaml -n mongodb && \
kubectl apply -f packages/kubernetes/read-database.yaml -n mongodb

kubectl wait po/event-store-0 --for=condition=Ready -n mongodb && \
kubectl wait po/read-database-0 --for=condition=Ready -n mongodb && \
kubectl delete -f packages/kubernetes/secrets.yaml -n mongodb
```

## 4. Deploy the Application

```bash
yarn deploy:microk8s
```

[0]: https://strimzi.io/docs/operators/master/quickstart.html#ref-install-prerequisites-str
[1]: https://github.com/strimzi/strimzi-kafka-operator/releases
