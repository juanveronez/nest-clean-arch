import { AttachmentsRepository } from '@/domain/forum/application/repository/attachments-repository'
import { Attachment } from '@/domain/forum/enterprice/entities/attachment'

export class InMemoryAttachmentsRepository implements AttachmentsRepository {
  items: Attachment[] = []

  async create(attachment: Attachment): Promise<void> {
    this.items.push(attachment)
  }
}
