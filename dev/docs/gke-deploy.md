# Deploy to Google Cloud

**1. Install kubectl**

```bash
sudo snap install kubectl --classic
```

**2. Create [GKE][1] cluster and connect to it**

```bash
gcloud beta container --project "centsideas" clusters create "centsideas"\
  --zone "europe-west3-b" --no-enable-basic-auth --cluster-version "1.16.13-gke.1"\
  --machine-type "n1-standard-1" --disk-size "10" --preemptible --num-nodes "2"\
  --enable-autoscaling --min-nodes "0" --max-nodes "3"

gcloud container clusters get-credentials centsideas --zone europe-west3-b --project centsideas
```

**3. [Helm][2]**

```bash
helm repo add stable https://kubernetes-charts.storage.googleapis.com/ && \
helm repo add jetstack https://charts.jetstack.io && \
helm repo update
```

**4. Create an [NGINX Ingress][3]**

```bash
kubectl create clusterrolebinding cluster-admin-binding --clusterrole cluster-admin --user $(gcloud config get-value account) && \
helm install nginx-ingress stable/nginx-ingress
```

**5. Setup Domain**

Go to the created [Load Balancer][4] and point your domain to this IP address via an "A" record.

| Record Type | Domain             | Value        |
| ----------- | ------------------ | ------------ |
| A           | centsideas.com     | <ip-address> |
| A           | api.centsideas.com | <ip-address> |

**6. Setup [Cert Manager][5]**

```bash
helm install \
  cert-manager jetstack/cert-manager \
  --namespace cert-manager --create-namespace \
  --version v0.16.1 \
  --set installCRDs=true
```

**7. Deploy**

```bash
yarn deploy
```

# Helpful Commands

**Remove cert-manager**

```
helm uninstall cert-manager -n cert-manager
```

**Delete cluster**

```
gcloud container clusters delete centsideas
```

[1]: https://cloud.google.com/kubernetes-engine
[2]: https://helm.sh/
[3]: https://github.com/kubernetes/ingress-nginx
[4]: https://console.cloud.google.com/net-services/loadbalancing/loadBalancers/list
[5]: https://github.com/helm/charts/tree/master/stable/cert-manager
