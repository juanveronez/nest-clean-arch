import { Module } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { APP_GUARD } from '@nestjs/core'
import { JwtModule } from '@nestjs/jwt'
import { PassportModule } from '@nestjs/passport'
import { Env } from '../env'
import { JwtStrategy } from './jwt.strategy'
import { JwtAuthGuard } from './jwt-auth.guard'

@Module({
  imports: [
    PassportModule,
    JwtModule.registerAsync({
      global: true,
      inject: [ConfigService],
      useFactory: (config: ConfigService<Env, true>) => {
        const base64PrivateKey = config.get('JWT_PRIVATE_KEY', { infer: true })
        const privateKey = Buffer.from(base64PrivateKey, 'base64')

        const base64PublicKey = config.get('JWT_PUBLIC_KEY', { infer: true })
        const publicKey = Buffer.from(base64PublicKey, 'base64')

        return { signOptions: { algorithm: 'RS256' }, privateKey, publicKey }
      },
    }),
  ],
  providers: [
    JwtStrategy,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
})
export class AuthModule {}
