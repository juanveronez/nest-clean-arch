import { UniqueEntityId } from '@/core/entities/value-objects/unique-entity-id'
import { AnswerComment } from '@/domain/forum/enterprice/entities/answer-comment'
import { Comment as PrismaComment } from '../../../../../generated/prisma/client'
import { CommentUncheckedCreateInput } from '../../../../../generated/prisma/models'

export class PrismaAnswerCommentMapper {
  static toDomain(raw: PrismaComment): AnswerComment {
    if (!raw.answerId) throw new Error('Invalid comment type.')

    return AnswerComment.create(
      {
        authorId: new UniqueEntityId(raw.authorId),
        answerId: new UniqueEntityId(raw.answerId),
        content: raw.content,
        createdAt: raw.createdAt,
        updatedAt: raw.updatedAt,
      },
      new UniqueEntityId(raw.id),
    )
  }

  static toPersistence(
    answerComment: AnswerComment,
  ): CommentUncheckedCreateInput {
    return {
      id: answerComment.id.toString(),
      authorId: answerComment.authorId.toString(),
      answerId: answerComment.answerId.toString(),
      content: answerComment.content,
      createdAt: answerComment.createdAt,
      updatedAt: answerComment.updatedAt,
    }
  }
}
