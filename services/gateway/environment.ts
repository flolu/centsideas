export default {
  environment: process.env.NODE_ENV || 'dev',
  port: 3000,
  hosts: {
    ideas: `http://${process.env.IDEAS_SERVICE_HOST || 'ideas:3000'}`,
    consumer: `http://${process.env.CONSUMER_SERVICE_HOST || 'consumer:3000'}`,
    reviews: `http://${process.env.REVIEWS_SERVICE_HOST || 'reviews:3000'}`,
    users: `http://${process.env.USERS_SERVICE_HOST || 'users:3000'}`,
  },
  jwtSecret: process.env.JWT_SECRET || 'default-jwt-secret',
};
