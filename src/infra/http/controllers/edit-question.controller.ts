import {
  BadRequestException,
  Body,
  Controller,
  HttpCode,
  Param,
  Put,
} from '@nestjs/common'
import z from 'zod'
import { EditQuestionUseCase } from '@/domain/forum/application/use-cases/edit-question'
import { CurrentUser } from '@/infra/auth/current-user.decorator'
import type { UserPayload } from '@/infra/auth/jwt.strategy'
import { ZodValidationPipe } from '../pipes/zod-validation.pipe'

const editQuestionValidationSchema = z.object({
  title: z.string(),
  content: z.string(),
})

type EditQuestionBody = z.infer<typeof editQuestionValidationSchema>

const editQuestionValidationPipe = new ZodValidationPipe(
  editQuestionValidationSchema,
)

@Controller('/questions/:id')
export class EditQuestionController {
  constructor(private editQuestionUseCase: EditQuestionUseCase) {}

  @Put()
  @HttpCode(204)
  async handle(
    @CurrentUser() user: UserPayload,
    @Param('id') questionId: string,
    @Body(editQuestionValidationPipe) body: EditQuestionBody,
  ) {
    const { title, content } = body

    const result = await this.editQuestionUseCase.execute({
      authorId: user.sub,
      questionId,
      title,
      content,
      attachmentsIds: [],
    })

    if (result.isLeft()) {
      throw new BadRequestException()
    }
  }
}
