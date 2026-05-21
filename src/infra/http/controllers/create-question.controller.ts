import { Body, Controller, Post, UseGuards } from '@nestjs/common'
import z from 'zod'
import { CurrentUser } from '../../auth/current-user.decorator'
import type { UserPayload } from '../../auth/jwt.strategy'
import { JwtAuthGuard } from '../../auth/jwt-auth.guard'
import { PrismaService } from '../../database/prisma/prisma.service'
import { ZodValidationPipe } from '../pipes/zod-validation.pipe'

const createQuestionBodySchema = z.object({
  title: z.string(),
  content: z.string(),
})

type CreateQuestionBody = z.infer<typeof createQuestionBodySchema>

const bodyValidationPipe = new ZodValidationPipe(createQuestionBodySchema)

@Controller('/questions')
@UseGuards(JwtAuthGuard)
export class CreateQuestionController {
  constructor(private prisma: PrismaService) {}

  @Post()
  async handle(
    @CurrentUser() user: UserPayload,
    // Body can accept pipes to validate content directly
    @Body(bodyValidationPipe) body: CreateQuestionBody,
  ) {
    const { title, content } = body

    await this.prisma.question.create({
      data: {
        title,
        content,
        authorId: user.sub,
        slug: title,
      },
    })
  }
}
