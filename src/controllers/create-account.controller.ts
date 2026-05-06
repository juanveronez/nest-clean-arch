import { Body, ConflictException, Controller, Post } from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service'

@Controller('/accounts')
export class CreateAccountController {
  constructor(private prisma: PrismaService) {}

  @Post()
  async handle(
    @Body() body: { name: string; email: string; password: string },
  ) {
    const { name, email, password } = body

    const userWithSameEmail = await this.prisma.user.findUnique({
      where: { email },
    })

    if (userWithSameEmail) {
      throw new ConflictException(
        'User with same e-mail address already exists',
      )
    }

    return this.prisma.user.create({
      data: {
        name,
        email,
        password,
      },
    })
  }
}
