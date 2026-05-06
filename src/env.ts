import { config } from 'dotenv'
import z from 'zod'

config({ path: '.env.development' })

export const envSchema = z.object({
  DATABASE_URL: z.url().startsWith('postgres://'),
  PORT: z.coerce.number().optional().default(3333),
})

export type Env = z.infer<typeof envSchema>
