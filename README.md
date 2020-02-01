# [CENTS](https://www.thefastlaneforum.com/community/threads/the-cents-business-commandments-for-entrepreneurs.81090/) Ideas

⚙ Control 🔓 Entry 🙏 Need ⏳ Time 🌍 Scale

# Goals

| Requirement             | Keywords                              | Importance | Status |
| ----------------------- | ------------------------------------- | ---------- | ------ |
| Event Sourcing          | CQRS, Event-Driven, Commands, Kafka   | 🔥         | ✅     |
| Deployment              | CI/CD, Build Automation, Bazel        | 🔥         | ✅     |
| Test Driven Development | Unit Tests, Integration Tests         | 🔥         | ✅     |
| Microservices           | Small, Independent                    | 🔥         | ✔️     |
| Docker                  | Container                             | 🔥         | ✔️     |
| Kubernetes              | Container Orchestration               | 🔥         | ⏳     |
| Encryption              | HTTPs, Hashing, Safety                | 🔥         | ❌     |
| Database(s)             | Storage, Event-Store                  | 🔥         | ⏳     |
| File Storage            | Storage                               | 🔥         | ❌     |
| Redux                   | Reactive, Actions, Effects            | 🔥         | ✅     |
| GDPR                    | Legal, Privacy                        | 🔥         | ❌     |
| SEO                     | Marketing                             | 🔥         | ❌     |
| Authentication          | Passwordless                          | 🔥         | ❌     |
| Monorepo                | All packages and services in one repo | 🔥         | ✅     |
| Local Development       | Realtime code rebuild, Testing        | 🙂         | ✅     |
| Typescript              | Types                                 | 🙂         | ✔️     |
| Node.js                 | Javascript,Best Practices             | 🙂         | ✅     |
| Local Development       | Nodemon, Docker, VSCode               | 🙂         | ✅     |
| Monitoring              | Logs, Alarms, Dashboard               | 🙂         | ❌     |
| Git Flow                | Branching, Rebase                     | 🙂         | ✅     |
| Gateway                 | Discovery, Entry, Auth                | 🙂         | ✅     |
| Linting                 | Formatting                            | 🌳         | ❌     |
| Cross Platform          | Electron, Nativescript                | 🌳         | ❌     |
| Caching                 | Performance                           | 🌳         | ❌     |
| Logging                 | Debugging                             | 🌳         | ✅     |
| μFrontends              | Composition, Independent              | 🌳         | ❌     |
| Static Pages            | Homepage, Content                     | 🌳         | ❌     |

### Status

✔️ Completely implemented

✅ Implemented in certain parts

⏳ Figuring out how to implement

❌ Not (yet) implemented

### Importance

🔥 Highly important

🙂 Moderately important

🌳 Not really important

# Development

```
yarn dev

cd services/frontend
yarn start

yarn test
```

# Git Flow

**Read [this](https://www.atlassian.com/git/tutorials/comparing-workflows/gitflow-workflow) for more detail**

![](<https://wac-cdn.atlassian.com/dam/jcr:61ccc620-5249-4338-be66-94d563f2843c/05%20(2).svg?cdnVersion=788>)

## Creating a feature branch

```
git flow feature start <name-of-feature-branch>
```

## Finishing a feature branch

```
git flow feature finish <name-of-feature-branch>
```

## Release branches

```
git flow release start 0.1.0
git flow release finish '0.1.0'
```

## Hotfix branches

```
git flow hotfix start <name-of-hotfix-branch>
git flow hotfix finish <name-of-hotfix-branch>
```

# Services

List of all microservices inside this monorepo (services depend on packages)

- ⛩️ [gateway](https://github.com/flolude/cents-ideas/tree/develop/services/gateway)
- 💡 [ideas](https://github.com/flolude/cents-ideas/tree/develop/services/ideas)
- 📱 [frontend](https://github.com/flolude/cents-ideas/blob/develop/services/frontend)
- ⭐ [reviews](https://github.com/flolude/cents-ideas/tree/develop/services/reviews)
- 🍝 [consumer](https://github.com/flolude/cents-ideas/tree/develop/services/consumer)

# Packages

List of all packages inside this monorepo (packages are dependencies of services)

- [enums](https://github.com/flolude/cents-ideas/tree/master/packages/enums)
- [event-sourcing](https://github.com/flolude/cents-ideas/tree/master/packages/event-sourcing)
- [models](https://github.com/flolude/cents-ideas/tree/master/packages/models)
- [utils](https://github.com/flolude/cents-ideas/tree/master/packages/utils)

# Requirements

### Required

- node.js
- docker
- docker-compose
- yarn
- bazel

### Optional

- microk8s or minikube
- kubectl

### Recommended VSCode Plugins

- [Todo Tree](https://marketplace.visualstudio.com/items?itemName=Gruntfuggly.todo-tree)
- [Docker](https://marketplace.visualstudio.com/items?itemName=ms-azuretools.vscode-docker)
- [Kubernetes](https://marketplace.visualstudio.com/items?itemName=ms-kubernetes-tools.vscode-kubernetes-tools)
- [Angular template formatter](https://marketplace.visualstudio.com/items?itemName=stringham.angular-template-formatter)

# Some Useful Commands for Development

```
# update all your @bazel-scoped npm packages to the latest versions
yarn upgrade --scope @bazel

# stop all docker containers
docker container stop $(docker container ls -aq)

# remove all docker images with tag <none>
docker rmi $(docker images --filter "dangling=true" -q --no-trunc)

# clean up all docker resources
docker system prune --volumes

# get microk8s cluster info
microk8s.kubectl cluster-info

# issue an ssl certificate
sudo apt-get install letsencrypt
sudo certbot certonly --manual -d *.drakery.com
# then follow steps

# create k8s secret containing ssl certificate and key
kubectl create secret tls tls-secret --key privateKey.pem --cert certificate.pem
```

> Starts `minikube` for development of container orchestration with Kubernetes

```
minikube start
kubectl apply -f ./kubernetes/common
kubectl apply -f ./kubernetes/minikube

# get ip
minikube ip

# open browser http://<IP>:30001
```
