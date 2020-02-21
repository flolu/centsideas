export default {
  environment: process.env.NODE_ENV || 'dev',
  port: 3000,
  databaseUrl: process.env.USERS_DATABASE_URL || 'mongodb://users-event-store:27017',
  userDatabaseName: 'users',
  loginDatabaseName: 'logins',
  jwtSecret: process.env.JWT_SECRET || 'default-jwt-secret',
  mailing: {
    service: process.env.NODE_MAILER_SERVICE || 'Mailjet',
    user: process.env.NODE_MAILER_AUTH_USER || 'user',
    password: process.env.NODE_MAILER_AUTH_PASSWORD || 'pass',
    fromAddress: 'CENTS Ideas <dev@flolu.com>',
  },
  frontendUrl: process.env.FRONTEND_URL || 'http://localhost:4200',
};
