import Redis from "ioredis";

const redis = new Redis({
    host: 'redis',
    port: 6397
});

export default redis;