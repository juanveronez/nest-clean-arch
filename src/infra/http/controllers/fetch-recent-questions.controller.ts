import { Controller, Get, Query, UseGuards } from '@nestjs/common'
import z from 'zod'
import { FetchRecentQuestionsUseCase } from '@/domain/forum/application/use-cases/fetch-recent-questions'
import { JwtAuthGuard } from '../../auth/jwt-auth.guard'
import { ZodValidationPipe } from '../pipes/zod-validation.pipe'
import { QuestionPresenter } from '../presenters/question-presenter'

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
  constructor(private fetchRecentQuestions: FetchRecentQuestionsUseCase) {}

  @Get()
  async handle(
    @Query('page', pageQueryParamValidationPipe) page: PageQueryParam,
  ) {
    const result = await this.fetchRecentQuestions.execute({ page })

    if (result.isLeft()) {
      throw new Error()
    }

    const { questions } = result.value

    return {
      questions: questions.map(QuestionPresenter.toHTTP),
    }
  }
}
