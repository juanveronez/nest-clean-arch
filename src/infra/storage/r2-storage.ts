import { randomUUID } from 'node:crypto'
import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3'
import { Injectable } from '@nestjs/common'
import {
  Uploader,
  UploadParams,
} from '@/domain/forum/application/storage/uploader'
import { EnvService } from '../env/env.service'

@Injectable()
export class R2Storage implements Uploader {
  private client: S3Client

  constructor(readonly env: EnvService) {
    this.client = new S3Client({
      endpoint: `https://${env.get('CLOUDFLARE_ACCOUNT_ID')}.r2.cloudflarestorage.com`,
      region: 'auto',
      credentials: {
        accessKeyId: env.get('AWS_ACCESS_KEY_ID'),
        secretAccessKey: env.get('AWS_SECRET_ACCESS_KEY'),
      },
    })
  }

  async upload({
    fileName,
    fileType,
    body,
  }: UploadParams): Promise<{ url: string }> {
    const uploadId = randomUUID()
    const uniqueFileName = `${uploadId}-${fileName}`

    await this.client.send(
      new PutObjectCommand({
        Bucket: this.env.get('AWS_BUCKET_NAME'),
        Key: uniqueFileName,
        ContentType: fileType,
        Body: body,
      }),
    )

    return {
      url: uniqueFileName,
    }
  }
}
