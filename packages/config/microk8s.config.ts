import {Environments} from '@centsideas/common/enums'

import {IConfig} from './config.interface'

export const microk8s: IConfig = {
  environment: Environments.MicroK8s,
  api: 'http://api.localhost',
  kafka: {
    brokers: ['kafka-cluster-kafka-bootstrap.kafka.svc.cluster.local:9092'],
  },
  mailing: {
    from: {
      noreply: 'CentsIdeas MicroK8s <noreply@centsideas.com>',
    },
  },
  eventStore: {
    url:
      'event-store-0.event-store-svc.mongodb.svc.cluster.local:27017,event-store-1.event-store-svc.mongodb.svc.cluster.local:27017?replicaSet=event-store',
    user: 'admin',
  },
  readDatabase: {
    url:
      'read-database-0.read-database-svc.mongodb.svc.cluster.local:27017,read-database-1.read-database-svc.mongodb.svc.cluster.local:27017?replicaSet=read-database',
    user: 'admin',
  },
  auth: {
    host: 'auth-write',
    eventStore: {
      sessionDbName: 'session',
      sessionSnapshotThreshold: 50,
    },
  },
  user: {
    host: 'user-write',
    eventStore: {
      userDbName: 'user',
      privateUserDbName: 'privateUser',
      userSnapshotThreshold: 50,
      privateUserSnapshotThreshold: 50,
    },
  },
  userRead: {
    host: 'user-read',
    database: {
      name: 'userRead',
    },
  },
}
