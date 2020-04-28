# Deploy to Production

### 1. Create [GKE](https://cloud.google.com/kubernetes-engine) cluster and connect to it

```bash
gcloud beta container --project "centsideas" clusters create "centsideas" --zone "europe-west3-b" --no-enable-basic-auth --machine-type "n1-standard-1" --disk-size "10" && \
gcloud container clusters get-credentials centsideas --zone europe-west3-b --project centsideas
```

_# FIXME add instructions on how to add Application-layer Secrets Encryption_

### 2. Setup [Helm](https://helm.sh/)

```bash
helm repo add stable https://kubernetes-charts.storage.googleapis.com/ && \
helm repo add jetstack https://charts.jetstack.io/ && \
helm repo update
```

### 3. Create an [NGINX Ingress](https://github.com/kubernetes/ingress-nginx)

```bash
kubectl create clusterrolebinding cluster-admin-binding --clusterrole cluster-admin --user $(gcloud config get-value account) && \
helm install nginx-ingress stable/nginx-ingress
```

### 4. Point Domain to IP

Go to the created [Load Balancer](https://console.cloud.google.com/net-services/loadbalancing/loadBalancers/list) and point your domain to this IP address via an "A" record.

| Record Type | Domain             | Value           |
| ----------- | ------------------ | --------------- |
| A           | centsideas.com     | your IP address |
| A           | api.centsideas.com | your IP address |

### 5. Setup [Cert Manager](https://github.com/helm/charts/tree/master/stable/cert-manager)

```
kubectl apply --validate=false -f https://raw.githubusercontent.com/jetstack/cert-manager/v0.13.0/deploy/manifests/00-crds.yaml && \
kubectl create namespace cert-manager && \
helm install cert-manager jetstack/cert-manager --namespace cert-manager
```

### 6. Deploy services

```
yarn deploy
```

Wait until all Workloads are up and running. Now you should be able to visit https://centsideas.com
