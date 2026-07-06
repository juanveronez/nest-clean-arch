import { Module } from '@nestjs/common'
import { Uploader } from '@/domain/forum/application/storage/uploader'
import { EnvService } from '../env/env.service'
import { R2Storage } from './r2-storage'

@Module({
  providers: [EnvService, { provide: Uploader, useClass: R2Storage }],
  exports: [Uploader],
})
export class StorageModule {}
