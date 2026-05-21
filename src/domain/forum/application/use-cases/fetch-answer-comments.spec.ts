import { UniqueEntityId } from '@/core/entities/value-objects/unique-entity-id'
import { makeAnswerComment } from '@/test/factories/make-answer-comment'
import { InMemoryAnswerCommentsRepository } from '@/test/repositories/in-memory-answer-comments-repository'
import { FetchAnswerCommentsUseCase } from './fetch-answer-comments'

describe('Fetch Answer Comments', () => {
  let sut: FetchAnswerCommentsUseCase
  let answerCommentsRepository: InMemoryAnswerCommentsRepository

  beforeEach(() => {
    answerCommentsRepository = new InMemoryAnswerCommentsRepository()
    sut = new FetchAnswerCommentsUseCase(answerCommentsRepository)
  })

  it('should be able to fetch answer comments', async () => {
    ;[...Array(3)].forEach(() => {
      answerCommentsRepository.create(
        makeAnswerComment({ answerId: new UniqueEntityId('answer') }),
      )
    })

    const result = await sut.execute({
      answerId: 'answer',
      page: 1,
    })

    expect(result.value?.answerComments).toHaveLength(3)
  })

  it('should be able to fetch paginated answer comments', async () => {
    ;[...Array(25)].forEach(() => {
      answerCommentsRepository.create(
        makeAnswerComment({ answerId: new UniqueEntityId('answer') }),
      )
    })

    let result = await sut.execute({ answerId: 'answer', page: 1 })
    expect(result.value?.answerComments).toHaveLength(20)

    result = await sut.execute({ answerId: 'answer', page: 2 })
    expect(result.value?.answerComments).toHaveLength(5)
  })
})
