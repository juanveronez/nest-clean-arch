import { Injectable } from '@nestjs/common'
import { PaginationParams } from '@/core/repositories/pagination-params'
import { AnswerCommentsRepository } from '@/domain/forum/application/repository/answer-comments-repository'
import { AnswerComment } from '@/domain/forum/enterprice/entities/answer-comment'
import { CommentWithAuthor } from '@/domain/forum/enterprice/entities/value-objects/comment-with-author'
import { PrismaAnswerCommentMapper } from '../mappers/prisma-answer-comment-mapper'
import { PrismaCommentWithAuthorMapper } from '../mappers/prisma-comment-with-author-mapper'
import { PrismaService } from '../prisma.service'

@Injectable()
export class PrismaAnswerCommentsRepository
  implements AnswerCommentsRepository
{
  constructor(private prisma: PrismaService) {}

  async create(answerComment: AnswerComment): Promise<void> {
    const data = PrismaAnswerCommentMapper.toPersistence(answerComment)

    await this.prisma.comment.create({ data })
  }

  async findById(id: string): Promise<AnswerComment | null> {
    const comment = await this.prisma.comment.findUnique({ where: { id } })

    if (!comment) return null

    return PrismaAnswerCommentMapper.toDomain(comment)
  }

  async findManyByAnswerId(
    answerId: string,
    { page }: PaginationParams,
  ): Promise<AnswerComment[]> {
    const comments = await this.prisma.comment.findMany({
      where: { answerId },
      orderBy: { createdAt: 'desc' },
      skip: (page - 1) * 20,
      take: 20,
    })

    return comments.map(PrismaAnswerCommentMapper.toDomain)
  }

  async findManyWithAuthorByAnswerId(
    answerId: string,
    { page }: PaginationParams,
  ): Promise<CommentWithAuthor[]> {
    const comments = await this.prisma.comment.findMany({
      where: { answerId },
      include: { author: { select: { name: true } } },
      orderBy: { createdAt: 'desc' },
      skip: (page - 1) * 20,
      take: 20,
    })

    return comments.map(PrismaCommentWithAuthorMapper.toDomain)
  }

  async delete(answerComment: AnswerComment): Promise<void> {
    const { id } = PrismaAnswerCommentMapper.toPersistence(answerComment)

    await this.prisma.comment.delete({ where: { id } })
  }
}
