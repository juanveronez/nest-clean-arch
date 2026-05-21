import { UniqueEntityId } from '@/core/entities/value-objects/unique-entity-id'
import { makeAnswer } from '@/test/factories/make-answer'
import { InMemoryAnswerAttachmentsRepository } from '@/test/repositories/in-memory-answer-attachments-repository'
import { InMemoryAnswersRepository } from '@/test/repositories/in-memory-answers-repository'
import { FetchQuestionAnswersUseCase } from './fetch-question-answers'

describe('Fetch Question Answers', () => {
  let sut: FetchQuestionAnswersUseCase
  let answersRepository: InMemoryAnswersRepository
  let answerAttachmentsRepository: InMemoryAnswerAttachmentsRepository

  beforeEach(() => {
    answerAttachmentsRepository = new InMemoryAnswerAttachmentsRepository()
    answersRepository = new InMemoryAnswersRepository(
      answerAttachmentsRepository,
    )
    sut = new FetchQuestionAnswersUseCase(answersRepository)
  })

  it('should be able to fetch question answers', async () => {
    ;[...Array(3)].forEach(() => {
      answersRepository.create(
        makeAnswer({ questionId: new UniqueEntityId('question') }),
      )
    })

    const result = await sut.execute({ questionId: 'question', page: 1 })

    expect(result.value?.answers).toHaveLength(3)
  })

  it('should be able to fetch paginated question answers', async () => {
    ;[...Array(25)].forEach(() => {
      answersRepository.create(
        makeAnswer({ questionId: new UniqueEntityId('question') }),
      )
    })

    let result = await sut.execute({ questionId: 'question', page: 1 })
    expect(result.value?.answers).toHaveLength(20)

    result = await sut.execute({ questionId: 'question', page: 2 })
    expect(result.value?.answers).toHaveLength(5)
  })
})
