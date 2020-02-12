# [CENTS](https://www.thefastlaneforum.com/community/threads/the-cents-business-commandments-for-entrepreneurs.81090/) Ideas

# Description

This is a project with the purpose of learning the architecture of complex web applications. The main goals can be seen in the table below. CENTS Ideas is going to be a website to share, review and discover business ideas. The concept of CENTS (⚙ Control 🔓 Entry 🙏 Need ⏳ Time 🌍 Scale) was initially introduced by [MJ DeMarco](http://www.mjdemarco.com/).

# Goals

## Essential

| Requirement    | Keywords                               | Status |
| -------------- | -------------------------------------- | ------ |
| Event sourcing | event-driven, commands, message broker | ✅     |
| Deployment     | ci, cd, build automation, bazel        | ✅     |
| Testing        | unit Tests, integration Tests          | ✔️     |
| Microservices  | small services, docker                 | ✔️     |
| Kubernetes     | container orchestration                | ✅     |
| Database(s)    | data storage, event store              | ✅     |
| File storage   | blob storage                           | ❌     |
| Redux frontend | reactive, actions, effects             | ✅     |
| GDPR           | legal, privacy                         | ❌     |
| SEO            | server side rendering, marketing       | ❌     |
| Monorepo       | all packages and services in one repo  | ✔️     |

## Secondary

| Requirement       | Keywords                           | Status |
| ----------------- | ---------------------------------- | ------ |
| Typescript        | types everywhere!                  | ✔️     |
| Local development | hot reload, docker-compose, vscode | ✔️     |
| Monitoring        | logs, alarms, dashboard            | ❌     |
| Git flow          | branching, releases, rebasing      | ✔️     |
| Gateway           | discovery, entry point, auth       | ✔️     |
| Static pages      | homepage, static content           | ❌     |
| Cross platform    | electron, nativescript             | ❌     |

### Status

✔️ Completely implemented

✅ Implemented in certain parts

⏳ Figuring out how to implement

❌ Not (yet) implemented

# Development

To start all backend services with the help of `docker-compose` simply run

```
yarn dev
```

If you wish to also run the frontend application you have to `cd` into `/services/frontend` and run

```
yarn start
```

# Testing

By running

```
yarn test
```

Bazel will execute all unit tests.

# Deployment

To deploy all services to Kubernetes run

```
yarn deploy
```

It only works if you have Bazel, kubectl and Google Cloud SDK installed. (you also need to be authenticated to push containers to Google Container Registry and deploy configurations to your Kubernetes cluster)

# Structure

**Services**

[gateway](https://github.com/flolude/cents-ideas/tree/develop/services/gateway), [ideas](https://github.com/flolude/cents-ideas/tree/develop/services/ideas), [frontend](https://github.com/flolude/cents-ideas/blob/develop/services/frontend), [reviews](https://github.com/flolude/cents-ideas/tree/develop/services/reviews), [consumer](https://github.com/flolude/cents-ideas/tree/develop/services/consumer)

**Packages**

[enums](https://github.com/flolude/cents-ideas/tree/master/packages/enums), [event-sourcing](https://github.com/flolude/cents-ideas/tree/master/packages/event-sourcing), [models](https://github.com/flolude/cents-ideas/tree/master/packages/models), [utils](https://github.com/flolude/cents-ideas/tree/master/packages/utils)

# Requirements

**Required**: git, docker, docker-compose, node, yarn, bazel

**Optional**: microk8s or minikube, kubectl, google-cloud-sdk

**Recommended VSCode Plugins**: [TSLint](https://marketplace.visualstudio.com/items?itemName=ms-vscode.vscode-typescript-tslint-plugin), [Prettier](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode), [Angular template formatter](https://marketplace.visualstudio.com/items?itemName=stringham.angular-template-formatter), [Todo Tree](https://marketplace.visualstudio.com/items?itemName=Gruntfuggly.todo-tree), [Docker](https://marketplace.visualstudio.com/items?itemName=ms-azuretools.vscode-docker), [Kubernetes](https://marketplace.visualstudio.com/items?itemName=ms-kubernetes-tools.vscode-kubernetes-tools), [Code Spell Checker](https://marketplace.visualstudio.com/items?itemName=streetsidesoftware.code-spell-checker)

# Git Flow

**Read [this](https://www.atlassian.com/git/tutorials/comparing-workflows/gitflow-workflow) for more detail**

**Creating a feature branch**

```
git checkout develop
git checkout -b <name-of-feature-branch>
```

**Finishing a feature branch**

```
git checkout develop
git merge <name-of-feature-branch>
```

**Release branches**

```
git checkout develop
git checkout -b release/0.1.0
# release work
git checkout master
git merge release/0.1.0
```

**Hotfix branches**

```
git checkout master
git checkout -b <name-of-hotfix-branch>
git checkout master
git merge <name-of-hotfix-branch>
git checkout develop
git merge <name-of-hotfix-branch>
git branch -D <name-of-hotfix-branch>
```

# Useful Commands

**Connect to GKE Cluster**

```
gcloud container clusters get-credentials cents-ideas --zone europe-west3-b --project cents-ideas
```

**Update all your @bazel-scoped npm packages to the latest versions**

```
yarn upgrade --scope @bazel
```

**Get microk8s cluster info**

```
microk8s.kubectl cluster-info
```

**Issue a ssl certificate**

```
sudo apt install certbot
sudo certbot certonly --manual -d *.domain.com
```

**Create k8s secret containing ssl certificate and key**

```
kubectl create secret tls tls-secret --key privateKey.pem --cert certificate.pem
```

## Setting up NGINX Ingress on GKE

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
