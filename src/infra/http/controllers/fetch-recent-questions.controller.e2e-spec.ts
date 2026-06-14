import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'
import request from 'supertest'
import { AppModule } from '@/infra/app.module'
import { DatabaseModule } from '@/infra/database/database.module'
import { QuestionFactory } from '@/test/factories/make-question'
import { StudentFactory } from '@/test/factories/make-student'

describe('Fetch Recent Questions (E2E)', () => {
  let app: INestApplication
  let jwt: JwtService
  let studentFactory: StudentFactory
  let questionFactory: QuestionFactory

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [StudentFactory, QuestionFactory],
    }).compile()

    app = moduleRef.createNestApplication()

    jwt = moduleRef.get(JwtService)
    studentFactory = moduleRef.get(StudentFactory)
    questionFactory = moduleRef.get(QuestionFactory)

    await app.init()
  })

  test('[GET] /questions', async () => {
    const user = await studentFactory.makePrismaStudent()

    await Promise.all(
      [...Array(30)]
        .map((_, i) => ({
          title: `title ${i}`,
          authorId: user.id,
          createdAt: new Date(30 - i),
        }))
        .map((value) => questionFactory.makePrismaQuestion(value)),
    )

    const accessToken = jwt.sign({ sub: user.id.toString() })

    let response = await request(app.getHttpServer())
      .get('/questions')
      .set('Authorization', `Bearer ${accessToken}`)
      .send()

    expect(response.statusCode).toBe(200)

    expect(response.body.questions).toHaveLength(20)
    expect(response.body).toEqual({
      questions: [
        expect.objectContaining({ title: 'title 0' }),
        expect.objectContaining({ title: 'title 1' }),
        expect.objectContaining({ title: 'title 2' }),
        expect.objectContaining({ title: 'title 3' }),
        expect.objectContaining({ title: 'title 4' }),
        expect.objectContaining({ title: 'title 5' }),
        expect.objectContaining({ title: 'title 6' }),
        expect.objectContaining({ title: 'title 7' }),
        expect.objectContaining({ title: 'title 8' }),
        expect.objectContaining({ title: 'title 9' }),
        expect.objectContaining({ title: 'title 10' }),
        expect.objectContaining({ title: 'title 11' }),
        expect.objectContaining({ title: 'title 12' }),
        expect.objectContaining({ title: 'title 13' }),
        expect.objectContaining({ title: 'title 14' }),
        expect.objectContaining({ title: 'title 15' }),
        expect.objectContaining({ title: 'title 16' }),
        expect.objectContaining({ title: 'title 17' }),
        expect.objectContaining({ title: 'title 18' }),
        expect.objectContaining({ title: 'title 19' }),
      ],
    })

    response = await request(app.getHttpServer())
      .get('/questions?page=2')
      .set('Authorization', `Bearer ${accessToken}`)
      .send()

    expect(response.statusCode).toBe(200)

    expect(response.body.questions).toHaveLength(10)
    expect(response.body).toEqual({
      questions: [
        expect.objectContaining({ title: 'title 20' }),
        expect.objectContaining({ title: 'title 21' }),
        expect.objectContaining({ title: 'title 22' }),
        expect.objectContaining({ title: 'title 23' }),
        expect.objectContaining({ title: 'title 24' }),
        expect.objectContaining({ title: 'title 25' }),
        expect.objectContaining({ title: 'title 26' }),
        expect.objectContaining({ title: 'title 27' }),
        expect.objectContaining({ title: 'title 28' }),
        expect.objectContaining({ title: 'title 29' }),
      ],
    })
  })
})
