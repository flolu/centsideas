# Deploy to Production

### 1. Create [GKE](https://cloud.google.com/kubernetes-engine) cluster and connect to it

```bash
gcloud beta container --project "centsideas" clusters create "centsideas"\
  --zone "europe-west3-b" --no-enable-basic-auth --cluster-version "1.16.9-gke.6"\
  --machine-type "n1-standard-1" --disk-size "10" --preemptible --num-nodes "3"\
  --enable-autoscaling --min-nodes "0" --max-nodes "3"

gcloud container clusters get-credentials centsideas --zone europe-west3-b --project centsideas
```

### 2. Setup [Helm](https://helm.sh/)

```bash
helm repo add stable https://kubernetes-charts.storage.googleapis.com/ && \
helm repo add jetstack https://charts.jetstack.io && \
helm repo update
```

### 3. Create an [NGINX Ingress](https://github.com/kubernetes/ingress-nginx)

```bash
kubectl create clusterrolebinding cluster-admin-binding --clusterrole cluster-admin --user $(gcloud config get-value account) && \
helm install nginx-ingress stable/nginx-ingress
```

### 4. Point Domain to IP

Go to the created [Load Balancer](https://console.cloud.google.com/net-services/loadbalancing/loadBalancers/list) and point your domain to this IP address via an "A" record.

| Record Type | Domain               | Value      |
| ----------- | -------------------- | ---------- |
| A           | centsideas.com       | ip-address |
| A           | api.centsideas.com   | ip-address |
| A           | admin.centsideas.com | ip-address |

### 5. Setup [Cert Manager](https://github.com/helm/charts/tree/master/stable/cert-manager)

```bash
helm install \
  cert-manager jetstack/cert-manager \
  --namespace cert-manager --create-namespace \
  --version v0.15.0 \
  --set installCRDs=true
```

### 6. Setup Kafka Cluster

```bash
kubectl create namespace kafka
kubectl apply -f 'https://strimzi.io/install/latest?namespace=kafka' -n kafka
kubectl apply -f packages/kubernetes/kafka-ephemeral.yaml -n kafka
```

### 7. Setup Elasticsearch Cluster

```bash
kubectl apply -f https://download.elastic.co/downloads/eck/1.1.2/all-in-one.yaml
kubectl apply -f packages/kubernetes/elasticsearch.yaml
```

### 8. Setup MongoDB

```
git clone https://github.com/mongodb/mongodb-kubernetes-operator && \
cd mongodb-kubernetes-operator && \
kubectl create namespace mongodb && \
kubectl create -f deploy/crds/mongodb.com_mongodb_crd.yaml && \
kubectl create -f deploy/ --namespace mongodb

cd ..
microk8s.kubectl apply -f packages/kubernetes/event-store.yaml -n mongodb && \
microk8s.kubectl apply -f packages/kubernetes/read-database.yaml -n mongodb
```

### 9. Deploy services

```bash
yarn deploy
```
