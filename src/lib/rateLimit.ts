import { Redis } from "@upstash/redis";
import { Ratelimit } from "@upstash/ratelimit";

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

export const orderRateLimit = new Ratelimit({
  redis,

  limiter: Ratelimit.slidingWindow(5, "60 s"),

  analytics: true,

  prefix: "kickdistrict:orders",
});