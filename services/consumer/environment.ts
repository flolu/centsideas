export default {
  environment: process.env.ENV!,
  port: 3000,
  kafka: {
    brokers: [process.env.KAFKA_BROKER_HOST!],
  },
  database: {
    url: process.env.PROJECTION_DATABASE_URL!,
  },
};
