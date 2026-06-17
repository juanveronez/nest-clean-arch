import {
  BadRequestException,
  Controller,
  Get,
  Param,
  Query,
} from '@nestjs/common'
import z from 'zod'
import { FetchQuestionAnswersUseCase } from '@/domain/forum/application/use-cases/fetch-question-answers'
import { ZodValidationPipe } from '../pipes/zod-validation.pipe'
import { AnswerPresenter } from '../presenters/answer-presenter'

const pageQueryParamSchema = z.coerce
  .number()
  .optional()
  .default(1)
  .pipe(z.number().min(1))

type PageQueryParam = z.infer<typeof pageQueryParamSchema>

const pageQueryParamPipe = new ZodValidationPipe(pageQueryParamSchema)

@Controller('/questions/:questionId/answers')
export class FetchQuestionAnswersController {
  constructor(
    private fetchQuestionAnswersUseCase: FetchQuestionAnswersUseCase,
  ) {}

  @Get()
  async handle(
    @Param('questionId') questionId: string,
    @Query('page', pageQueryParamPipe) page: PageQueryParam,
  ) {
    const result = await this.fetchQuestionAnswersUseCase.execute({
      questionId,
      page,
    })

    if (result.isLeft()) {
      throw new BadRequestException()
    }

    const { answers } = result.value

    return {
      answers: answers.map(AnswerPresenter.toHTTP),
    }
  }
}
