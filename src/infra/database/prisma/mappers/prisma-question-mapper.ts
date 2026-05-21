import { UniqueEntityId } from '@/core/entities/value-objects/unique-entity-id'
import { Question } from '@/domain/forum/enterprice/entities/question'
import { Slug } from '@/domain/forum/enterprice/entities/value-objects/slug'
import { Question as PrismaQuestion } from '../../../../../generated/prisma/client'

export class PrismaQuestionMapper {
  static toDomain(raw: PrismaQuestion): Question {
    return Question.create(
      {
        slug: Slug.create(raw.slug),
        authorId: new UniqueEntityId(raw.authorId),
        title: raw.title,
        content: raw.content,
        bestAnswerId: undefined,

        createdAt: raw.createdAt,
        updatedAt: raw.updatedAt,
      },
      new UniqueEntityId(raw.id),
    )
  }
}
