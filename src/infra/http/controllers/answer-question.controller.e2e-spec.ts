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

describe('Answer question (E2E)', () => {
  let app: INestApplication
  let prisma: PrismaService
  let jwt: JwtService
  let studentFactory: StudentFactory
  let questionFactory: QuestionFactory
  let attachmentFactory: AttachmentFactory

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
    attachmentFactory = moduleRef.get(AttachmentFactory)

    await app.init()
  })

  test('[POST] /questions/:questionId/answers', async () => {
    const user = await studentFactory.make()

    const question = await questionFactory.make({
      authorId: user.id,
    })

    const attachments = await Promise.all([
      attachmentFactory.make().then((att) => att.id.toString()),
      attachmentFactory.make().then((att) => att.id.toString()),
    ])

    const accessToken = jwt.sign({ sub: user.id.toString() })

    const questionId = question.id.toString()
    const response = await request(app.getHttpServer())
      .post(`/questions/${questionId}/answers`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send({ content: 'New answer', attachments })

    expect(response.statusCode).toBe(201)

    const answersDatabase = await prisma.answer.findMany()
    expect(answersDatabase).toHaveLength(1)
    expect(answersDatabase).toEqual([
      expect.objectContaining({ content: 'New answer' }),
    ])

    const attachmentsOnDatabase = await prisma.attachment.findMany({
      where: { answerId: answersDatabase[0].id },
    })

    expect(attachmentsOnDatabase).toHaveLength(2)
    expect(attachmentsOnDatabase).toEqual([
      expect.objectContaining({ id: attachments[0] }),
      expect.objectContaining({ id: attachments[1] }),
    ])
  })
})
