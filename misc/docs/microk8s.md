# Local Kubernetes Cluster

## Requirements

Make sure you have followed the installation [instructions](ubuntu.md) to install [MicroK8s](https://github.com/ubuntu/microk8s) on your machine.

## Cluster Setup

Now we will start the local Kubernetes cluster and enable some addons.

```bash
microk8s start
microk8s enable dns storage ingress registry helm3
```

not sure if needed but might be:
create `/etc/docker/daemon.json` with content

```
{
  "insecure-registries" : ["10.141.241.175:32000"]
}
```

## Deployment

```bash
yarn deploy:microk8s
```

After everything has been deployed you can visit http://localhost, where the main client application is running. The gateway will be running under http://api.localhost.
This is the result of the configuration in `~/packages/kubernetes/local-ingress.yaml`.

> Note that the environment variables in `~.env.microk8s` will be used for this deployment

- _If you get an error like "kubectl toolchain was not properly configured" you can try to run the deployment command with `sudo`_

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
