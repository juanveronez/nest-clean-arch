import { Module } from '@nestjs/common'
import { APP_GUARD } from '@nestjs/core'
import { JwtModule } from '@nestjs/jwt'
import { PassportModule } from '@nestjs/passport'
import { EnvService } from '../env/env.service'
import { JwtStrategy } from './jwt.strategy'
import { JwtAuthGuard } from './jwt-auth.guard'

@Module({
  imports: [
    PassportModule,
    JwtModule.registerAsync({
      global: true,
      inject: [EnvService],
      extraProviders: [EnvService],
      useFactory: (env: EnvService) => {
        const base64PrivateKey = env.get('JWT_PRIVATE_KEY')
        const privateKey = Buffer.from(base64PrivateKey, 'base64')

        const base64PublicKey = env.get('JWT_PUBLIC_KEY')
        const publicKey = Buffer.from(base64PublicKey, 'base64')

        return { signOptions: { algorithm: 'RS256' }, privateKey, publicKey }
      },
    }),
  ],
  providers: [
    EnvService,
    JwtStrategy,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
})
export class AuthModule {}
