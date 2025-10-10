import { RedisOptions } from "ioredis";
import { appConfig } from "../../app/config/AppConfig";

export const redisConnection: RedisOptions = {
  host: appConfig.redis.host,
  port: appConfig.redis.port,
  ...(appConfig.redis.password && { password: appConfig.redis.password }),
};
