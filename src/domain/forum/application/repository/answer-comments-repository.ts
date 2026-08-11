import { PaginationParams } from '@/core/repositories/pagination-params'
import { AnswerComment } from '../../enterprice/entities/answer-comment'
import { CommentWithAuthor } from '../../enterprice/entities/value-objects/comment-with-author'

export abstract class AnswerCommentsRepository {
  abstract create(answerComment: AnswerComment): Promise<void>
  abstract findById(id: string): Promise<AnswerComment | null>
  abstract findManyByAnswerId(
    answerId: string,
    params: PaginationParams,
  ): Promise<AnswerComment[]>
  abstract findManyWithAuthorByAnswerId(
    answerId: string,
    params: PaginationParams,
  ): Promise<CommentWithAuthor[]>
  abstract delete(answerComment: AnswerComment): Promise<void>
}
