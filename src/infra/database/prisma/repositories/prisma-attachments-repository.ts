import { AttachmentsRepository } from '@/domain/forum/application/repository/attachments-repository'
import { Attachment } from '@/domain/forum/enterprice/entities/attachment'

export class PrismaAttachmentsRepository extends AttachmentsRepository {
  create(attachment: Attachment): Promise<void> {
    throw new Error('Method not implemented.')
  }
}
