import { UniqueEntityId } from '@/core/entities/value-objects/unique-entity-id'
import { InMemoryAttachmentsRepository } from '@/test/repositories/in-memory-attachments-repository'
import { InMemoryQuestionAttachmentsRepository } from '@/test/repositories/in-memory-question-attachments-repository'
import { InMemoryQuestionsRepository } from '@/test/repositories/in-memory-questions-repository'
import { InMemoryStudentsRepository } from '@/test/repositories/in-memory-students-repository'
import { CreateQuestionUseCase } from './create-question'

describe('Create Question', () => {
  let questionsRepository: InMemoryQuestionsRepository
  let questionAttachmentsRepository: InMemoryQuestionAttachmentsRepository
  let attachmentsRepository: InMemoryAttachmentsRepository
  let studentsRepository: InMemoryStudentsRepository
  let sut: CreateQuestionUseCase

  beforeEach(() => {
    questionAttachmentsRepository = new InMemoryQuestionAttachmentsRepository()
    attachmentsRepository = new InMemoryAttachmentsRepository()
    studentsRepository = new InMemoryStudentsRepository()
    questionsRepository = new InMemoryQuestionsRepository(
      questionAttachmentsRepository,
      attachmentsRepository,
      studentsRepository,
    )
    sut = new CreateQuestionUseCase(questionsRepository)
  })

  it('should be able to create a question', async () => {
    const result = await sut.execute({
      authorId: '1',
      content: 'New question content',
      title: 'New question title',
      attachmentsIds: [],
    })

    expect(result.isRight()).toBeTruthy()
    expect(questionsRepository.items[0].id).toEqual(result.value?.question.id)
  })

  it('should be able to create a question with attachments', async () => {
    const result = await sut.execute({
      authorId: '1',
      content: 'New question content',
      title: 'New question title',
      attachmentsIds: ['1', '2'],
    })

    expect(result.isRight()).toBeTruthy()
    expect(questionsRepository.items[0].attachments.currentItems).toHaveLength(
      2,
    )
    expect(questionsRepository.items[0].attachments.currentItems).toEqual([
      expect.objectContaining({ attachmentId: new UniqueEntityId('1') }),
      expect.objectContaining({ attachmentId: new UniqueEntityId('2') }),
    ])
  })

  it('should persist attachments when creating a new question', async () => {
    const result = await sut.execute({
      authorId: '1',
      content: 'New question content',
      title: 'New question title',
      attachmentsIds: ['1', '2'],
    })

    expect(result.isRight()).toBeTruthy()
    expect(questionAttachmentsRepository.items).toHaveLength(2)
    expect(questionAttachmentsRepository.items).toEqual([
      expect.objectContaining({ attachmentId: new UniqueEntityId('1') }),
      expect.objectContaining({ attachmentId: new UniqueEntityId('2') }),
    ])
  })
})
