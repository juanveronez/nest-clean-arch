import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { AuthModule } from './auth/auth.module'
import { envSchema } from './env/env'
import { EventsModule } from './events/events.module'
import { HttpModule } from './http/http.module'

@Module({
  imports: [
    ConfigModule.forRoot({
      validate: envSchema.parse,
      isGlobal: true,
    }),
    AuthModule,
    HttpModule,
    EventsModule,
  ],
})
export class AppModule {}
