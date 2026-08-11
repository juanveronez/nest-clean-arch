import {
  DEFAULT_PAGE_SIZE,
  PaginationParams,
} from '@/core/repositories/pagination-params'
import { AnswerComment } from '@/domain/forum/enterprice/entities/answer-comment'
import { CommentWithAuthor } from '@/domain/forum/enterprice/entities/value-objects/comment-with-author'
import { AnswerCommentsRepository } from './../../domain/forum/application/repository/answer-comments-repository'
import { InMemoryStudentsRepository } from './in-memory-students-repository'

export class InMemoryAnswerCommentsRepository
  implements AnswerCommentsRepository
{
  public items: AnswerComment[] = []

  constructor(private studentsRepository: InMemoryStudentsRepository) {}

  async create(answerComment: AnswerComment): Promise<void> {
    this.items.push(answerComment)
  }

  async findById(id: string): Promise<AnswerComment | null> {
    const answerComment = this.items.find((item) => item.id.toString() === id)
    return answerComment ?? null
  }

  async findManyByAnswerId(
    answerId: string,
    { page }: PaginationParams,
  ): Promise<AnswerComment[]> {
    return this.items
      .filter((item) => item.answerId.toString() === answerId)
      .slice((page - 1) * DEFAULT_PAGE_SIZE, page * DEFAULT_PAGE_SIZE)
  }

  async findManyWithAuthorByAnswerId(
    answerId: string,
    { page }: PaginationParams,
  ): Promise<CommentWithAuthor[]> {
    return this.items
      .filter((item) => item.answerId.toString() === answerId)
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
          commentId: comment.id,
          content: comment.content,
          createdAt: comment.createdAt,
          updatedAt: comment.updatedAt,
          author: author.name,
          authorId: author.id,
        })
      })
  }

  async delete(answerComment: AnswerComment): Promise<void> {
    const itemIndex = this.items.indexOf(answerComment)
    if (itemIndex > -1) this.items.splice(itemIndex, 1)
  }
}
