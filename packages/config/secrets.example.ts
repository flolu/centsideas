import {Secrets} from './config.interface'

export const secrets: Secrets = {
  tokens: {
    refresh: '___',
    access: '___',
    emailSignIn: '___',
    emailChange: '___',
    userDeletion: '___',
  },
  google: {
    clientId: '___',
    clientSecret: '___',
  },
  vapid: {
    public: '___',
    private: '___',
  },
  eventStore: {
    password: '___',
  },
  readDatabase: {
    password: '___',
  },
  sendgrid: {
    key: '___',
  },
}
