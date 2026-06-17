import {
  BadRequestException,
  Controller,
  Delete,
  HttpCode,
  Param,
} from '@nestjs/common'
import { DeleteQuestionCommentUseCase } from '@/domain/forum/application/use-cases/delete-question-comment'
import { CurrentUser } from '@/infra/auth/current-user.decorator'
import type { UserPayload } from '@/infra/auth/jwt.strategy'

@Controller('/questions/comments/:id')
export class DeleteQuestionCommentController {
  constructor(
    private deleteQuestionCommentUseCase: DeleteQuestionCommentUseCase,
  ) {}

  @Delete()
  @HttpCode(204)
  async handle(
    @Param('id') questionCommentId: string,
    @CurrentUser() user: UserPayload,
  ) {
    try {
      const result = await this.deleteQuestionCommentUseCase.execute({
        questionCommentId,
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
