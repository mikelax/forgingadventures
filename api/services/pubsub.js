import config from 'config';
import { RedisPubSub } from 'graphql-redis-subscriptions';

export default new RedisPubSub({
  connection: {
    host: config.get('redis.host'),
    retry_strategy: (options) => {
      return Math.max(options.attempt * 100, 3000);
    }
  }
});
