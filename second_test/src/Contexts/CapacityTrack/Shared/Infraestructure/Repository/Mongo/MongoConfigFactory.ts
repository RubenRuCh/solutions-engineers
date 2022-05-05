import MongoConfig from '../../../../../Shared/Infraestructure/Repository/Mongo/MongoConfig';
import config from '../../config';

const mongoConfig = {
  url: config.get('mongo.url')
};

export class MongoConfigFactory {
  static createConfig(): MongoConfig {
    return mongoConfig;
  }
}
