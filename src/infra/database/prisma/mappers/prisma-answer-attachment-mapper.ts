import { UniqueEntityId } from '@/core/entities/value-objects/unique-entity-id'
import { AnswerAttachment } from '@/domain/forum/enterprice/entities/answer-attachment'
import {
  Prisma,
  Attachment as PrismaAttachment,
} from '../../../../../generated/prisma/client'

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

  static toPersistenceUpdateMany(
    attachments: AnswerAttachment[],
  ): Prisma.AttachmentUpdateManyArgs {
    const attachmentIds = attachments.map((att) => att.attachmentId.toString())

    return {
      where: { id: { in: attachmentIds } },
      data: { answerId: attachments[0].answerId.toString() },
    }
  }

  static toPersistenceUpdate(
    attachment: AnswerAttachment,
  ): Prisma.AttachmentUpdateArgs {
    const attachmentId = attachment.attachmentId.toString()

    return {
      where: { id: attachmentId },
      data: { answerId: attachment.answerId.toString() },
    }
  }
}
