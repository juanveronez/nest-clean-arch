import { UniqueEntityId } from '@/core/entities/value-objects/unique-entity-id'
import { QuestionAttachment } from '@/domain/forum/enterprice/entities/question-attachment'
import {
  Prisma,
  Attachment as PrismaAttachment,
} from '../../../../../generated/prisma/client'

export class PrismaQuestionAttachmentMapper {
  static toDomain(raw: PrismaAttachment): QuestionAttachment {
    if (!raw.questionId) throw new Error('Invalid attachment type.')

    return QuestionAttachment.create(
      {
        questionId: new UniqueEntityId(raw.questionId),
        attachmentId: new UniqueEntityId(raw.id),
      },
      new UniqueEntityId(raw.id),
    )
  }

  static toPersistenceUpdateMany(
    attachments: QuestionAttachment[],
  ): Prisma.AttachmentUpdateManyArgs {
    const attachmentIds = attachments.map((att) => att.attachmentId.toString())

    return {
      where: { id: { in: attachmentIds } },
      data: { questionId: attachments[0].questionId.toString() },
    }
  }

  static toPersistenceUpdate(
    attachment: QuestionAttachment,
  ): Prisma.AttachmentUpdateArgs {
    const attachmentId = attachment.attachmentId.toString()

    return {
      where: { id: attachmentId },
      data: { questionId: attachment.questionId.toString() },
    }
  }
}
