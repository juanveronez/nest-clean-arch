import {
  BadRequestException,
  Controller,
  Delete,
  HttpCode,
  Param,
} from '@nestjs/common'
import { DeleteQuestionUseCase } from '@/domain/forum/application/use-cases/delete-question'
import { CurrentUser } from '@/infra/auth/current-user.decorator'
import type { UserPayload } from '@/infra/auth/jwt.strategy'

@Controller('/questions/:id')
export class DeleteQuestionController {
  constructor(private deleteQuestionUseCase: DeleteQuestionUseCase) {}

  @Delete()
  @HttpCode(204)
  async handle(
    @CurrentUser() user: UserPayload,
    @Param('id') questionId: string,
  ) {
    const response = await this.deleteQuestionUseCase.execute({
      questionId,
      authorId: user.sub,
    })

    if (response.isLeft()) {
      throw new BadRequestException()
    }
  }
}
