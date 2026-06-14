import { faker } from '@faker-js/faker'
import { Injectable } from '@nestjs/common'
import { UniqueEntityId } from '@/core/entities/value-objects/unique-entity-id'
import {
  AnswerComment,
  AnswerCommentProps,
} from '@/domain/forum/enterprice/entities/answer-comment'
import { PrismaAnswerCommentMapper } from '@/infra/database/prisma/mappers/prisma-answer-comment-mapper'
import { PrismaService } from '@/infra/database/prisma/prisma.service'

/**
 * Use Factory Pattern to create a answer object.
 * By default object properties are generated with faker, to avoid objects with the same values.
 *
 * @param override optional object properties to override the default values
 * @param id optional unique entity id to create an object with a specific id
 * @returns a answer object
 */
export function makeAnswerComment(
  override: Partial<AnswerCommentProps> = {},
  id?: UniqueEntityId,
): AnswerComment {
  return AnswerComment.create(
    {
      content: faker.lorem.text(),
      authorId: new UniqueEntityId(),
      answerId: new UniqueEntityId(),
      ...override,
    },
    id,
  )
}

@Injectable()
export class AnswerCommentFactory {
  constructor(private prisma: PrismaService) {}

  async makePrismaAnswerComment(
    data: Partial<AnswerCommentProps> = {},
  ): Promise<AnswerComment> {
    const answerComment = makeAnswerComment(data)

    await this.prisma.comment.create({
      data: PrismaAnswerCommentMapper.toPersistence(answerComment),
    })

    return answerComment
  }
}
