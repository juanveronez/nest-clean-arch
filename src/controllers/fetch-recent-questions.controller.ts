import { Controller, Get, Query, UseGuards } from '@nestjs/common'
import z from 'zod'
import { JwtAuthGuard } from '../auth/jwt-auth.guard'
import { ZodValidationPipe } from '../pipes/zod-validation.pipe'
import { PrismaService } from '../prisma/prisma.service'

const pageQueryParamSchema = z
  .string()
  .optional()
  .default('1')
  .transform(Number)
  .pipe(z.number().min(1))

type PageQueryParam = z.infer<typeof pageQueryParamSchema>

const pageQueryParamValidationPipe = new ZodValidationPipe(pageQueryParamSchema)

@Controller('/questions')
@UseGuards(JwtAuthGuard)
export class FetchRecentQuestions {
  constructor(private prisma: PrismaService) {}

  @Get()
  async handle(
    @Query('page', pageQueryParamValidationPipe) page: PageQueryParam,
  ) {
    const perPage = 20
    const questions = await this.prisma.question.findMany({
      orderBy: { createdAt: 'desc' },
      skip: (page - 1) * perPage,
      take: perPage,
    })
    return { questions }
  }
}
