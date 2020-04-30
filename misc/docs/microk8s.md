# Local Kubernetes Cluster

## Requirements

Make sure you have followed the installation [instructions](ubuntu.md) to install [MicroK8s](https://github.com/ubuntu/microk8s) on your machine.

## Cluster Setup

Now we will start the local Kubernetes cluster and enable some addons.

```bash
microk8s start
microk8s enable dns storage ingress registry helm3
```

**Ingress**

To access our application from http://localhost we need to setup an ingress. We will use the [NGINX Ingress Controller](https://kubernetes.github.io/ingress-nginx) to do this. To install it just run:

https://kubernetes.github.io/ingress-nginx/deploy/#using-helm

```
# helm repo add ingress-nginx https://kubernetes.github.io/ingress-nginx && \
# helm install my-release ingress-nginx/ingress-nginx
```

Watch the status by running

```
kubectl --namespace default get services -o wide -w my-release-ingress-nginx-controller
```

```bash
# kubectl apply -f https://raw.githubusercontent.com/kubernetes/ingress-nginx/master/deploy/static/provider/baremetal/deploy.yaml
```

Verify the installation of the Ingress controller by running the command below. This might take a few minutes to spin up.

```bash
kubectl get pods -n ingress-nginx -l app.kubernetes.io/name=ingress-nginx --watch
```

## Certificate Manager

https://cert-manager.io/next-docs/installation/kubernetes/#installing-with-helm

```
kubectl apply --validate=false -f https://github.com/jetstack/cert-manager/releases/download/v0.14.2/cert-manager.crds.yaml
kubectl create namespace cert-manager
helm repo add jetstack https://charts.jetstack.io
helm repo update
helm install cert-manager jetstack/cert-manager --namespace cert-manager --version v0.14.2

microk8s.kubectl get pods --namespace cert-manager
```

## Deployment

```bash
yarn deploy:microk8s
```

Now you can visit http://localhost, where the main client application is running. The gateway will be running under http://api.localhost.
This is the result of the configuration in `~/packages/kubernetes/local-ingress.yaml`.

> Note that the environment variables in `~.env.microk8s` will be used for this deployment

- _If you get an error like "kubectl toolchain was not properly configured" you can try to run the deployment command with `sudo`_

- _If you run into any errors related to NGINX Ingress during deployment you might want to try running `kubectl delete validatingwebhookconfiguration ingress-nginx-admission` and then redeploy._

## Dashboard

```bash
kubectl describe service/kubernetes-dashboard -n kube-system
```

Will return an endpoint. For me it looks like this: 10.1.43.61:8443
Then you can open your browser at https://10.1.43.61:8443 and you probably have to bypass a security warning.

Now you need to authenticate to access the dashboard.

```
token=$(microk8s kubectl -n kube-system get secret | grep default-token | cut -d " " -f1)
microk8s kubectl -n kube-system describe secret $token
```

(this command from the [docs][1])
Will return the auth token. Paste the token into the login screen and now you should be able to access the dashboard.

[1]: https://microk8s.io/docs/addon-dashboard

## Stop

To stop the cluster simply run

```bash
microk8s stop
```

## Reset

To reset the cluster run

```bash
microk8s reset
```
