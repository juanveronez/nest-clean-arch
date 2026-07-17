import { Injectable } from '@nestjs/common'
import { UniqueEntityId } from '@/core/entities/value-objects/unique-entity-id'
import {
  QuestionAttachment,
  QuestionAttachmentProps,
} from '@/domain/forum/enterprice/entities/question-attachment'
import { PrismaQuestionAttachmentMapper } from '@/infra/database/prisma/mappers/prisma-question-attachment-mapper'
import { PrismaService } from '@/infra/database/prisma/prisma.service'

/**
 * Use Factory Pattern to create a question object.
 * By default object properties are generated with faker, to avoid objects with the same values.
 *
 * @param override optional object properties to override the default values
 * @param id optional unique entity id to create an object with a specific id
 * @returns a question object
 */
export function makeQuestionAttachment(
  override: Partial<QuestionAttachmentProps> = {},
  id?: UniqueEntityId,
) {
  return QuestionAttachment.create(
    {
      attachmentId: new UniqueEntityId(),
      questionId: new UniqueEntityId(),
      ...override,
    },
    id,
  )
}

@Injectable()
export class QuestionAttachmentFactory {
  constructor(private prisma: PrismaService) {}

  async make(
    data: Partial<QuestionAttachmentProps> = {},
  ): Promise<QuestionAttachment> {
    const questionAttachment = makeQuestionAttachment(data)

    await this.prisma.attachment.update(
      PrismaQuestionAttachmentMapper.toPersistenceUpdate(questionAttachment),
    )

    return questionAttachment
  }
}
