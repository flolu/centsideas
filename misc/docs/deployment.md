# Deploy to Production

### 1. Create [GKE](https://cloud.google.com/kubernetes-engine) cluster and connect to it

```bash
gcloud beta container --project "centsideas" clusters create "centsideas"\
  --zone "europe-west3-b" --no-enable-basic-auth --cluster-version "1.16.9-gke.6"\
  --machine-type "n1-standard-1" --disk-size "10" --preemptible --num-nodes "3"\
  --enable-autoscaling --min-nodes "0" --max-nodes "3"

gcloud container clusters get-credentials centsideas --zone europe-west3-b --project centsideas
```

_# FIXME add instructions on how to add Application-layer Secrets Encryption_

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

| Record Type | Domain               | Value           |
| ----------- | -------------------- | --------------- |
| A           | centsideas.com       | your IP address |
| A           | api.centsideas.com   | your IP address |
| A           | admin.centsideas.com | your IP address |

### 5. Setup [Cert Manager](https://github.com/helm/charts/tree/master/stable/cert-manager)

```
helm install \
  cert-manager jetstack/cert-manager \
  --namespace cert-manager --create-namespace \
  --version v0.15.0 \
  --set installCRDs=true
```

### 6. Setup Kafka Cluster

```
kubectl create namespace kafka && \
kubectl apply -f 'https://strimzi.io/install/latest?namespace=kafka' -n kafka && \
kubectl apply -f packages/kubernetes/kafka-persistent.yaml -n kafka
```

### 7. Setup Elasticsearch Cluster

https://www.elastic.co/guide/en/cloud-on-k8s/current/k8s-deploy-eck.html

```

```

### 8. Deploy services

```
yarn deploy
```

Wait until all Workloads are up and running. Now you should be able to visit https://centsideas.com
