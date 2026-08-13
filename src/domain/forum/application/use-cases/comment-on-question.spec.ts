import { makeQuestion } from '@/test/factories/make-question'
import { InMemoryAttachmentsRepository } from '@/test/repositories/in-memory-attachments-repository'
import { InMemoryQuestionAttachmentsRepository } from '@/test/repositories/in-memory-question-attachments-repository'
import { InMemoryQuestionCommentsRepository } from '@/test/repositories/in-memory-question-comments-repository'
import { InMemoryQuestionsRepository } from '@/test/repositories/in-memory-questions-repository'
import { InMemoryStudentsRepository } from '@/test/repositories/in-memory-students-repository'
import { CommentOnQuestionUseCase } from './comment-on-question'

describe('Comment On Question', () => {
  let questionsRepository: InMemoryQuestionsRepository
  let questionAttachmentsRepository: InMemoryQuestionAttachmentsRepository
  let questionCommentsRepository: InMemoryQuestionCommentsRepository
  let attachmentsRepository: InMemoryAttachmentsRepository
  let studentsRepository: InMemoryStudentsRepository
  let sut: CommentOnQuestionUseCase

  beforeEach(() => {
    questionAttachmentsRepository = new InMemoryQuestionAttachmentsRepository()
    attachmentsRepository = new InMemoryAttachmentsRepository()
    studentsRepository = new InMemoryStudentsRepository()
    questionsRepository = new InMemoryQuestionsRepository(
      questionAttachmentsRepository,
      attachmentsRepository,
      studentsRepository,
    )
    questionCommentsRepository = new InMemoryQuestionCommentsRepository(
      studentsRepository,
    )
    sut = new CommentOnQuestionUseCase(
      questionsRepository,
      questionCommentsRepository,
    )
  })

  it('should be able to comment on a question', async () => {
    const question = makeQuestion()
    await questionsRepository.create(question)

    const result = await sut.execute({
      authorId: '1',
      questionId: question.id.toString(),
      content: 'New comment',
    })

    expect(result.isRight()).toBeTruthy()
    expect(questionCommentsRepository.items[0].content).toEqual('New comment')
  })
})
