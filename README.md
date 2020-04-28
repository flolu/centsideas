# [CENTS](https://www.thefastlaneforum.com/community/threads/the-cents-business-commandments-for-entrepreneurs.81090/) Ideas

# Description

This is a project with the purpose of learning the architecture of complex web applications. The main goals can be seen in the table below. CENTS Ideas is going to be a website to share, review and discover business ideas. The concept of CENTS (⚙ Control 🔓 Entry 🙏 Need ⏳ Time 🌍 Scale) was initially introduced by [MJ DeMarco](http://www.mjdemarco.com/).

# Goals

| Requirement                                    | Keywords                                   | Status |
| ---------------------------------------------- | ------------------------------------------ | ------ |
| Microservices                                  | small services, docker                     | ✔️     |
| Redux frontend                                 | reactive, actions, effects                 | ✔️     |
| Monorepo                                       | all packages and services in one repo      | ✔️     |
| Typescript                                     | types everywhere!                          | ✔️     |
| Local development                              | hot reload, docker-compose, vscode, ubuntu | ✔️     |
| Git flow                                       | branching, releases, rebasing              | ✔️     |
| Gateway                                        | discovery, entry point, auth               | ✔️     |
| Authentication                                 | passwordless, google login                 | ✔️     |
| Progressive Web App                            | pwa, service worker, mobile-friendly       | ✔️     |
| Frontend                                       | code splitting, 100% lighthouse score      | ✔️     |
| [Event sourcing](https://youtu.be/GzrZworHpIk) | event-driven, commands, message broker     | ✅     |
| Deployment                                     | ci, cd, build automation, bazel            | ✅     |
| Testing                                        | unit tests, integration Tests              | ✅     |
| Kubernetes                                     | container orchestration                    | ✅     |
| Database(s)                                    | data storage, event store, backups         | ✅     |
| Search Engine Optimization                     | server side rendering, marketing, google   | ✅     |
| Security                                       | encryption, https                          | ✅     |
| Push notifications                             | mobile and desktop                         | ✅     |
| Local Kubernetes Cluster                       | microk8s                                   | ✅     |
| Admin panel                                    | monitoring, event handling, logs           | ❌     |
| Realtime                                       | some kind of realtime integration          | ❌     |
| File storage                                   | blob storage, encrypted, access control    | ❌     |
| General Data Protection Regulation             | legal, privacy, gdpr, eu law               | ❌     |
| Backups                                        | automatic, manual, restore                 | ❌     |
| Multi-Language                                 | change language, easily add more           | ❌     |
| Static pages                                   | homepage, static content                   | ❌     |
| Search                                         | indexing, realtime search                  | ❌     |
| User Interface                                 | modern, drag&drop, touch gestures          | ❌     |
| Trusted Web Activity                           | twa, publish app on play store             | ❌     |
| Message Queue                                  | batching, scheduled tasks                  | ❌     |
| Compute server                                 | non-nodejs server for high cpu tasks       | ❌     |
| Payments                                       | payout, credit card, paypal                | ❌     |
| Recommendation System                          | machine learning                           | ❌     |
| Protobuf                                       | grpc                                       | ❌     |

✔️ Completely implemented
✅ Partly implemented
❌ Not yet implemented

# Commands

**Setup**

`yarn setup` install dependencies, add environments

- Afterwards you might want to add your credentials into `.env.dev`. Those variables will bill used across all services.

**Backend**

`yarn dev` backend services http://localhost:3000

**Main web app**

`yarn client` production server http://localhost:4000

`yarn client:dev` development server http://localhost:4200

**Admin web app**

`yarn admin` production server http://localhost:8080

`yarn admin:dev` development server http://localhost:4201

**Testing**

`yarn test` all tests

**Misc**

`yarn clean` clear the mess

`yarn lint` check syntax improvements

`yarn up` upgrade npm dependencies

`yarn deploy:microk8s` deploy app to local kubernetes cluster

# Documentation

[Setup your local development environment on Ubuntu](misc/docs/ubuntu.md)

[Use MicroK8s to run the application on a local Kubernetes cluster](misc/docs/microk8s.md)

[Deploy the application to a Kubernetes cluster running in the cloud](misc/docs/deployment.md)

[User Git Flow to manage development of new features](misc/docs/gitflow.md)

# Thanks to all people listed below for your help!

[@rayman1104](https://github.com/rayman1104) [@marcus-sa](https://github.com/marcus-sa)
