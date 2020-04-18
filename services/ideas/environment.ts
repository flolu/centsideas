export default {
  environment: process.env.ENV!,
  port: 3000,
  database: {
    url: process.env.IDEAS_DATABASE_URL!,
    name: 'ideas',
  },
};
