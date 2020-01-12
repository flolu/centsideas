export default {
  environment: process.env.NODE_ENV || 'dev',
  port: 3000,
  databaseUrl: process.env.USERS_DATABASE_URL || 'mongodb://users-event-store:27017',
  userDatabaseName: 'users',
  loginDatabaseName: 'logins',
  jwtSecret: process.env.JWT_SECRET || 'default-jwt-secret',
};
