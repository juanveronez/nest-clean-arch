import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { PrismaPg } from '@prisma/adapter-pg'
import { PrismaClient } from '../../../../generated/prisma/client'
import { Env } from '../../env'

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  constructor(readonly config: ConfigService<Env, true>) {
    const connectionString = config.get('DATABASE_URL', { infer: true })

    const schema =
      new URL(connectionString).searchParams.get('schema') || undefined

    const adapter = new PrismaPg({ connectionString }, { schema })

    super({ adapter })
  }

  async onModuleInit() {
    await ConfigModule.envVariablesLoaded

    return await this.$connect()
  }

  async onModuleDestroy() {
    return await this.$disconnect()
  }
}
