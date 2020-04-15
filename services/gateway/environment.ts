export default {
  environment: process.env.ENV,
  port: 3000,
  hosts: {
    ideas: `http://${process.env.IDEAS_SERVICE_HOST || 'ideas:3000'}`,
    consumer: `http://${process.env.CONSUMER_SERVICE_HOST || 'consumer:3000'}`,
    reviews: `http://${process.env.REVIEWS_SERVICE_HOST || 'reviews:3000'}`,
    users: `http://${process.env.USERS_SERVICE_HOST || 'users:3000'}`,
  },
  accessTokenSecret: process.env.ACCESS_TOKEN_SECRET!,
  frontendUrl: process.env.FRONTEND_URL!,
};
