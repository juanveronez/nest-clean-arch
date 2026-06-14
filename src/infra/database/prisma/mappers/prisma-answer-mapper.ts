import { UniqueEntityId } from '@/core/entities/value-objects/unique-entity-id'
import { Answer } from '@/domain/forum/enterprice/entities/answer'
import { Answer as PrismaAnswer } from '../../../../../generated/prisma/client'
import { AnswerUncheckedCreateInput } from '../../../../../generated/prisma/models'

export class PrismaAnswerMapper {
  static toDomain(raw: PrismaAnswer): Answer {
    return Answer.create(
      {
        authorId: new UniqueEntityId(raw.authorId),
        questionId: new UniqueEntityId(raw.questionId),
        content: raw.content,
        createdAt: raw.createdAt,
        updatedAt: raw.updatedAt,
      },
      new UniqueEntityId(raw.id),
    )
  }

  static toPersistence(answer: Answer): AnswerUncheckedCreateInput {
    return {
      id: answer.id.toString(),
      authorId: answer.authorId.toString(),
      questionId: answer.questionId.toString(),
      content: answer.content,
      createdAt: answer.createdAt,
      updatedAt: answer.updatedAt,
    }
  }
}
