# [CENTS](https://www.thefastlaneforum.com/community/threads/the-cents-business-commandments-for-entrepreneurs.81090/) Ideas

# Description

This is a project with the purpose of learning the architecture of complex web applications. The main goals can be seen in the table below. CENTS Ideas is going to be a website to share, review and discover business ideas. The concept of CENTS (⚙ Control 🔓 Entry 🙏 Need ⏳ Time 🌍 Scale) was initially introduced by [MJ DeMarco](http://www.mjdemarco.com/).

# Goals

| Requirement                                    | Keywords                               | Status |
| ---------------------------------------------- | -------------------------------------- | ------ |
| Microservices                                  | small services, docker                 | ✔️     |
| Redux frontend                                 | reactive, actions, effects             | ✔️     |
| Monorepo                                       | all packages and services in one repo  | ✔️     |
| Typescript                                     | types everywhere!                      | ✔️     |
| Local development                              | hot reload, docker-compose, vscode     | ✔️     |
| Git flow                                       | branching, releases, rebasing          | ✔️     |
| Gateway                                        | discovery, entry point, auth           | ✔️     |
| [Event sourcing](https://youtu.be/GzrZworHpIk) | event-driven, commands, message broker | ✅     |
| Deployment                                     | ci, cd, build automation, bazel        | ✅     |
| Testing                                        | unit Tests, integration Tests          | ✅     |
| Kubernetes                                     | container orchestration                | ✅     |
| Database(s)                                    | data storage, event store              | ✅     |
| SEO                                            | server side rendering, marketing       | ✅     |
| Authentication                                 | passwordless, google login             | ✅     |
| Progressive Web App                            | pwa, service worker, mobile-friendly   | ✅     |
| File storage                                   | blob storage                           | ❌     |
| Static pages                                   | homepage, static content               | ❌     |
| Search                                         | indexing, realtime search              | ❌     |
| Admin panel                                    | monitoring, event handling, logs       | ❌     |
| Backups                                        | automatic, manual, restore             | ❌     |
| Realtime                                       | some kind of realtime integration      | ❌     |
| GDPR                                           | legal, privacy                         | ❌     |
| User Interface                                 | modern, unique, reusable               | ❌     |
| Compute server                                 | non-nodejs server for high cpu tasks   | ❌     |

✔️ Completely implemented
✅ Partly implemented
❌ Not yet implemented

# Development

- `yarn` to install all necessary dependencies for local development
- `yarn dev` to start all backend services locally (gateway is available under http://localhost:3000)
- `yarn client:dev` to start the frontend application (live at http://localhost:5432)
- `yarn test` to run all unit tests
- `yarn client:ssr:dev` to start the frontend application with server side rendering (live at http://localhost:4000)
- `yarn clean` to clear node_modules, Bazel and Docker
- `yarn lint` to detect linting problems
- `yarn up` to find node module updates

## Requirements

- Yarn
- Docker-Compose
- NodeJs

# Deployment

_TODO: consider creating script to automate this_

### 1. Create [GKE](https://cloud.google.com/kubernetes-engine) cluster and connect to it

```
gcloud beta container --project "centsideas" clusters create "cents-ideas" --zone "europe-west3-b"
gcloud container clusters get-credentials cents-ideas --zone europe-west3-b --project centsideas
```

### 2. Setup [Helm](https://helm.sh/)

```
helm repo add stable https://kubernetes-charts.storage.googleapis.com/
helm repo add jetstack https://charts.jetstack.io/
helm repo update
```

### 3. Create an [NGINX Ingress](https://github.com/kubernetes/ingress-nginx)

```
kubectl create clusterrolebinding cluster-admin-binding --clusterrole cluster-admin --user $(gcloud config get-value account)

helm install nginx-ingress stable/nginx-ingress
```

### 4. Point Domain to IP

Go to the created [Load Balancer](https://console.cloud.google.com/net-services/loadbalancing/loadBalancers/list) and point your domain to this IP address via an "A" record.

| Record Type | Domain                    | Value      |
| ----------- | ------------------------- | ---------- |
| A           | cents-ideas.flolu.com     | IP address |
| A           | api.cents-ideas.flolu.com | IP address |

### 5. Setup [Cert Manager](https://github.com/helm/charts/tree/master/stable/cert-manager)

```
kubectl apply --validate=false -f https://raw.githubusercontent.com/jetstack/cert-manager/v0.13.0/deploy/manifests/00-crds.yaml
kubectl create namespace cert-manager
helm install cert-manager jetstack/cert-manager --namespace cert-manager
```

### 6. Deploy services

```
yarn deploy
```

## Git Flow

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
