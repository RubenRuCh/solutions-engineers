import convict from 'convict';

const courierConfig = convict({
  env: {
    doc: 'The application environment.',
    format: ['production', 'development', 'staging', 'test'],
    default: 'default',
    env: 'NODE_ENV'
  },
  mongo: {
    url: {
      doc: 'The Mongo connection URL',
      format: String,
      env: 'MONGO_URL',
      default: 'mongodb://mongo:27017/couriers-backend-dev'
    }
  }
});

courierConfig.loadFile([__dirname + '/default.json', __dirname + '/' + courierConfig.get('env') + '.json']);

export default courierConfig;
