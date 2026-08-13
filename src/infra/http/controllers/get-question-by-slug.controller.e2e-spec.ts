import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'
import request from 'supertest'
import { Slug } from '@/domain/forum/enterprice/entities/value-objects/slug'
import { AppModule } from '@/infra/app.module'
import { DatabaseModule } from '@/infra/database/database.module'
import { AttachmentFactory } from '@/test/factories/make-attachment'
import { QuestionFactory } from '@/test/factories/make-question'
import { QuestionAttachmentFactory } from '@/test/factories/make-question-attachment'
import { StudentFactory } from '@/test/factories/make-student'

describe('Get question by slug (E2E)', () => {
  let app: INestApplication
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

    jwt = moduleRef.get(JwtService)
    studentFactory = moduleRef.get(StudentFactory)
    questionFactory = moduleRef.get(QuestionFactory)
    attachmentFactory = moduleRef.get(AttachmentFactory)
    questionAttachmentFactory = moduleRef.get(QuestionAttachmentFactory)

    await app.init()
  })

  test('[GET] /questions/:slug', async () => {
    const user = await studentFactory.make({ name: 'John' })
    const attachment = await attachmentFactory.make({ title: 'Some attach' })

    const question = await questionFactory.make({
      authorId: user.id,
      slug: Slug.create('slug'),
      title: 'Question',
    })

    await questionAttachmentFactory.make({
      questionId: question.id,
      attachmentId: attachment.id,
    })

    const accessToken = jwt.sign({ sub: user.id.toString() })

    const response = await request(app.getHttpServer())
      .get('/questions/slug')
      .set('Authorization', `Bearer ${accessToken}`)
      .send()

    expect(response.statusCode).toBe(200)

    expect(response.body).toEqual({
      question: expect.objectContaining({
        title: 'Question',
        author: expect.objectContaining({
          name: 'John',
        }),
        attachments: [
          expect.objectContaining({
            title: 'Some attach',
          }),
        ],
      }),
    })
  })
})
