import {
  BadRequestException,
  Controller,
  Get,
  Param,
  Query,
} from '@nestjs/common'
import z from 'zod'
import { FetchQuestionCommentsUseCase } from '@/domain/forum/application/use-cases/fetch-question-comments'
import { ZodValidationPipe } from '../pipes/zod-validation.pipe'
import { QuestionCommentPresenter } from '../presenters/question-comment-presenter'

const pageQueryParamSchema = z.coerce
  .number()
  .optional()
  .default(1)
  .pipe(z.number().min(1))

type PageQueryParam = z.infer<typeof pageQueryParamSchema>

const pageQueryParamPipe = new ZodValidationPipe(pageQueryParamSchema)

@Controller('/questions/:questionId/comments')
export class FetchQuestionCommentsController {
  constructor(
    private fetchQuestionCommentsUseCase: FetchQuestionCommentsUseCase,
  ) {}

  @Get()
  async handle(
    @Param('questionId') questionId: string,
    @Query('page', pageQueryParamPipe) page: PageQueryParam,
  ) {
    const result = await this.fetchQuestionCommentsUseCase.execute({
      questionId,
      page,
    })

    if (result.isLeft()) {
      throw new BadRequestException()
    }

    const { questionComments } = result.value

    return {
      comments: questionComments.map(QuestionCommentPresenter.toHTTP),
    }
  }
}
