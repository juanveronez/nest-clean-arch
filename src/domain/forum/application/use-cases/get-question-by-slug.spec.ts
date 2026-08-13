import { makeAttachment } from '@/test/factories/make-attachment'
import { makeQuestion } from '@/test/factories/make-question'
import { makeQuestionAttachment } from '@/test/factories/make-question-attachment'
import { makeStudent } from '@/test/factories/make-student'
import { InMemoryAttachmentsRepository } from '@/test/repositories/in-memory-attachments-repository'
import { InMemoryQuestionAttachmentsRepository } from '@/test/repositories/in-memory-question-attachments-repository'
import { InMemoryQuestionsRepository } from '@/test/repositories/in-memory-questions-repository'
import { InMemoryStudentsRepository } from '@/test/repositories/in-memory-students-repository'
import { Slug } from '../../enterprice/entities/value-objects/slug'
import { GetQuestionBySlugUseCase } from './get-question-by-slug'

describe('Get Question By Slug', () => {
  let questionsRepository: InMemoryQuestionsRepository
  let questionAttachmentsRepository: InMemoryQuestionAttachmentsRepository
  let attachmentsRepository: InMemoryAttachmentsRepository
  let studentsRepository: InMemoryStudentsRepository
  let sut: GetQuestionBySlugUseCase

  beforeEach(() => {
    questionAttachmentsRepository = new InMemoryQuestionAttachmentsRepository()
    attachmentsRepository = new InMemoryAttachmentsRepository()
    studentsRepository = new InMemoryStudentsRepository()
    questionsRepository = new InMemoryQuestionsRepository(
      questionAttachmentsRepository,
      attachmentsRepository,
      studentsRepository,
    )
    sut = new GetQuestionBySlugUseCase(questionsRepository)
  })

  it('should be able to get a question by its slug', async () => {
    const author = makeStudent({ name: 'John' })
    studentsRepository.items.push(author)

    const question = makeQuestion({
      authorId: author.id,
      title: 'New question',
      slug: Slug.create('new-question-slug'),
    })
    questionsRepository.create(question)

    const attachments = [
      makeAttachment({ title: 'Some attachment' }),
      makeAttachment({ title: 'Other attachment' }),
    ]
    attachmentsRepository.items.push(...attachments)

    const questionAttachments = attachments.map((att) =>
      makeQuestionAttachment({ questionId: question.id, attachmentId: att.id }),
    )
    questionAttachmentsRepository.items.push(...questionAttachments)

    const result = await sut.execute({
      slug: 'new-question-slug',
    })

    expect(result.isRight()).toBeTruthy()

    expect(result.value).toEqual({
      question: expect.objectContaining({
        questionId: question.id,
        author: 'John',
        title: 'New question',
        attachments: [
          expect.objectContaining({ title: 'Some attachment' }),
          expect.objectContaining({ title: 'Other attachment' }),
        ],
      }),
    })
  })
})
