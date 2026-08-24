import { Injectable } from '@nestjs/common'
import { DomainEvents } from '@/core/events/domain-events'
import { PaginationParams } from '@/core/repositories/pagination-params'
import { QuestionAttachmentsRepository } from '@/domain/forum/application/repository/question-attachments-repository'
import { QuestionsRepository } from '@/domain/forum/application/repository/questions-repository'
import { Question } from '@/domain/forum/enterprice/entities/question'
import { QuestionDetails } from '@/domain/forum/enterprice/entities/value-objects/question-details'
import { CacheRepository } from '@/infra/cache/cache-repository'
import { PrismaQuestionDetailsMapper } from '../mappers/prisma-question-details-mapper'
import { PrismaQuestionMapper } from '../mappers/prisma-question-mapper'
import { PrismaService } from '../prisma.service'

@Injectable()
export class PrismaQuestionsRepository implements QuestionsRepository {
  constructor(
    private prisma: PrismaService,
    private cache: CacheRepository,
    private questionAttachmentsRepository: QuestionAttachmentsRepository,
  ) {}
  async create(question: Question): Promise<void> {
    const data = PrismaQuestionMapper.toPersistence(question)

    await this.prisma.question.create({ data })

    await this.questionAttachmentsRepository.createMany(
      question.attachments.getItems(),
    )

    DomainEvents.dispatchEventsForAggregate(question.id)
  }

  async save(question: Question): Promise<void> {
    const data = PrismaQuestionMapper.toPersistence(question)

    await Promise.all([
      this.prisma.question.update({ data, where: { id: data.id } }),
      this.questionAttachmentsRepository.createMany(
        question.attachments.getNewItems(),
      ),
      this.questionAttachmentsRepository.deleteMany(
        question.attachments.getRemovedItems(),
      ),
    ])

    await this.cache.delete(`question:${data.slug}:details`)

    DomainEvents.dispatchEventsForAggregate(question.id)
  }

  async findById(id: string): Promise<Question | null> {
    const question = await this.prisma.question.findUnique({ where: { id } })

    if (!question) return null

    return PrismaQuestionMapper.toDomain(question)
  }

  async findBySlug(slug: string): Promise<Question | null> {
    const question = await this.prisma.question.findUnique({ where: { slug } })

    if (!question) return null

    return PrismaQuestionMapper.toDomain(question)
  }

  async findDetailsBySlug(slug: string): Promise<QuestionDetails | null> {
    const cacheHit = await this.cache.get(`question:${slug}:details`)
    if (cacheHit)
      return PrismaQuestionDetailsMapper.toDomain(JSON.parse(cacheHit))

    const question = await this.prisma.question.findUnique({
      include: { author: true, attachments: true },
      where: { slug },
    })

    if (!question) return null

    await this.cache.set(`question:${slug}:details`, JSON.stringify(question))

    return PrismaQuestionDetailsMapper.toDomain(question)
  }

  async findManyRecent({ page }: PaginationParams): Promise<Question[]> {
    const questions = await this.prisma.question.findMany({
      orderBy: { createdAt: 'desc' },
      skip: (page - 1) * 20,
      take: 20,
    })

    return questions.map(PrismaQuestionMapper.toDomain)
  }

  async delete(question: Question): Promise<void> {
    const { id } = PrismaQuestionMapper.toPersistence(question)

    await this.prisma.question.delete({ where: { id } })
  }
}
