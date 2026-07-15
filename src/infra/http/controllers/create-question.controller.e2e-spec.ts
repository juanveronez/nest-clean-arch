import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'
import request from 'supertest'
import { AppModule } from '@/infra/app.module'
import { DatabaseModule } from '@/infra/database/database.module'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { AttachmentFactory } from '@/test/factories/make-attachment'
import { StudentFactory } from '@/test/factories/make-student'

describe('Create Question (E2E)', () => {
  let app: INestApplication
  let prisma: PrismaService
  let jwt: JwtService
  let studentFactory: StudentFactory
  let attachmentFactory: AttachmentFactory

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [StudentFactory, AttachmentFactory],
    }).compile()

    app = moduleRef.createNestApplication()

    prisma = moduleRef.get(PrismaService)
    jwt = moduleRef.get(JwtService)
    attachmentFactory = moduleRef.get(AttachmentFactory)
    studentFactory = moduleRef.get(StudentFactory)

    await app.init()
  })

  test('[POST] /questions', async () => {
    const user = await studentFactory.make()

    const accessToken = jwt.sign({ sub: user.id.toString() })

    const attachments = await Promise.all([
      attachmentFactory.make(),
      attachmentFactory.make(),
    ])
    const attachmentIds = attachments.map((att) => att.id.toString())

    const response = await request(app.getHttpServer())
      .post('/questions')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        title: 'question title',
        content: 'question content',
        attachments: attachmentIds,
      })

    expect(response.statusCode).toBe(201)

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
      where: { questionId: questionsOnDatabase[0].id },
    })

    expect(attachmentsOnDatabase).toHaveLength(2)
    expect(attachmentsOnDatabase).toEqual([
      expect.objectContaining({ id: attachmentIds[0] }),
      expect.objectContaining({ id: attachmentIds[1] }),
    ])
  })
})
