<div align="center">
  <a href="https://centsideas.com">
    <img width="180px" height="auto" src="misc/assets/icon.png" />
  </a>
  <br>
  <h1>CentsIdeas</h1>
  <p>
    Full stack application for sharing Fastlane ideas based on the
    <a href="https://www.thefastlaneforum.com/community/threads/the-cents-business-commandments-for-entrepreneurs.81090/">CENTS</a>
    commandments by
    <a href="https://www.mjdemarco.com/">MJ DeMarco</a>
  </p>
</div>

## Motives

### Backend

CentsIdeas is running on **small services** within a **Kubernetes** cluster. All requests coming from the outside go into the **gateway**. From there **remote procedure calls** are used to communicate with speicific services. Every service has it's own **database**.

### Event Sourcing

Often systems just store the _current_ state of the system. With **event sourcing** it is possible to know every state at any point of time. **Events** are the source of truth. **Projectors** listen for events and **project** events to the current state. Thus we can **separate the write and read side** and the current state behaves just like a cache.

### Web Application

The frontend is a **progressive web application**, which is sends a server side rendered copy to the client first, to improve **search engine optimization** and initial load time. CentsIdeas also tries to make user experience better by using a **clean user interface** and **realtime** data.

### Development

All the code for this project is contained in this one **monorepo**, which is made possible with the help of Bazel and Typescript. Developers can see changes in realtime through **Docker Compose** and run the code in a local **Microk8s** cluster to simulate the production environment.

The goal is to have **unit and integration tests** spaning across all services and packages, such that new features can be delivered to production frequently.

### Miscealenous

This project also aims to be compliant with GDPR.

## Documentation

_coming soon_

## Thanks to all people listed below for your help!

[@rayman1104](https://github.com/rayman1104) [@xmontero](https://github.com/xmontero) [@marcus-sa](https://github.com/marcus-sa) [@joeljeske](https://github.com/joeljeske)
