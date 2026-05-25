import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { PrismaPg } from '@prisma/adapter-pg'
import { EnvService } from '@/infra/env/env.service'
import { PrismaClient } from '../../../../generated/prisma/client'

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  constructor(readonly env: EnvService) {
    const connectionString = env.get('DATABASE_URL')

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
