import { UniqueEntityId } from '@/core/entities/value-objects/unique-entity-id'
import { makeAnswerComment } from '@/test/factories/make-answer-comment'
import { makeStudent } from '@/test/factories/make-student'
import { InMemoryAnswerCommentsRepository } from '@/test/repositories/in-memory-answer-comments-repository'
import { InMemoryStudentsRepository } from '@/test/repositories/in-memory-students-repository'
import { FetchAnswerCommentsUseCase } from './fetch-answer-comments'

describe('Fetch Answer Comments', () => {
  let sut: FetchAnswerCommentsUseCase
  let studentsRepository: InMemoryStudentsRepository
  let answerCommentsRepository: InMemoryAnswerCommentsRepository

  beforeEach(() => {
    studentsRepository = new InMemoryStudentsRepository()
    answerCommentsRepository = new InMemoryAnswerCommentsRepository(
      studentsRepository,
    )
    sut = new FetchAnswerCommentsUseCase(answerCommentsRepository)
  })

  it('should be able to fetch answer comments', async () => {
    const author = makeStudent({ name: 'John' })
    studentsRepository.create(author)

    ;[...Array(3)].forEach(() => {
      answerCommentsRepository.create(
        makeAnswerComment({
          answerId: new UniqueEntityId('answer'),
          authorId: author.id,
        }),
      )
    })

    const result = await sut.execute({
      answerId: 'answer',
      page: 1,
    })

    expect(result.value?.comments).toHaveLength(3)

    const comments = answerCommentsRepository.items
    expect(result.value?.comments).toEqual([
      expect.objectContaining({
        commentId: comments[0].id,
        author: 'John',
      }),
      expect.objectContaining({
        commentId: comments[1].id,
        author: 'John',
      }),
      expect.objectContaining({
        commentId: comments[2].id,
        author: 'John',
      }),
    ])
  })

  it('should be able to fetch paginated answer comments', async () => {
    const author = makeStudent({ name: 'John' })
    studentsRepository.create(author)

    ;[...Array(25)].forEach(() => {
      answerCommentsRepository.create(
        makeAnswerComment({
          authorId: author.id,
          answerId: new UniqueEntityId('answer'),
        }),
      )
    })

    let result = await sut.execute({ answerId: 'answer', page: 1 })
    expect(result.value?.comments).toHaveLength(20)

    result = await sut.execute({ answerId: 'answer', page: 2 })
    expect(result.value?.comments).toHaveLength(5)
  })
})
