import { Attachment } from '@/domain/forum/enterprice/entities/attachment'
import { Attachment as PrismaAttachment } from '../../../../../generated/prisma/client'

export class PrismaAttachmentMapper {
  static toDomain(raw: PrismaAttachment): Attachment {
    return Attachment.create({
      title: raw.title,
      url: raw.url,
    })
  }

  static toPersistence(attachment: Attachment): PrismaAttachment {
    return {
      title: attachment.title,
      url: attachment.url,
      id: attachment.id.toString(),
      answerId: null,
      questionId: null,
    }
  }
}
