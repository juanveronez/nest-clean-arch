import { UniqueEntityId } from '@/core/entities/value-objects/unique-entity-id'
import { NotAllowedError } from '@/core/errors/not-allowed-error'
import { makeQuestion } from '@/test/factories/make-question'
import { makeQuestionAttachment } from '@/test/factories/make-question-attachment'
import { InMemoryQuestionAttachmentsRepository } from '@/test/repositories/in-memory-question-attachments-repository'
import { InMemoryQuestionsRepository } from '@/test/repositories/in-memory-questions-repository'
import { DeleteQuestionUseCase } from './delete-question'

describe('Delete Question', () => {
  let questionsRepository: InMemoryQuestionsRepository
  let questionAttachmentsRepository: InMemoryQuestionAttachmentsRepository
  let sut: DeleteQuestionUseCase

  beforeEach(() => {
    questionAttachmentsRepository = new InMemoryQuestionAttachmentsRepository()
    questionsRepository = new InMemoryQuestionsRepository(
      questionAttachmentsRepository,
    )
    sut = new DeleteQuestionUseCase(questionsRepository)
  })

  it('should be able to delete a question', async () => {
    const newQuestion = makeQuestion(
      { authorId: new UniqueEntityId('author') },
      new UniqueEntityId('question'),
    )
    questionsRepository.create(newQuestion)

    questionAttachmentsRepository.items.push(
      makeQuestionAttachment({ questionId: newQuestion.id }),
      makeQuestionAttachment({ questionId: newQuestion.id }),
    )

    expect(questionsRepository.items).toContain(newQuestion)

    await sut.execute({ questionId: 'question', authorId: 'author' })

    expect(questionsRepository.items).not.toContain(newQuestion)
    expect(questionsRepository.items).toHaveLength(0)
    expect(questionAttachmentsRepository.items).toHaveLength(0)
  })

  it('should not be able to delete a question from another author', async () => {
    const newQuestion = makeQuestion(
      { authorId: new UniqueEntityId('other-author') },
      new UniqueEntityId('question'),
    )
    questionsRepository.create(newQuestion)

    questionAttachmentsRepository.items.push(
      makeQuestionAttachment({ questionId: newQuestion.id }),
      makeQuestionAttachment({ questionId: newQuestion.id }),
    )

    expect(questionsRepository.items).toContain(newQuestion)

    const result = await sut.execute({
      questionId: 'question',
      authorId: 'author',
    })

    expect(result.isLeft()).toBeTruthy()
    expect(result.value).toBeInstanceOf(NotAllowedError)

    expect(questionsRepository.items).toContain(newQuestion)
    expect(questionsRepository.items).toHaveLength(1)
    expect(questionAttachmentsRepository.items).toHaveLength(2)
  })
})
