import {
  BadRequestException,
  Controller,
  Delete,
  HttpCode,
  Param,
} from '@nestjs/common'
import { DeleteAnswerCommentUseCase } from '@/domain/forum/application/use-cases/delete-answer-comment'
import { CurrentUser } from '@/infra/auth/current-user.decorator'
import type { UserPayload } from '@/infra/auth/jwt.strategy'

@Controller('/answers/comments/:id')
export class DeleteAnswerCommentController {
  constructor(private deleteAnswerCommentUseCase: DeleteAnswerCommentUseCase) {}

  @Delete()
  @HttpCode(204)
  async handle(
    @Param('id') answerCommentId: string,
    @CurrentUser() user: UserPayload,
  ) {
    try {
      const result = await this.deleteAnswerCommentUseCase.execute({
        answerCommentId,
        authorId: user.sub,
      })

      if (result.isLeft()) {
        throw new BadRequestException()
      }
    } catch (e) {
      console.log(e)
    }
  }
}
