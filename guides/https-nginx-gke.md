# Setting up NGINX Ingress on GKE

https://kubernetes.github.io/ingress-nginx/deploy/

> If you're using GKE you need to initialize your user as a cluster-admin with the following command:

```
kubectl create clusterrolebinding cluster-admin-binding \
  --clusterrole cluster-admin \
  --user $(gcloud config get-value account)
```

> The following Mandatory Command is required for all deployments.

```
kubectl apply -f https://raw.githubusercontent.com/kubernetes/ingress-nginx/nginx-0.28.0/deploy/static/mandatory.yaml
```

**You may have to remove those two lines if you're getting an error**

```
      nodeSelector:
        kubernetes.io/os: linux
```

> GCE-GKE

```
kubectl apply -f https://raw.githubusercontent.com/kubernetes/ingress-nginx/nginx-0.28.0/deploy/static/provider/cloud-generic.yaml
```

## HTTPs

https://www.digitalocean.com/community/tutorials/how-to-set-up-an-nginx-ingress-with-cert-manager-on-digitalocean-kubernetes

Install `cert-manager` via:

```
kubectl apply --validate=false -f https://github.com/jetstack/cert-manager/releases/download/v0.12.0/cert-manager.yaml
```

then just deploy kubernetes resources and wait until the certificate is issued (check by running: `kubectl describe certificate cents-ideas-tls`)
