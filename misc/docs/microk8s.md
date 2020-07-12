# Local Kubernetes Cluster

## Requirements

Make sure you have followed the installation [instructions](ubuntu.md) to install [MicroK8s](https://github.com/ubuntu/microk8s) on your machine.

```bash
sudo snap install microk8s --classic
```

## Cluster Setup

Now we will start the local Kubernetes cluster and enable some addons.

```bash
microk8s start && \
microk8s enable dns storage ingress registry
```

Kafka

```bash
microk8s.kubectl create namespace kafka && \
microk8s.kubectl apply -f 'https://strimzi.io/install/latest?namespace=kafka' -n kafka && \
#microk8s.kubectl apply -f packages/kubernetes/kafka-ephemeral.yaml -n kafka
```

```bash
# microk8s.helm init
# microk8s.helm repo add strimzi https://strimzi.io/charts/
# microk8s.helm install strimzi/strimzi-kafka-operator --namespace kafka
# microk8s.helm ls
```

Elasticsearch
https://www.elastic.co/guide/en/cloud-on-k8s/current/k8s-deploy-elasticsearch.html

```
microk8s.kubectl apply -f https://download.elastic.co/downloads/eck/1.1.2/all-in-one.yaml

microk8s.kubectl create namespace elastic
microk8s.kubectl apply -f packages/kubernetes/elasticsearch-local.yaml -n elastic
```

not sure if needed but might be:
create `/etc/docker/daemon.json` with content

```
{"insecure-registries" : ["10.141.241.175:32000"]}
```

## Deployment

```bash
yarn deploy:microk8s
```

After everything has been deployed you can visit http://localhost, where the main client application is running. The gateway will be running under http://api.localhost.
This is the result of the configuration in `~/packages/kubernetes/local-ingress.yaml`.

> Note that the environment variables in `~.microk8s.env` will be used for this deployment

- _If you get an error like "kubectl toolchain was not properly configured" you can try to run the deployment command with `sudo`_

## Stop

To stop the cluster simply run

```bash
microk8s stop
```

## Reset

To reset the cluster run

```bash
kubectl delete apiservices --all && microk8s reset
```

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
Will return the auth token. Paste the token into the login screen and now you should be able to
access the dashboard.

[1]: https://microk8s.io/docs/addon-dashboard
