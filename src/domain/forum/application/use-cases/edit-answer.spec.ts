import { UniqueEntityId } from '@/core/entities/value-objects/unique-entity-id'
import { NotAllowedError } from '@/core/errors/not-allowed-error'
import { makeAnswer } from '@/test/factories/make-answer'
import { makeAnswerAttachment } from '@/test/factories/make-answer-attachment'
import { InMemoryAnswerAttachmentsRepository } from '@/test/repositories/in-memory-answer-attachments-repository'
import { InMemoryAnswersRepository } from '@/test/repositories/in-memory-answers-repository'
import { EditAnswerUseCase } from './edit-answer'

describe('Edit Answer', () => {
  let answersRepository: InMemoryAnswersRepository
  let answerAttachmentsRepository: InMemoryAnswerAttachmentsRepository
  let sut: EditAnswerUseCase

  beforeEach(() => {
    answerAttachmentsRepository = new InMemoryAnswerAttachmentsRepository()
    answersRepository = new InMemoryAnswersRepository(
      answerAttachmentsRepository,
    )
    sut = new EditAnswerUseCase(answersRepository, answerAttachmentsRepository)
  })

  it('should be able to edit a answer', async () => {
    const newAnswer = makeAnswer(
      { authorId: new UniqueEntityId('author') },
      new UniqueEntityId('answer'),
    )

    answersRepository.create(newAnswer)

    answerAttachmentsRepository.items.push(
      makeAnswerAttachment({
        answerId: newAnswer.id,
        attachmentId: new UniqueEntityId('1'),
      }),
      makeAnswerAttachment({
        answerId: newAnswer.id,
        attachmentId: new UniqueEntityId('2'),
      }),
    )

    const result = await sut.execute({
      answerId: 'answer',
      authorId: 'author',
      content: 'This is the updated content of the answer.',
      attachmentsIds: ['1', '3'],
    })

    expect(result.isRight()).toBeTruthy()

    const updatedAnswer = answersRepository.items[0]

    expect(updatedAnswer).toMatchObject({
      content: 'This is the updated content of the answer.',
    })
    expect(updatedAnswer.attachments.currentItems).toHaveLength(2)
    expect(updatedAnswer.attachments.currentItems).toEqual([
      expect.objectContaining({ attachmentId: new UniqueEntityId('1') }),
      expect.objectContaining({ attachmentId: new UniqueEntityId('3') }),
    ])
    expect(updatedAnswer.attachments.getRemovedItems()).toEqual([
      expect.objectContaining({ attachmentId: new UniqueEntityId('2') }),
    ])
    expect(updatedAnswer.attachments.getNewItems()).toEqual([
      expect.objectContaining({ attachmentId: new UniqueEntityId('3') }),
    ])
  })

  it('should not be able to edit a answer from another author', async () => {
    const newAnswer = makeAnswer(
      { authorId: new UniqueEntityId('other-author') },
      new UniqueEntityId('answer'),
    )
    answersRepository.create(newAnswer)

    const result = await sut.execute({
      answerId: 'answer',
      authorId: 'author',
      content: 'This is the updated content of the answer.',
      attachmentsIds: [],
    })

    expect(result.isLeft()).toBeTruthy()
    expect(result.value).toBeInstanceOf(NotAllowedError)

    expect(answersRepository.items[0]).not.toMatchObject({
      content: 'This is the updated content of the answer.',
    })
  })
})
