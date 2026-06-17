import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'
import request from 'supertest'
import { AppModule } from '@/infra/app.module'
import { DatabaseModule } from '@/infra/database/database.module'
import { AnswerFactory } from '@/test/factories/make-answer'
import { QuestionFactory } from '@/test/factories/make-question'
import { StudentFactory } from '@/test/factories/make-student'

describe('Fetch question answers (E2E)', () => {
  let app: INestApplication
  let jwt: JwtService
  let studentFactory: StudentFactory
  let questionFactory: QuestionFactory
  let answerFactory: AnswerFactory

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [StudentFactory, QuestionFactory, AnswerFactory],
    }).compile()

    app = moduleRef.createNestApplication()

    jwt = moduleRef.get(JwtService)
    studentFactory = moduleRef.get(StudentFactory)
    questionFactory = moduleRef.get(QuestionFactory)
    answerFactory = moduleRef.get(AnswerFactory)

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
          content: `Answer ${i}`,
        }))
        .map((value) => answerFactory.makePrismaAnswer(value)),
    )

    const accessToken = jwt.sign({ sub: user.id.toString() })

    const questionId = question.id.toString()
    let response = await request(app.getHttpServer())
      .get(`/questions/${questionId}/answers`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send()

    expect(response.statusCode).toBe(200)

    expect(response.body.answers).toHaveLength(20)
    expect(response.body).toEqual({
      answers: [
        expect.objectContaining({ content: 'Answer 0' }),
        expect.objectContaining({ content: 'Answer 1' }),
        expect.objectContaining({ content: 'Answer 2' }),
        expect.objectContaining({ content: 'Answer 3' }),
        expect.objectContaining({ content: 'Answer 4' }),
        expect.objectContaining({ content: 'Answer 5' }),
        expect.objectContaining({ content: 'Answer 6' }),
        expect.objectContaining({ content: 'Answer 7' }),
        expect.objectContaining({ content: 'Answer 8' }),
        expect.objectContaining({ content: 'Answer 9' }),
        expect.objectContaining({ content: 'Answer 10' }),
        expect.objectContaining({ content: 'Answer 11' }),
        expect.objectContaining({ content: 'Answer 12' }),
        expect.objectContaining({ content: 'Answer 13' }),
        expect.objectContaining({ content: 'Answer 14' }),
        expect.objectContaining({ content: 'Answer 15' }),
        expect.objectContaining({ content: 'Answer 16' }),
        expect.objectContaining({ content: 'Answer 17' }),
        expect.objectContaining({ content: 'Answer 18' }),
        expect.objectContaining({ content: 'Answer 19' }),
      ],
    })

    response = await request(app.getHttpServer())
      .get(`/questions/${questionId}/answers?page=2`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send()

    expect(response.statusCode).toBe(200)

    expect(response.body.answers).toHaveLength(10)
    expect(response.body).toEqual({
      answers: [
        expect.objectContaining({ content: 'Answer 20' }),
        expect.objectContaining({ content: 'Answer 21' }),
        expect.objectContaining({ content: 'Answer 22' }),
        expect.objectContaining({ content: 'Answer 23' }),
        expect.objectContaining({ content: 'Answer 24' }),
        expect.objectContaining({ content: 'Answer 25' }),
        expect.objectContaining({ content: 'Answer 26' }),
        expect.objectContaining({ content: 'Answer 27' }),
        expect.objectContaining({ content: 'Answer 28' }),
        expect.objectContaining({ content: 'Answer 29' }),
      ],
    })

    response = await request(app.getHttpServer())
      .get(`/questions/${questionId}/answers?page=3`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send()

    expect(response.statusCode).toBe(200)
    expect(response.body.answers).toHaveLength(0)
  })
})
