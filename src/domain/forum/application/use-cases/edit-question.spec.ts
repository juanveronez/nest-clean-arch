import { UniqueEntityId } from '@/core/entities/value-objects/unique-entity-id'
import { NotAllowedError } from '@/core/errors/not-allowed-error'
import { makeQuestion } from '@/test/factories/make-question'
import { makeQuestionAttachment } from '@/test/factories/make-question-attachment'
import { InMemoryQuestionAttachmentsRepository } from '@/test/repositories/in-memory-question-attachments-repository'
import { InMemoryQuestionsRepository } from '@/test/repositories/in-memory-questions-repository'
import { EditQuestionUseCase } from './edit-question'

describe('Edit Question', () => {
  let questionsRepository: InMemoryQuestionsRepository
  let questionAttachmentsRepository: InMemoryQuestionAttachmentsRepository
  let sut: EditQuestionUseCase

  beforeEach(() => {
    questionAttachmentsRepository = new InMemoryQuestionAttachmentsRepository()
    questionsRepository = new InMemoryQuestionsRepository(
      questionAttachmentsRepository,
    )
    sut = new EditQuestionUseCase(
      questionsRepository,
      questionAttachmentsRepository,
    )
  })

  it('should be able to edit a question', async () => {
    const newQuestion = makeQuestion(
      { authorId: new UniqueEntityId('author') },
      new UniqueEntityId('question'),
    )

    questionsRepository.create(newQuestion)

    questionAttachmentsRepository.items.push(
      makeQuestionAttachment({
        questionId: newQuestion.id,
        attachmentId: new UniqueEntityId('1'),
      }),
      makeQuestionAttachment({
        questionId: newQuestion.id,
        attachmentId: new UniqueEntityId('2'),
      }),
    )

    const result = await sut.execute({
      questionId: 'question',
      authorId: 'author',
      title: 'Updated Question',
      content: 'This is the updated content of the question.',
      attachmentsIds: ['1', '3'],
    })

    expect(result.isRight()).toBeTruthy()

    const updatedQuestion = questionsRepository.items[0]

    expect(updatedQuestion).toMatchObject({
      title: 'Updated Question',
      content: 'This is the updated content of the question.',
      slug: { value: 'updated-question' },
    })

    expect(updatedQuestion.attachments.currentItems).toHaveLength(2)
    expect(updatedQuestion.attachments.currentItems).toEqual([
      expect.objectContaining({ attachmentId: new UniqueEntityId('1') }),
      expect.objectContaining({ attachmentId: new UniqueEntityId('3') }),
    ])
    expect(updatedQuestion.attachments.getRemovedItems()).toEqual([
      expect.objectContaining({ attachmentId: new UniqueEntityId('2') }),
    ])
    expect(updatedQuestion.attachments.getNewItems()).toEqual([
      expect.objectContaining({ attachmentId: new UniqueEntityId('3') }),
    ])
  })

  it('should not be able to edit a question from another author', async () => {
    const newQuestion = makeQuestion(
      { authorId: new UniqueEntityId('other-author') },
      new UniqueEntityId('question'),
    )
    questionsRepository.create(newQuestion)

    const result = await sut.execute({
      questionId: 'question',
      authorId: 'author',
      title: 'Updated Question',
      content: 'This is the updated content of the question.',
      attachmentsIds: [],
    })

    expect(result.isLeft()).toBeTruthy()
    expect(result.value).toBeInstanceOf(NotAllowedError)

    expect(questionsRepository.items[0]).not.toMatchObject({
      title: 'Updated Question',
      content: 'This is the updated content of the question.',
      slug: { value: 'updated-question' },
    })
  })
})
