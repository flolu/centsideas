import {Environments} from '@centsideas/common/enums'

import {IConfig} from './config.interface'

export const prod: IConfig = {
  environment: Environments.Production,
  api: 'https://api.centsideas.com',
  kafka: {
    brokers: ['kafka-cluster-kafka-bootstrap.kafka.svc.cluster.local:9092'],
  },
  mailing: {
    from: {
      noreply: 'CentsIdeas <noreply@centsideas.com>',
    },
  },
  eventStore: {
    url: 'TODO',
    user: 'admin',
  },
  readDatabase: {
    url: 'TODO',
    user: 'admin',
  },
  auth: {
    host: 'auth',
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
