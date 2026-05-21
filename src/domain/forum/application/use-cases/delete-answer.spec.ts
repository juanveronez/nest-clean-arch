import { UniqueEntityId } from '@/core/entities/value-objects/unique-entity-id'
import { NotAllowedError } from '@/core/errors/not-allowed-error'
import { makeAnswer } from '@/test/factories/make-answer'
import { makeAnswerAttachment } from '@/test/factories/make-answer-attachment'
import { InMemoryAnswerAttachmentsRepository } from '@/test/repositories/in-memory-answer-attachments-repository'
import { InMemoryAnswersRepository } from '@/test/repositories/in-memory-answers-repository'
import { DeleteAnswerUseCase } from './delete-answer'

describe('Delete Answer', () => {
  let answersRepository: InMemoryAnswersRepository
  let answerAttachmentsRepository: InMemoryAnswerAttachmentsRepository
  let sut: DeleteAnswerUseCase

  beforeEach(() => {
    answerAttachmentsRepository = new InMemoryAnswerAttachmentsRepository()
    answersRepository = new InMemoryAnswersRepository(
      answerAttachmentsRepository,
    )
    sut = new DeleteAnswerUseCase(answersRepository)
  })

  it('should be able to delete a answer', async () => {
    const newAnswer = makeAnswer(
      { authorId: new UniqueEntityId('author') },
      new UniqueEntityId('answer'),
    )
    answersRepository.create(newAnswer)

    answerAttachmentsRepository.items.push(
      makeAnswerAttachment({ answerId: newAnswer.id }),
      makeAnswerAttachment({ answerId: newAnswer.id }),
    )

    expect(answersRepository.items).toContain(newAnswer)

    await sut.execute({ answerId: 'answer', authorId: 'author' })

    expect(answersRepository.items).not.toContain(newAnswer)
    expect(answersRepository.items).toHaveLength(0)
    expect(answerAttachmentsRepository.items).toHaveLength(0)
  })

  it('should not be able to delete a answer from another author', async () => {
    const newAnswer = makeAnswer(
      { authorId: new UniqueEntityId('other-author') },
      new UniqueEntityId('answer'),
    )
    answersRepository.create(newAnswer)

    answerAttachmentsRepository.items.push(
      makeAnswerAttachment({ answerId: newAnswer.id }),
      makeAnswerAttachment({ answerId: newAnswer.id }),
    )

    expect(answersRepository.items).toContain(newAnswer)

    const result = await sut.execute({ answerId: 'answer', authorId: 'author' })

    expect(result.isLeft()).toBeTruthy()
    expect(result.value).toBeInstanceOf(NotAllowedError)

    expect(answersRepository.items).toContain(newAnswer)
    expect(answersRepository.items).toHaveLength(1)
    expect(answerAttachmentsRepository.items).toHaveLength(2)
  })
})
