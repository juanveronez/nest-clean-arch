import { execSync } from 'node:child_process'
import { randomUUID } from 'node:crypto'
import { PrismaPg } from '@prisma/adapter-pg'
import { config } from 'dotenv'
import Redis from 'ioredis'
import { envSchema } from '@/infra/env/env'
import { PrismaClient } from '../../generated/prisma/client'

config({ path: ['.env', '.env.test'], override: true })
const env = envSchema.parse(process.env)

function generateUniqueDatabaseUrl(schemaId: string) {
  if (!env.DATABASE_URL) {
    throw new Error('Please provide a DATABASE_URL enviroment variable.')
  }

  const url = new URL(env.DATABASE_URL)

  url.searchParams.set('schema', schemaId)

  return url.toString()
}

const schemaId = randomUUID()

const connectionString = generateUniqueDatabaseUrl(schemaId)
process.env.DATABASE_URL = connectionString

const prisma = new PrismaClient({ adapter: new PrismaPg({ connectionString }) })
const redis = new Redis({
  db: env.REDIS_DB,
  host: env.REDIS_HOST,
  port: env.REDIS_PORT,
})

beforeAll(() => execSync('pnpm prisma migrate deploy'))

afterAll(async () => {
  await prisma.$queryRawUnsafe(`DROP SCHEMA IF EXISTS "${schemaId}" CASCADE`)
  await redis.flushdb()

  await prisma.$disconnect()
  await redis.quit()
})
