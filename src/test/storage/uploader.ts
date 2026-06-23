import { randomUUID } from 'node:crypto'
import {
  Uploader,
  UploadParams,
} from '@/domain/forum/application/storage/uploader'

export class FakeUploader implements Uploader {
  items: Array<{
    fileName: string
    url: string
  }> = []

  async upload({ fileName }: UploadParams): Promise<{ url: string }> {
    const url = randomUUID()
    this.items.push({ fileName, url })

    return { url }
  }
}
