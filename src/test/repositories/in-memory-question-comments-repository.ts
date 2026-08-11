import {
  DEFAULT_PAGE_SIZE,
  PaginationParams,
} from '@/core/repositories/pagination-params'
import { QuestionComment } from '@/domain/forum/enterprice/entities/question-comment'
import { CommentWithAuthor } from '@/domain/forum/enterprice/entities/value-objects/comment-with-author'
import { QuestionCommentsRepository } from './../../domain/forum/application/repository/question-comments-repository'
import { InMemoryStudentsRepository } from './in-memory-students-repository'

export class InMemoryQuestionCommentsRepository
  implements QuestionCommentsRepository
{
  public items: QuestionComment[] = []

  constructor(private studentsRepository: InMemoryStudentsRepository) {}

  async create(questionComment: QuestionComment): Promise<void> {
    this.items.push(questionComment)
  }

  async findById(id: string): Promise<QuestionComment | null> {
    const questionComment = this.items.find((item) => item.id.toString() === id)
    return questionComment ?? null
  }

  async findManyByQuestionId(
    questionId: string,
    { page }: PaginationParams,
  ): Promise<QuestionComment[]> {
    return this.items
      .filter((item) => item.questionId.toString() === questionId)
      .slice((page - 1) * DEFAULT_PAGE_SIZE, page * DEFAULT_PAGE_SIZE)
  }

  async findManyWithAuthorByQuestionId(
    questionId: string,
    { page }: PaginationParams,
  ): Promise<CommentWithAuthor[]> {
    return this.items
      .filter((item) => item.questionId.toString() === questionId)
      .slice((page - 1) * DEFAULT_PAGE_SIZE, page * DEFAULT_PAGE_SIZE)
      .map((comment) => {
        const author = this.studentsRepository.items.find((student) =>
          student.id.equals(comment.authorId),
        )

        if (!author)
          throw new Error(
            `Author with ID "${comment.authorId.toString()}" does not exist.`,
          )

        return CommentWithAuthor.create({
          content: comment.content,
          commentId: comment.id,
          createdAt: comment.createdAt,
          updatedAt: comment.updatedAt,
          authorId: author.id,
          author: author.name,
        })
      })
  }

  async delete(questionComment: QuestionComment): Promise<void> {
    const itemIndex = this.items.indexOf(questionComment)
    if (itemIndex > -1) this.items.splice(itemIndex, 1)
  }
}
