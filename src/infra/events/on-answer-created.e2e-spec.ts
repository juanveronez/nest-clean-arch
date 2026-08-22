import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'
import request from 'supertest'
import { AppModule } from '@/infra/app.module'
import { DatabaseModule } from '@/infra/database/database.module'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { AttachmentFactory } from '@/test/factories/make-attachment'
import { QuestionFactory } from '@/test/factories/make-question'
import { StudentFactory } from '@/test/factories/make-student'
import { waitFor } from '@/test/utils/wait-for'

describe('On answer created (E2E)', () => {
  let app: INestApplication
  let prisma: PrismaService
  let jwt: JwtService
  let studentFactory: StudentFactory
  let questionFactory: QuestionFactory

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [StudentFactory, QuestionFactory, AttachmentFactory],
    }).compile()

    app = moduleRef.createNestApplication()

    prisma = moduleRef.get(PrismaService)
    jwt = moduleRef.get(JwtService)
    studentFactory = moduleRef.get(StudentFactory)
    questionFactory = moduleRef.get(QuestionFactory)

    await app.init()
  })

  it('should send a notification when answer is created', async () => {
    const user = await studentFactory.make()

    const question = await questionFactory.make({
      authorId: user.id,
    })

    const accessToken = jwt.sign({ sub: user.id.toString() })

    const questionId = question.id.toString()
    const response = await request(app.getHttpServer())
      .post(`/questions/${questionId}/answers`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send({ content: 'New answer', attachments: [] })

    expect(response.statusCode).toBe(201)

    await waitFor(async () => {
      const notificationsOnDatabase = await prisma.notification.findFirst({
        where: { recipientId: user.id.toString() },
      })

      expect(notificationsOnDatabase).not.toBeNull()
    })
  })
})
