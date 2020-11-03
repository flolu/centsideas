import {Environments} from '@centsideas/common/enums'

import {IConfig} from './config.interface'

export const dev: IConfig = {
  environment: Environments.Development,
  api: 'http://localhost:3000',
  kafka: {
    brokers: ['kafka:9092'],
  },
  mailing: {
    from: {
      noreply: 'CentsIdeas Dev <noreply@centsideas.com>',
    },
  },
  eventStore: {
    url: 'mongo-db:27017',
    user: 'admin',
  },
  readDatabase: {
    url: 'mongo-db:27017',
    user: 'admin',
  },
  auth: {
    host: 'centsideas_auth',
    eventStore: {
      sessionDbName: 'session',
      sessionSnapshotThreshold: 50,
    },
  },
  user: {
    host: 'centsideas_user',
    eventStore: {
      userDbName: 'user',
      privateUserDbName: 'privateUser',
      userSnapshotThreshold: 50,
      privateUserSnapshotThreshold: 50,
    },
  },
  userRead: {
    host: 'centsideas_user-read',
    database: {
      name: 'userRead',
    },
  },
}
