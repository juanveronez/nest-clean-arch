import {
  BadRequestException,
  Body,
  Controller,
  Param,
  Post,
} from '@nestjs/common'
import z from 'zod'
import { AnswerQuestionUseCase } from '@/domain/forum/application/use-cases/answer-question'
import { CurrentUser } from '@/infra/auth/current-user.decorator'
import type { UserPayload } from '@/infra/auth/jwt.strategy'
import { ZodValidationPipe } from '../pipes/zod-validation.pipe'

const answerQuestionBodySchema = z.object({
  content: z.string(),
})

type AnswerQuestionBody = z.infer<typeof answerQuestionBodySchema>

const bodyValidationPipe = new ZodValidationPipe(answerQuestionBodySchema)

@Controller('/questions/:questionId/answers')
export class AnswerQuestionController {
  constructor(private answerQuestionUseCase: AnswerQuestionUseCase) {}

  @Post()
  async handle(
    @Param('questionId') questionId: string,
    @Body(bodyValidationPipe) body: AnswerQuestionBody,
    @CurrentUser() user: UserPayload,
  ) {
    const { content } = body

    const result = await this.answerQuestionUseCase.execute({
      authorId: user.sub,
      questionId,
      attachmentsIds: [],
      content,
    })

    if (result.isLeft()) {
      throw new BadRequestException()
    }
  }
}
