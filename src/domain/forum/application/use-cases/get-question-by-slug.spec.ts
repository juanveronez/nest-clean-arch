import { makeQuestion } from '@/test/factories/make-question'
import { InMemoryQuestionAttachmentsRepository } from '@/test/repositories/in-memory-question-attachments-repository'
import { InMemoryQuestionsRepository } from '@/test/repositories/in-memory-questions-repository'
import { Slug } from '../../enterprice/entities/value-objects/slug'
import { GetQuestionBySlugUseCase } from './get-question-by-slug'

describe('Get Question By Slug', () => {
  let questionsRepository: InMemoryQuestionsRepository
  let questionAttachmentsRepository: InMemoryQuestionAttachmentsRepository
  let sut: GetQuestionBySlugUseCase

  beforeEach(() => {
    questionAttachmentsRepository = new InMemoryQuestionAttachmentsRepository()
    questionsRepository = new InMemoryQuestionsRepository(
      questionAttachmentsRepository,
    )
    sut = new GetQuestionBySlugUseCase(questionsRepository)
  })

  it('should be able to get a question by its slug', async () => {
    const newQuestion = makeQuestion({ slug: Slug.create('new-question-slug') })
    questionsRepository.create(newQuestion)

    const result = await sut.execute({
      slug: 'new-question-slug',
    })

    expect(result.isRight()).toBeTruthy()

    expect(questionsRepository.items[0].id).toBe(newQuestion.id)
    expect(questionsRepository.items[0].content).toBe(newQuestion.content)
    expect(questionsRepository.items[0].title).toBe(newQuestion.title)
  })
})
