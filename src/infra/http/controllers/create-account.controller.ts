import {
  Body,
  ConflictException,
  Controller,
  Post,
  UsePipes,
} from '@nestjs/common'
import { hash } from 'bcryptjs'
import z from 'zod'
import { PrismaService } from '../../database/prisma/prisma.service'
import { ZodValidationPipe } from '../pipes/zod-validation.pipe'

const createAccountBodySchema = z.object({
  name: z.string(),
  email: z.email(),
  password: z.string(),
})

type CreateAccountBodySchema = z.infer<typeof createAccountBodySchema>

@Controller('/accounts')
export class CreateAccountController {
  constructor(private prisma: PrismaService) {}

  @Post()
  // @HttpCode(201) deffine success response status code
  // not necessary here because is the default value for POST
  @UsePipes(new ZodValidationPipe(createAccountBodySchema))
  async handle(@Body() body: CreateAccountBodySchema) {
    const { name, email, password } = body

    const userWithSameEmail = await this.prisma.user.findUnique({
      where: { email },
    })

    if (userWithSameEmail) {
      throw new ConflictException(
        'User with same e-mail address already exists',
      )
    }

    const hashedPassword = await hash(password, 12)

    return this.prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    })
  }
}
