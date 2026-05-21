import { UniqueEntityId } from '@/core/entities/value-objects/unique-entity-id'
import { Question } from '@/domain/forum/enterprice/entities/question'
import { Slug } from '@/domain/forum/enterprice/entities/value-objects/slug'
import { Question as PrismaQuestion } from '../../../../../generated/prisma/client'
import { QuestionUncheckedCreateInput } from '../../../../../generated/prisma/models'

export class PrismaQuestionMapper {
  static toDomain(raw: PrismaQuestion): Question {
    return Question.create(
      {
        slug: Slug.create(raw.slug),
        authorId: new UniqueEntityId(raw.authorId),
        title: raw.title,
        content: raw.content,
        bestAnswerId: raw.bestAnswerId
          ? new UniqueEntityId(raw.bestAnswerId)
          : undefined,

        createdAt: raw.createdAt,
        updatedAt: raw.updatedAt,
      },
      new UniqueEntityId(raw.id),
    )
  }

  static toPersistence(question: Question): QuestionUncheckedCreateInput {
    return {
      id: question.id.toString(),
      authorId: question.authorId.toString(),
      bestAnswerId: question.bestAnswerId?.toString(),
      title: question.title,
      content: question.content,
      slug: question.slug.value,
      createdAt: question.createdAt,
      updatedAt: question.updatedAt,
    }
  }
}
