import RedisStore from "connect-redis";
import { createClient } from "redis";

let redis = createClient();

redis.on("error", (error) => console.log(error));

(async () => await redis.connect())();

let redisStore = new RedisStore({
  client: redis,
  prefix: "myapp",
});

export { redis, redisStore };
