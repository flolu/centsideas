export default {
  environment: process.env.ENV!,
  port: 3000,
  accessTokenSecret: process.env.ACCESS_TOKEN_SECRET!,
  frontendUrl: process.env.FRONTEND_URL!,
  hosts: {
    ideas: `http://${process.env.IDEAS_SERVICE_HOST!}`,
    consumer: `http://${process.env.CONSUMER_SERVICE_HOST!}`,
    reviews: `http://${process.env.REVIEWS_SERVICE_HOST!}`,
    users: `http://${process.env.USERS_SERVICE_HOST!}`,
  },
};
