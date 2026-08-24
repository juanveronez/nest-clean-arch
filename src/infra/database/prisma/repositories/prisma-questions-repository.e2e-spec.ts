import { INestApplication } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import { QuestionsRepository } from '@/domain/forum/application/repository/questions-repository'
import { AppModule } from '@/infra/app.module'
import { CacheModule } from '@/infra/cache/cache.module'
import { CacheRepository } from '@/infra/cache/cache-repository'
import { DatabaseModule } from '@/infra/database/database.module'
import { AttachmentFactory } from '@/test/factories/make-attachment'
import { QuestionFactory } from '@/test/factories/make-question'
import { QuestionAttachmentFactory } from '@/test/factories/make-question-attachment'
import { StudentFactory } from '@/test/factories/make-student'

describe('Prisma Question Repository (E2E)', () => {
  let app: INestApplication
  let studentFactory: StudentFactory
  let questionFactory: QuestionFactory
  let attachmentFactory: AttachmentFactory
  let questionAttachmentFactory: QuestionAttachmentFactory
  let cacheRepository: CacheRepository
  let questionsRepository: QuestionsRepository

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule, CacheModule],
      providers: [
        StudentFactory,
        QuestionFactory,
        AttachmentFactory,
        QuestionAttachmentFactory,
      ],
    }).compile()

    app = moduleRef.createNestApplication()

    studentFactory = moduleRef.get(StudentFactory)
    questionFactory = moduleRef.get(QuestionFactory)
    attachmentFactory = moduleRef.get(AttachmentFactory)
    questionAttachmentFactory = moduleRef.get(QuestionAttachmentFactory)
    cacheRepository = moduleRef.get(CacheRepository)
    questionsRepository = moduleRef.get(QuestionsRepository)

    await app.init()
  })

  it('should cache question details', async () => {
    const user = await studentFactory.make()

    const question = await questionFactory.make({ authorId: user.id })
    const attachment = await attachmentFactory.make()

    await questionAttachmentFactory.make({
      questionId: question.id,
      attachmentId: attachment.id,
    })

    const slug = question.slug.value
    const questionDetails = await questionsRepository.findDetailsBySlug(slug)

    expect(questionDetails).not.toBeNull()

    const cachedQuestionDetails = await cacheRepository.get(
      `question:${slug}:details`,
    )

    if (!cachedQuestionDetails) throw new Error('Cache not found')

    expect(JSON.parse(cachedQuestionDetails)).toEqual(
      expect.objectContaining({
        id: questionDetails?.questionId.toString(),
      }),
    )
  })

  it('should return cached question details on subsequent calls', async () => {
    const user = await studentFactory.make()

    const question = await questionFactory.make({ authorId: user.id })
    const attachment = await attachmentFactory.make()

    await questionAttachmentFactory.make({
      questionId: question.id,
      attachmentId: attachment.id,
    })

    const slug = question.slug.value

    expect(await cacheRepository.get(`question:${slug}:details`)).toBeNull()

    await questionsRepository.findDetailsBySlug(slug)

    const cachedQuestionDetails = await cacheRepository.get(
      `question:${slug}:details`,
    )

    if (!cachedQuestionDetails) throw new Error('Cache not found')

    expect(JSON.parse(cachedQuestionDetails)).toEqual(
      expect.objectContaining({
        id: question.id.toString(),
      }),
    )
  })

  it('should invalidate the cache when a question is updated', async () => {
    const user = await studentFactory.make()

    const question = await questionFactory.make({ authorId: user.id })
    const attachment = await attachmentFactory.make()

    await questionAttachmentFactory.make({
      questionId: question.id,
      attachmentId: attachment.id,
    })

    const slug = question.slug.value

    await questionsRepository.findDetailsBySlug(slug)
    expect(await cacheRepository.get(`question:${slug}:details`)).not.toBeNull()

    await questionsRepository.save(question)
    expect(await cacheRepository.get(`question:${slug}:details`)).toBeNull()
  })
})
