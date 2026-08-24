import { Module } from '@nestjs/common'
import { EnvService } from '../env/env.service'
import { RedisService } from './redis/redis.service'

@Module({
  providers: [EnvService, RedisService],
})
export class CacheModule {}
