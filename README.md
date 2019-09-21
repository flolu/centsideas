# [CENTS](https://www.thefastlaneforum.com/community/threads/the-cents-business-commandments-for-entrepreneurs.81090/) Ideas

⚙ Control
🔓 Entry
🙏 Need
⏳ Time
🌍 Scale

## Requirements

| Requirement             | Keywords                            | Importance | Status |
| ----------------------- | ----------------------------------- | ---------- | ------ |
| Event Sourcing          | CQRS, Event-Driven, Commands, Kafka | 🔥         | ⏳     |
| Deployment              | CI, CD, Build Pipeline              | 🔥         | ❌     |
| Test Driven Development | Unit Tests, Integration Tests       | 🔥         | ⏳     |
| Microservices           | Small, Independent                  | 🔥         | ✅     |
| Docker                  | Container                           | 🔥         | ✅     |
| Kubernetes              | Container Orchestration             | 🔥         | ❌     |
| Encryption              | HTTPs, Hashing, Safety              | 🔥         | ❌     |
| Database(s)             | Storage, Event-Store                | 🔥         | ⏳     |
| File Storage            | Storage                             | 🔥         | ❌     |
| Redux                   | Reactive, Actions, Effects          | 🔥         | ❌     |
| GDPR                    | Legal, Privacy                      | 🔥         | ❌     |
| SEO                     | Marketing                           | 🔥         | ❌     |
| Typescript              | Types                               | 🙂         | ✔️     |
| Node.js                 | Javascript,Best Practices           | 🙂         | ⏳     |
| Local Development       | Nodemon, Docker, VSCode             | 🙂         | ✅     |
| Monorepo                | Lerna, Yarn Workspaces              | 🙂         | ⏳     |
| Monitoring              | Logs, Alarms, Dashboard             | 🙂         | ❌     |
| Git Flow                | Branching, Rebase                   | 🙂         | ⏳     |
| Gateway                 | Discovery, Entry, Auth              | 🙂         | ⏳     |
| Linting                 | Formatting                          | 🌳         | ❌     |
| RxJs                    | Reactive                            | 🌳         | ❌     |
| Cross Platform          | Electron, Nativescript              | 🌳         | ❌     |
| Caching                 | Performance                         | 🌳         | ❌     |
| Logging                 | Debugging                           | 🌳         | ✅     |
| μFrontends              | Composition, Independent            | 🌳         | ❌     |

### Status

✔️ Completely implemented
✅ Implemented in certain parts
⏳ Figuring out how to implement
❌ Not implemented

### Importance

🔥 Highly important
🙂 Moderately important
🌳 Not really important

## Requirements

- node.js
- docker
- docker-compose
- yarn
- _minikube_
- _kubectl_

## Setup

### For Development

> Starts all services with `docker-compose` and simoultaniously watches for code changes

```
yarn start:dev
```

> Starts `minikube` for development of container orchestration with Kubernetes

```
not configured yet
```

## Testing

```
yarn test
```

## Deployment

```
not configured yet
```

## Some Useful Commands for Development

```
# open command line of a docker container
docker exec -ti <container> /bin/bash

# fetch docker host ip address
ifconfig | grep -E "([0-9]{1,3}\.){3}[0-9]{1,3}" | grep -v 127.0.0.1 | awk '{ print $2 }' | cut -f2 -d: | head -n1
```
