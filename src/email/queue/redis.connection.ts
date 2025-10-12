import type { RedisOptions } from "ioredis";
import { appConfig } from "../../app/config/app.config";

export const redisConnection: RedisOptions = {
	host: appConfig.redis.host,
	port: appConfig.redis.port,
	...(appConfig.redis.password && { password: appConfig.redis.password }),
};
