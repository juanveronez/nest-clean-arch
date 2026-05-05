import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common'
import { PrismaPg } from '@prisma/adapter-pg'
import { config } from 'dotenv'

import { PrismaClient } from '../../generated/prisma/client'

config({ path: '.env.development' })

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  constructor() {
    const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL })
    super({ adapter })
  }

  async onModuleInit() {
    return await this.$connect()
  }

  async onModuleDestroy() {
    return await this.$disconnect()
  }
}
