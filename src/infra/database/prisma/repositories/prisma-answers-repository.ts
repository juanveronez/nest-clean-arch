import { Injectable } from '@nestjs/common'
import { PaginationParams } from '@/core/repositories/pagination-params'
import { AnswerAttachmentsRepository } from '@/domain/forum/application/repository/answer-attachments-repository'
import { AnswersRepository } from '@/domain/forum/application/repository/answers-repository'
import { Answer } from '@/domain/forum/enterprice/entities/answer'
import { PrismaAnswerMapper } from '../mappers/prisma-answer-mapper'
import { PrismaService } from '../prisma.service'

@Injectable()
export class PrismaAnswersRepository implements AnswersRepository {
  constructor(
    private prisma: PrismaService,
    private answerAttachmentsReporitory: AnswerAttachmentsRepository,
  ) {}

  async create(answer: Answer): Promise<void> {
    const data = PrismaAnswerMapper.toPersistence(answer)

    await this.prisma.answer.create({ data })

    await this.answerAttachmentsReporitory.createMany(
      answer.attachments.getItems(),
    )
  }

  async save(answer: Answer): Promise<void> {
    const data = PrismaAnswerMapper.toPersistence(answer)

    await Promise.all([
      this.prisma.answer.update({ data, where: { id: data.id } }),
      this.answerAttachmentsReporitory.createMany(
        answer.attachments.getNewItems(),
      ),
      this.answerAttachmentsReporitory.deleteMany(
        answer.attachments.getRemovedItems(),
      ),
    ])
  }

  async findById(id: string): Promise<Answer | null> {
    const answer = await this.prisma.answer.findUnique({ where: { id } })

    if (!answer) return null
    return PrismaAnswerMapper.toDomain(answer)
  }

  async findManyByQuestionId(
    questionId: string,
    { page }: PaginationParams,
  ): Promise<Answer[]> {
    const answers = await this.prisma.answer.findMany({
      where: { questionId },
      orderBy: { createdAt: 'desc' },
      skip: (page - 1) * 20,
      take: 20,
    })

    return answers.map(PrismaAnswerMapper.toDomain)
  }

  async delete(answer: Answer): Promise<void> {
    const { id } = PrismaAnswerMapper.toPersistence(answer)

    await this.prisma.answer.delete({ where: { id } })
  }
}
