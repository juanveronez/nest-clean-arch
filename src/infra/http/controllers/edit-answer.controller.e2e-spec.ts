import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'
import request from 'supertest'
import { AppModule } from '@/infra/app.module'
import { DatabaseModule } from '@/infra/database/database.module'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { AnswerFactory } from '@/test/factories/make-answer'
import { AnswerAttachmentFactory } from '@/test/factories/make-answer-attachment'
import { AttachmentFactory } from '@/test/factories/make-attachment'
import { QuestionFactory } from '@/test/factories/make-question'
import { StudentFactory } from '@/test/factories/make-student'

describe('Edit answer (E2E)', () => {
  let app: INestApplication
  let prisma: PrismaService
  let jwt: JwtService
  let studentFactory: StudentFactory
  let questionFactory: QuestionFactory
  let answerFactory: AnswerFactory
  let attachmentFactory: AttachmentFactory
  let answerAttachmentFactory: AnswerAttachmentFactory

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [
        StudentFactory,
        QuestionFactory,
        AnswerFactory,
        AttachmentFactory,
        AnswerAttachmentFactory,
      ],
    }).compile()

    app = moduleRef.createNestApplication()

    prisma = moduleRef.get(PrismaService)
    jwt = moduleRef.get(JwtService)
    studentFactory = moduleRef.get(StudentFactory)
    questionFactory = moduleRef.get(QuestionFactory)
    answerFactory = moduleRef.get(AnswerFactory)
    attachmentFactory = moduleRef.get(AttachmentFactory)
    answerAttachmentFactory = moduleRef.get(AnswerAttachmentFactory)

    await app.init()
  })

  test('[PUT] /answers/:id', async () => {
    const user = await studentFactory.make()

    const question = await questionFactory.make({
      authorId: user.id,
    })

    const attachments = await Promise.all([
      attachmentFactory.make(),
      attachmentFactory.make(),
      attachmentFactory.make(),
    ])

    const answer = await answerFactory.make({
      questionId: question.id,
      authorId: user.id,
    })

    await Promise.all([
      answerAttachmentFactory.make({
        answerId: answer.id,
        attachmentId: attachments[0].id,
      }),
      answerAttachmentFactory.make({
        answerId: answer.id,
        attachmentId: attachments[1].id,
      }),
    ])

    const attachmentIds = attachments.map((att) => att.id.toString())

    const accessToken = jwt.sign({ sub: user.id.toString() })

    const answerId = answer.id.toString()
    const response = await request(app.getHttpServer())
      .put(`/answers/${answerId}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        content: 'updated answer',
        attachments: [attachmentIds[0], attachmentIds[2]],
      })

    expect(response.statusCode).toBe(204)

    const answersOnDatabase = await prisma.answer.findMany()
    expect(answersOnDatabase).toEqual([
      expect.objectContaining({ content: 'updated answer' }),
    ])

    const attachmentsOnDatabase = await prisma.attachment.findMany({
      where: { answerId: answer.id.toString() },
    })

    expect(attachmentsOnDatabase).toHaveLength(2)
    expect(attachmentsOnDatabase).toEqual([
      expect.objectContaining({ id: attachmentIds[0] }),
      expect.objectContaining({ id: attachmentIds[2] }),
    ])
  })
})
