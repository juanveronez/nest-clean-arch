import { execSync } from 'node:child_process'
import { randomUUID } from 'node:crypto'
import { PrismaPg } from '@prisma/adapter-pg'
import { config } from 'dotenv'
import { PrismaClient } from '../generated/prisma/client'

config({ path: '.env.development' })

function generateUniqueDatabaseUrl(schemaId: string) {
  if (!process.env.DATABASE_URL) {
    throw new Error('Please provide a DATABASE_URL enviroment variable.')
  }

  const url = new URL(process.env.DATABASE_URL)

  url.searchParams.set('schema', schemaId)

  return url.toString()
}

const schemaId = randomUUID()

const connectionString = generateUniqueDatabaseUrl(schemaId)
process.env.DATABASE_URL = connectionString

const prisma = new PrismaClient({ adapter: new PrismaPg({ connectionString }) })

beforeAll(() => execSync('pnpm prisma migrate deploy'))

afterAll(async () => {
  await prisma.$queryRawUnsafe(`DROP SCHEMA IF EXISTS "${schemaId}" CASCADE`)
  await prisma.$disconnect()
})
