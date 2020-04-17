export default {
  environment: process.env.ENV!,
  port: 3000,
  databaseUrl: process.env.USERS_DATABASE_URL!,
  userDatabaseName: 'users',
  loginDatabaseName: 'logins',
  frontendUrl: process.env.FRONTEND_URL!,
  mailing: {
    apiKey: process.env.SEND_GRID_API_KEY!,
    fromAddress: 'CENTS Ideas <noreply@centsideas.com>',
  },
  tokenSecrets: {
    accessToken: process.env.ACCESS_TOKEN_SECRET!,
    refreshToken: process.env.REFRESH_TOKEN_SECRET!,
    loginToken: process.env.LOGIN_TOKEN_SECRET!,
    changeEmailToken: process.env.CHANGE_EMAIL_TOKEN_SECRET!,
  },
  google: {
    clientId: process.env.GOOGLE_CLIENT_ID!,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
  },
  exchangeSecrets: {
    frontendServer: process.env.FRONTEND_SERVER_EXCHANGE_SECRET!,
  },
};
