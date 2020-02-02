# [CENTS](https://www.thefastlaneforum.com/community/threads/the-cents-business-commandments-for-entrepreneurs.81090/) Ideas

# Description

This is a project with the purpose of learning the architecture of complex web applications. The main goals can be seen in the table below. CENTS Ideas is going to be a website to share, review and discover business ideas. The concept of CENTS (⚙ Control 🔓 Entry 🙏 Need ⏳ Time 🌍 Scale) was initially introduced by [MJ DeMarco](http://www.mjdemarco.com/).

# Goals

## Essential

| Requirement    | Keywords                               | Status |
| -------------- | -------------------------------------- | ------ |
| Event sourcing | event-driven, commands, message broker | ✅     |
| Deployment     | ci, cd, build automation, bazel        | ✅     |
| Testing        | unit Tests, integration Tests          | ✅     |
| Microservices  | small services, docker                 | ✔️     |
| Kubernetes     | container orchestration                | ⏳     |
| Database(s)    | data storage, event store              | ⏳     |
| File storage   | blob storage                           | ❌     |
| Redux frontend | reactive, actions, effects             | ✅     |
| GDPR           | legal, privacy                         | ❌     |
| SEO            | server side rendering, marketing       | ❌     |
| Monorepo       | all packages and services in one repo  | ✅     |

## Secondary

| Requirement       | Keywords                           | Status |
| ----------------- | ---------------------------------- | ------ |
| Typescript        | types everywhere!                  | ✔️     |
| Local development | hot reload, docker-compose, vscode | ✔️     |
| Monitoring        | logs, alarms, dashboard            | ❌     |
| Git flow          | branching, releases, rebasing      | ✅     |
| Gateway           | discovery, entry point, auth       | ✅     |
| Static pages      | homepage, static content           | ❌     |
| Cross platform    | electron, nativescript             | ❌     |

### Status

✔️ Completely implemented

✅ Implemented in certain parts

⏳ Figuring out how to implement

❌ Not (yet) implemented

# Development

```
yarn dev

cd services/frontend
yarn start

yarn test
```

# Services

- ⛩️ [gateway](https://github.com/flolude/cents-ideas/tree/develop/services/gateway)
- 💡 [ideas](https://github.com/flolude/cents-ideas/tree/develop/services/ideas)
- 📱 [frontend](https://github.com/flolude/cents-ideas/blob/develop/services/frontend)
- ⭐ [reviews](https://github.com/flolude/cents-ideas/tree/develop/services/reviews)
- 🍝 [consumer](https://github.com/flolude/cents-ideas/tree/develop/services/consumer)

# Packages

- [enums](https://github.com/flolude/cents-ideas/tree/master/packages/enums)
- [event-sourcing](https://github.com/flolude/cents-ideas/tree/master/packages/event-sourcing)
- [models](https://github.com/flolude/cents-ideas/tree/master/packages/models)
- [utils](https://github.com/flolude/cents-ideas/tree/master/packages/utils)

# Requirements

**Required**: git, docker, docker-compose, node, yarn, bazel

**Optional**: microk8s or minikube, kubectl

**Recommended VSCode Plugins**: [TSLint](https://marketplace.visualstudio.com/items?itemName=ms-vscode.vscode-typescript-tslint-plugin), [Prettier](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode), [Angular template formatter](https://marketplace.visualstudio.com/items?itemName=stringham.angular-template-formatter), [Todo Tree](https://marketplace.visualstudio.com/items?itemName=Gruntfuggly.todo-tree), [Docker](https://marketplace.visualstudio.com/items?itemName=ms-azuretools.vscode-docker), [Kubernetes](https://marketplace.visualstudio.com/items?itemName=ms-kubernetes-tools.vscode-kubernetes-tools), [Code Spell Checker](https://marketplace.visualstudio.com/items?itemName=streetsidesoftware.code-spell-checker)

# Git Flow

**Read [this](https://www.atlassian.com/git/tutorials/comparing-workflows/gitflow-workflow) for more detail**

**Creating a feature branch**

```
git flow feature start <name-of-feature-branch>
```

**Finishing a feature branch**

```
git flow feature finish <name-of-feature-branch>
```

**Release branches**

```
git flow release start 0.1.0
git flow release finish '0.1.0'
```

**Hotfix branches**

```
git flow hotfix start <name-of-hotfix-branch>
git flow hotfix finish <name-of-hotfix-branch>
```

# Useful Commands

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
sudo apt-get install letsencrypt
sudo certbot certonly --manual -d *.domain.com
```

**Create k8s secret containing ssl certificate and key**

```
kubectl create secret tls tls-secret --key privateKey.pem --cert certificate.pem
```
