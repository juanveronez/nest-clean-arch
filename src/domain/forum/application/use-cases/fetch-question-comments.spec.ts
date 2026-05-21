import { UniqueEntityId } from '@/core/entities/value-objects/unique-entity-id'
import { makeQuestionComment } from '@/test/factories/make-question-comment'
import { InMemoryQuestionCommentsRepository } from '@/test/repositories/in-memory-question-comments-repository'
import { FetchQuestionCommentsUseCase } from './fetch-question-comments'

describe('Fetch Question Comments', () => {
  let sut: FetchQuestionCommentsUseCase
  let questionCommentsRepository: InMemoryQuestionCommentsRepository

  beforeEach(() => {
    questionCommentsRepository = new InMemoryQuestionCommentsRepository()
    sut = new FetchQuestionCommentsUseCase(questionCommentsRepository)
  })

  it('should be able to fetch question comments', async () => {
    ;[...Array(3)].forEach(() => {
      questionCommentsRepository.create(
        makeQuestionComment({ questionId: new UniqueEntityId('question') }),
      )
    })

    const result = await sut.execute({
      questionId: 'question',
      page: 1,
    })

    expect(result.value?.questionComments).toHaveLength(3)
  })

  it('should be able to fetch paginated question comments', async () => {
    ;[...Array(25)].forEach(() => {
      questionCommentsRepository.create(
        makeQuestionComment({ questionId: new UniqueEntityId('question') }),
      )
    })

    let result = await sut.execute({ questionId: 'question', page: 1 })
    expect(result.value?.questionComments).toHaveLength(20)

    result = await sut.execute({ questionId: 'question', page: 2 })
    expect(result.value?.questionComments).toHaveLength(5)
  })
})
