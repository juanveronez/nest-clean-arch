import { PaginationParams } from '@/core/repositories/pagination-params'
import { QuestionComment } from '../../enterprice/entities/question-comment'
import { CommentWithAuthor } from '../../enterprice/entities/value-objects/comment-with-author'

export abstract class QuestionCommentsRepository {
  abstract create(questionComment: QuestionComment): Promise<void>
  abstract findById(id: string): Promise<QuestionComment | null>
  abstract findManyByQuestionId(
    questionId: string,
    params: PaginationParams,
  ): Promise<QuestionComment[]>
  abstract findManyWithAuthorByQuestionId(
    questionId: string,
    params: PaginationParams,
  ): Promise<CommentWithAuthor[]>
  abstract delete(questionComment: QuestionComment): Promise<void>
}
