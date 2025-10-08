import { RedisOptions } from "ioredis";
import { appConfig } from "../../app/config/AppConfig";

const restUrl = appConfig.redis.restUrl;
const host = restUrl.replace('https://', '').replace('http://', '');

export const redisConnection: RedisOptions = {
  host,
  port: 6379,
  password: appConfig.redis.restToken,
  tls: {}, // Upstash requires TLS for secure connection
};
