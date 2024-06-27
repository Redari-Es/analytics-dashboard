import { Redis } from '@upstash/redis'


export const redis = new Redis({
  url: 'https://holy-dove-37457.upstash.io',
  token: process.env.REDIS_KEY!,
})

