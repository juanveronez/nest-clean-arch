import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'
import request from 'supertest'
import { AppModule } from '@/infra/app.module'
import { DatabaseModule } from '@/infra/database/database.module'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { AttachmentFactory } from '@/test/factories/make-attachment'
import { QuestionFactory } from '@/test/factories/make-question'
import { QuestionAttachmentFactory } from '@/test/factories/make-question-attachment'
import { StudentFactory } from '@/test/factories/make-student'

describe('Edit Question (E2E)', () => {
  let app: INestApplication
  let prisma: PrismaService
  let jwt: JwtService
  let studentFactory: StudentFactory
  let questionFactory: QuestionFactory
  let attachmentFactory: AttachmentFactory
  let questionAttachmentFactory: QuestionAttachmentFactory

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [
        StudentFactory,
        QuestionFactory,
        AttachmentFactory,
        QuestionAttachmentFactory,
      ],
    }).compile()

    app = moduleRef.createNestApplication()

    prisma = moduleRef.get(PrismaService)
    jwt = moduleRef.get(JwtService)
    studentFactory = moduleRef.get(StudentFactory)
    questionFactory = moduleRef.get(QuestionFactory)
    attachmentFactory = moduleRef.get(AttachmentFactory)
    questionAttachmentFactory = moduleRef.get(QuestionAttachmentFactory)

    await app.init()
  })

  test('[PUT] /questions/:id', async () => {
    const user = await studentFactory.make()

    const question = await questionFactory.make({
      authorId: user.id,
    })

    const attachments = await Promise.all([
      attachmentFactory.make(),
      attachmentFactory.make(),
      attachmentFactory.make(),
    ])

    await Promise.all([
      questionAttachmentFactory.make({
        questionId: question.id,
        attachmentId: attachments[0].id,
      }),
      questionAttachmentFactory.make({
        questionId: question.id,
        attachmentId: attachments[1].id,
      }),
    ])

    const attachmentIds = attachments.map((att) => att.id.toString())

    const accessToken = jwt.sign({ sub: user.id.toString() })

    const response = await request(app.getHttpServer())
      .put(`/questions/${question.id.toString()}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        title: 'question title',
        content: 'question content',
        attachments: [attachmentIds[0], attachmentIds[2]],
      })

    expect(response.statusCode).toBe(204)

    const questionsOnDatabase = await prisma.question.findMany({
      where: { title: 'question title' },
    })
    expect(questionsOnDatabase).toHaveLength(1)
    expect(questionsOnDatabase).toEqual([
      expect.objectContaining({
        title: 'question title',
        content: 'question content',
      }),
    ])

    const attachmentsOnDatabase = await prisma.attachment.findMany({
      where: { questionId: question.id.toString() },
    })

    expect(attachmentsOnDatabase).toHaveLength(2)
    expect(attachmentsOnDatabase).toEqual([
      expect.objectContaining({ id: attachmentIds[0] }),
      expect.objectContaining({ id: attachmentIds[2] }),
    ])
  })
})
