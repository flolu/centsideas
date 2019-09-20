const env = {
  environment: process.env.NODE_ENV,
  kafka: {
    brokers: ['172.18.0.1:9092'],
  },
};
export default env;
