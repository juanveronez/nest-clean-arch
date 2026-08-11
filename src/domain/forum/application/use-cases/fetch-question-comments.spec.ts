import { UniqueEntityId } from '@/core/entities/value-objects/unique-entity-id'
import { makeQuestionComment } from '@/test/factories/make-question-comment'
import { makeStudent } from '@/test/factories/make-student'
import { InMemoryQuestionCommentsRepository } from '@/test/repositories/in-memory-question-comments-repository'
import { InMemoryStudentsRepository } from '@/test/repositories/in-memory-students-repository'
import { FetchQuestionCommentsUseCase } from './fetch-question-comments'

describe('Fetch Question Comments', () => {
  let sut: FetchQuestionCommentsUseCase
  let studentsRepository: InMemoryStudentsRepository
  let questionCommentsRepository: InMemoryQuestionCommentsRepository

  beforeEach(() => {
    studentsRepository = new InMemoryStudentsRepository()
    questionCommentsRepository = new InMemoryQuestionCommentsRepository(
      studentsRepository,
    )
    sut = new FetchQuestionCommentsUseCase(questionCommentsRepository)
  })

  it('should be able to fetch question comments', async () => {
    const student = makeStudent({ name: 'John' })
    studentsRepository.items.push(student)

    ;[...Array(3)].forEach(() => {
      questionCommentsRepository.create(
        makeQuestionComment({
          questionId: new UniqueEntityId('question'),
          authorId: student.id,
        }),
      )
    })

    const result = await sut.execute({
      questionId: 'question',
      page: 1,
    })

    const comments = questionCommentsRepository.items

    expect(result.value?.comments).toHaveLength(3)
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

  it('should be able to fetch paginated question comments', async () => {
    const student = makeStudent()
    studentsRepository.items.push(student)

    ;[...Array(25)].forEach(() => {
      questionCommentsRepository.create(
        makeQuestionComment({
          questionId: new UniqueEntityId('question'),
          authorId: student.id,
        }),
      )
    })

    let result = await sut.execute({ questionId: 'question', page: 1 })
    expect(result.value?.comments).toHaveLength(20)

    result = await sut.execute({ questionId: 'question', page: 2 })
    expect(result.value?.comments).toHaveLength(5)
  })
})
