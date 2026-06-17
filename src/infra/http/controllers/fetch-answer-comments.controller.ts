import {
  BadRequestException,
  Controller,
  Get,
  Param,
  Query,
} from '@nestjs/common'
import z from 'zod'
import { FetchAnswerCommentsUseCase } from '@/domain/forum/application/use-cases/fetch-answer-comments'
import { ZodValidationPipe } from '../pipes/zod-validation.pipe'
import { AnswerCommentPresenter } from '../presenters/answer-comment-presenter'

const pageQueryParamSchema = z.coerce
  .number()
  .optional()
  .default(1)
  .pipe(z.number().min(1))

type PageQueryParam = z.infer<typeof pageQueryParamSchema>

const pageQueryParamPipe = new ZodValidationPipe(pageQueryParamSchema)

@Controller('/answers/:answerId/comments')
export class FetchAnswerCommentsController {
  constructor(private fetchAnswerCommentsUseCase: FetchAnswerCommentsUseCase) {}

  @Get()
  async handle(
    @Param('answerId') answerId: string,
    @Query('page', pageQueryParamPipe) page: PageQueryParam,
  ) {
    const result = await this.fetchAnswerCommentsUseCase.execute({
      answerId,
      page,
    })

    if (result.isLeft()) {
      throw new BadRequestException()
    }

    const { answerComments } = result.value

    return {
      comments: answerComments.map(AnswerCommentPresenter.toHTTP),
    }
  }
}
