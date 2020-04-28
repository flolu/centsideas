# Local Kubernetes Cluster

## Requirements

Make sure you have followed the installation [instructions](ubuntu.md) to install [MicroK8s](https://github.com/ubuntu/microk8s) on your machine.

## Local Docker Registry

The Docker images of our services will be pushed to a [local registry](https://docs.docker.com/registry/deploying/#run-a-local-registry). They can then be pulled into our local cluster without having to upload them to some remote registry.

```bash
docker run -d -p 5000:5000 --restart=always --name registry registry:2
```

<!---
# TODO try using https://microk8s.io/docs/registry-built-in instead of own local registry!)
-->

## Cluster Setup

Now we will start the local Kubernetes cluster and enable some addons.

```bash
microk8s start
microk8s enable dns storage ingress
```

**Ingress**

To access our application from http://localhost we need to setup an ingress. We will use the [NGINX Ingress Controller](https://kubernetes.github.io/ingress-nginx) to do this. To install it just run:

```bash
kubectl apply -f https://raw.githubusercontent.com/kubernetes/ingress-nginx/master/deploy/static/provider/baremetal/deploy.yaml
```

Verify the installation of the Ingress controller by running

```bash
kubectl get pods -n ingress-nginx -l app.kubernetes.io/name=ingress-nginx --watch
```

## Deployment

```bash
yarn deploy:microk8s
```

Now you can visit http://localhost, where the main client application is running. The gateway will be running under http://api.localhost.
This is the result of the configuration in `~/packages/kubernetes/local-ingress.yaml`.

> Note that the environment variables in `~.env.microk8s` will be used for this deployment

_If you run into any errors related to NGINX Ingress during deployment you might want to try running `kubectl delete validatingwebhookconfiguration ingress-nginx-admission` and then redeploy._

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
