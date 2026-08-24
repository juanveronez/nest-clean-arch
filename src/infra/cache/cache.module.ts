import { Module } from '@nestjs/common'
import { EnvService } from '../env/env.service'
import { CacheRepository } from './cache-repository'
import { RedisService } from './redis/redis.service'
import { RedisCacheRepository } from './redis/redis-cache-repository'

@Module({
  providers: [
    EnvService,
    RedisService,
    { provide: CacheRepository, useClass: RedisCacheRepository },
  ],
  exports: [CacheRepository],
})
export class CacheModule {}
