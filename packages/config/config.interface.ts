import {Environments} from '@centsideas/common/enums'

export interface IConfig {
  environment: Environments
  api: string
  kafka: {
    brokers: string[]
  }
  mailing: {
    from: {
      noreply: string
    }
  }
  eventStore: {
    url: string
    user: string
  }
  readDatabase: {
    url: string
    user: string
  }
  auth: {
    host: string
    eventStore: {
      sessionDbName: string
      sessionSnapshotThreshold: number
    }
  }
  user: {
    host: string
    eventStore: {
      userDbName: string
      privateUserDbName: string
      userSnapshotThreshold: number
      privateUserSnapshotThreshold: number
    }
  }
  userRead: {
    host: string
    database: {
      name: string
    }
  }
}

export interface Secrets {
  tokens: {
    refresh: string
    access: string
    emailSignIn: string
    emailChange: string
    userDeletion: string
  }
  google: {
    clientId: string
    clientSecret: string
  }
  vapid: {
    public: string
    private: string
  }
  eventStore: {
    password: string
  }
  readDatabase: {
    password: string
  }
  sendgrid: {
    key: string
  }
}
