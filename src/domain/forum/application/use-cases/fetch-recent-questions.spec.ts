import { makeQuestion } from '@/test/factories/make-question'
import { InMemoryQuestionAttachmentsRepository } from '@/test/repositories/in-memory-question-attachments-repository'
import { InMemoryQuestionsRepository } from '@/test/repositories/in-memory-questions-repository'
import { FetchRecentQuestionsUseCase } from './fetch-recent-questions'

describe('Fetch Recent Questions', () => {
  let sut: FetchRecentQuestionsUseCase
  let questionsRepository: InMemoryQuestionsRepository
  let questionAttachmentsRepository: InMemoryQuestionAttachmentsRepository

  beforeEach(() => {
    questionAttachmentsRepository = new InMemoryQuestionAttachmentsRepository()
    questionsRepository = new InMemoryQuestionsRepository(
      questionAttachmentsRepository,
    )
    sut = new FetchRecentQuestionsUseCase(questionsRepository)
  })

  it('should be able to fetch recent questions', async () => {
    ;[
      makeQuestion({ createdAt: new Date(2022, 0, 20) }),
      makeQuestion({ createdAt: new Date(2022, 0, 18) }),
      makeQuestion({ createdAt: new Date(2022, 0, 23) }),
    ].forEach((question) => {
      questionsRepository.create(question)
    })

    const result = await sut.execute({ page: 1 })

    expect(result.value?.questions).toEqual([
      expect.objectContaining({ createdAt: new Date(2022, 0, 23) }),
      expect.objectContaining({ createdAt: new Date(2022, 0, 20) }),
      expect.objectContaining({ createdAt: new Date(2022, 0, 18) }),
    ])
  })

  it('should be able to fetch paginated recent questions', async () => {
    ;[...Array(25)].forEach(() => {
      questionsRepository.create(makeQuestion())
    })

    let result = await sut.execute({ page: 1 })
    expect(result.value?.questions).toHaveLength(20)

    result = await sut.execute({ page: 2 })
    expect(result.value?.questions).toHaveLength(5)
  })
})
