import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'
import request from 'supertest'
import { AppModule } from '@/infra/app.module'
import { DatabaseModule } from '@/infra/database/database.module'
import { QuestionFactory } from '@/test/factories/make-question'
import { QuestionCommentFactory } from '@/test/factories/make-question-comment'
import { StudentFactory } from '@/test/factories/make-student'

describe('Fetch question answers (E2E)', () => {
  let app: INestApplication
  let jwt: JwtService
  let studentFactory: StudentFactory
  let questionFactory: QuestionFactory
  let questionCommentFactory: QuestionCommentFactory

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [StudentFactory, QuestionFactory, QuestionCommentFactory],
    }).compile()

    app = moduleRef.createNestApplication()

    jwt = moduleRef.get(JwtService)
    studentFactory = moduleRef.get(StudentFactory)
    questionFactory = moduleRef.get(QuestionFactory)
    questionCommentFactory = moduleRef.get(QuestionCommentFactory)

    await app.init()
  })

  test('[GET] /questions/:questionId/answers', async () => {
    const user = await studentFactory.makePrismaStudent()
    const question = await questionFactory.makePrismaQuestion({
      authorId: user.id,
    })

    await Promise.all(
      [...Array(30)]
        .map((_, i) => ({
          authorId: user.id,
          questionId: question.id,
          createdAt: new Date(30 - i),
          content: `comment ${i}`,
        }))
        .map((value) =>
          questionCommentFactory.makePrismaQuestionComment(value),
        ),
    )

    const accessToken = jwt.sign({ sub: user.id.toString() })

    const questionId = question.id.toString()
    let response = await request(app.getHttpServer())
      .get(`/questions/${questionId}/comments`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send()

    expect(response.statusCode).toBe(200)

    expect(response.body.comments).toHaveLength(20)
    expect(response.body).toEqual({
      comments: [
        expect.objectContaining({ content: 'comment 0' }),
        expect.objectContaining({ content: 'comment 1' }),
        expect.objectContaining({ content: 'comment 2' }),
        expect.objectContaining({ content: 'comment 3' }),
        expect.objectContaining({ content: 'comment 4' }),
        expect.objectContaining({ content: 'comment 5' }),
        expect.objectContaining({ content: 'comment 6' }),
        expect.objectContaining({ content: 'comment 7' }),
        expect.objectContaining({ content: 'comment 8' }),
        expect.objectContaining({ content: 'comment 9' }),
        expect.objectContaining({ content: 'comment 10' }),
        expect.objectContaining({ content: 'comment 11' }),
        expect.objectContaining({ content: 'comment 12' }),
        expect.objectContaining({ content: 'comment 13' }),
        expect.objectContaining({ content: 'comment 14' }),
        expect.objectContaining({ content: 'comment 15' }),
        expect.objectContaining({ content: 'comment 16' }),
        expect.objectContaining({ content: 'comment 17' }),
        expect.objectContaining({ content: 'comment 18' }),
        expect.objectContaining({ content: 'comment 19' }),
      ],
    })

    response = await request(app.getHttpServer())
      .get(`/questions/${questionId}/comments?page=2`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send()

    expect(response.statusCode).toBe(200)

    expect(response.body.comments).toHaveLength(10)
    expect(response.body).toEqual({
      comments: [
        expect.objectContaining({ content: 'comment 20' }),
        expect.objectContaining({ content: 'comment 21' }),
        expect.objectContaining({ content: 'comment 22' }),
        expect.objectContaining({ content: 'comment 23' }),
        expect.objectContaining({ content: 'comment 24' }),
        expect.objectContaining({ content: 'comment 25' }),
        expect.objectContaining({ content: 'comment 26' }),
        expect.objectContaining({ content: 'comment 27' }),
        expect.objectContaining({ content: 'comment 28' }),
        expect.objectContaining({ content: 'comment 29' }),
      ],
    })

    response = await request(app.getHttpServer())
      .get(`/questions/${questionId}/comments?page=3`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send()

    expect(response.statusCode).toBe(200)
    expect(response.body.comments).toHaveLength(0)
  })
})
