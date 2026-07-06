import z from 'zod'

export const envSchema = z.object({
  DATABASE_URL: z.url().startsWith('postgres://'),
  PORT: z.coerce.number().optional().default(3333),
  JWT_PRIVATE_KEY: z.string().min(1),
  JWT_PUBLIC_KEY: z.string().min(1),
  CLOUDFLARE_ACCOUNT_ID: z.string().min(1),
  AWS_BUCKET_NAME: z.string().min(1),
  AWS_ACCESS_KEY_ID: z.string().min(1),
  AWS_SECRET_ACCESS_KEY: z.string().min(1),
})

export type Env = z.infer<typeof envSchema>
