import { UniqueEntityId } from '@/core/entities/value-objects/unique-entity-id'
import { AnswerAttachment } from '@/domain/forum/enterprice/entities/answer-attachment'
import { Attachment as PrismaAttachment } from '../../../../../generated/prisma/client'

export class PrismaAnswerAttachmentMapper {
  static toDomain(raw: PrismaAttachment): AnswerAttachment {
    if (!raw.answerId) throw new Error('Invalid attachment type.')

    return AnswerAttachment.create(
      {
        answerId: new UniqueEntityId(raw.answerId),
        attachmentId: new UniqueEntityId(raw.id),
      },
      new UniqueEntityId(raw.id),
    )
  }
}
