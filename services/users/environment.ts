export default {
  // TODO require the envs to be set like line below to remove cluttery defaults
  // environment: process.env.NODE_ENV!,
  environment: process.env.NODE_ENV || 'dev',
  port: 3000,
  databaseUrl: process.env.USERS_DATABASE_URL || 'mongodb://users-event-store:27017',
  userDatabaseName: 'users',
  loginDatabaseName: 'logins',
  mailing: {
    apiKey: process.env.SEND_GRID_API_KEY || '',
    fromAddress: 'CENTS Ideas <noreply@centsideas.com>',
  },
  frontendUrl: process.env.FRONTEND_URL || 'http://localhost:5432',
  accessTokenSecret: process.env.ACCESS_TOKEN_SECRET!,
  refreshTokenSecret: process.env.REFRESH_TOKEN_SECRET!,
  loginTokenSecret: process.env.LOGIN_TOKEN_SECRET!,
  changeEmailTokenSecret: process.env.CHANGE_EMAIL_TOKEN_SECRET!,
};
