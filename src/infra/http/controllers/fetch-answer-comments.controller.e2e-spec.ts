import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'
import request from 'supertest'
import { AppModule } from '@/infra/app.module'
import { DatabaseModule } from '@/infra/database/database.module'
import { AnswerFactory } from '@/test/factories/make-answer'
import { AnswerCommentFactory } from '@/test/factories/make-answer-comment'
import { QuestionFactory } from '@/test/factories/make-question'
import { StudentFactory } from '@/test/factories/make-student'

describe('Fetch question answers (E2E)', () => {
  let app: INestApplication
  let jwt: JwtService
  let studentFactory: StudentFactory
  let questionFactory: QuestionFactory
  let answerFactory: AnswerFactory
  let answerCommentFactory: AnswerCommentFactory

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [
        StudentFactory,
        QuestionFactory,
        AnswerFactory,
        AnswerCommentFactory,
      ],
    }).compile()

    app = moduleRef.createNestApplication()

    jwt = moduleRef.get(JwtService)
    studentFactory = moduleRef.get(StudentFactory)
    questionFactory = moduleRef.get(QuestionFactory)
    answerFactory = moduleRef.get(AnswerFactory)
    answerCommentFactory = moduleRef.get(AnswerCommentFactory)

    await app.init()
  })

  test('[GET] /answers/:answerId/answers', async () => {
    const user = await studentFactory.makePrismaStudent()
    const question = await questionFactory.makePrismaQuestion({
      authorId: user.id,
    })
    const answer = await answerFactory.makePrismaAnswer({
      authorId: user.id,
      questionId: question.id,
    })

    await Promise.all(
      [...Array(30)]
        .map((_, i) => ({
          authorId: user.id,
          answerId: answer.id,
          createdAt: new Date(30 - i),
          content: `comment ${i}`,
        }))
        .map((value) => answerCommentFactory.makePrismaAnswerComment(value)),
    )

    const accessToken = jwt.sign({ sub: user.id.toString() })

    const answerId = answer.id.toString()
    let response = await request(app.getHttpServer())
      .get(`/answers/${answerId}/comments`)
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
      .get(`/answers/${answerId}/comments?page=2`)
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
      .get(`/answers/${answerId}/comments?page=3`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send()

    expect(response.statusCode).toBe(200)
    expect(response.body.comments).toHaveLength(0)
  })
})
