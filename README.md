# [CENTS](https://www.thefastlaneforum.com/community/threads/the-cents-business-commandments-for-entrepreneurs.81090/) Ideas

# Description

This is a project with the purpose of learning the architecture of complex web applications. The main goals can be seen in the table below. CENTS Ideas is going to be a website to share, review and discover business ideas. The concept of CENTS (⚙ Control 🔓 Entry 🙏 Need ⏳ Time 🌍 Scale) was initially introduced by [MJ DeMarco](http://www.mjdemarco.com/).

# Goals

## Essential

| Requirement       | Keywords                               | Status |
| ----------------- | -------------------------------------- | ------ |
| Event sourcing    | event-driven, commands, message broker | ✅     |
| Deployment        | ci, cd, build automation, bazel        | ✅     |
| Testing           | unit Tests, integration Tests          | ✔️     |
| Microservices     | small services, docker                 | ✔️     |
| Kubernetes        | container orchestration                | ✅     |
| Database(s)       | data storage, event store              | ✅     |
| File storage      | blob storage                           | ❌     |
| Redux frontend    | reactive, actions, effects             | ✅     |
| GDPR              | legal, privacy                         | ❌     |
| SEO               | server side rendering, marketing       | ❌     |
| Monorepo          | all packages and services in one repo  | ✔️     |
| Typescript        | types everywhere!                      | ✔️     |
| Local development | hot reload, docker-compose, vscode     | ✔️     |
| Git flow          | branching, releases, rebasing          | ✔️     |
| Gateway           | discovery, entry point, auth           | ✔️     |
| Static pages      | homepage, static content               | ❌     |
| Search            | indexing, realtime search              | ❌     |
| Cross platform    | electron, nativescript?                | ❌     |
| Authentication    | passwordless, 2f auth, google login    | ❌     |
| Admin panel       | monitoring, event handling, logs       | ❌     |
| Backups           | automatic, manual, restore             | ❌     |
| Realtime          | some kind of realtime integration      | ❌     |
| User Interface    | modern, unique, reusable               | ❌     |

### Status

✔️ Completely implemented

✅ Implemented in certain parts

⏳ Figuring out how to implement

❌ Not (yet) implemented

# Development

- `yarn` to install all necessary dependencies for local development
- `yarn dev` to start all backend services locally (gateway is available under http://localhost:3000)
- `yarn client:start` to start the frontend application (live url is printed in logs)
- `yarn test` to run all unit tests
- `yarn deploy` to deploy all services to your Kubernetes cluster (works only if kubectl and google-cloud-sdk are installed, and your need to authenticated to push containers to google container registry and deploy configurations to your kubernetes cluster)

## Requirements

- Yarn
- Docker-Compose
- NodeJs
- _kubectl_
- _google-cloud-sdk_
- _Bazel_

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
