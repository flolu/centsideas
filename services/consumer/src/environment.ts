export default {
  environment: process.env.NODE_ENV || 'dev',
  kafka: {
    brokers: [process.env.KAFKA_BROKER_HOST || '172.18.0.1:9092'],
  },
  database: {
    url: process.env.PROJECTION_DATABASE_URL || 'mongodb://projection-database:27017',
  },
  port: 3000,
};
