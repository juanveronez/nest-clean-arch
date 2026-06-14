import { UniqueEntityId } from '@/core/entities/value-objects/unique-entity-id'
import { QuestionAttachment } from '@/domain/forum/enterprice/entities/question-attachment'
import { Attachment as PrismaAttachment } from '../../../../../generated/prisma/client'

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
}
