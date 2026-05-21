import { Either, right } from '@/core/either'
import { UniqueEntityId } from '@/core/entities/value-objects/unique-entity-id'
import { Question } from '../../enterprice/entities/question'
import { QuestionAttachment } from '../../enterprice/entities/question-attachment'
import { QuestionAttachmentList } from '../../enterprice/entities/question-attachment-list'
import { QuestionsRepository } from '../repository/questions-repository'

interface CreateQuestionUseCaseRequest {
  authorId: string
  title: string
  content: string
  attachmentsIds: string[]
}

type CreateQuestionUseCaseResponse = Either<
  null,
  {
    question: Question
  }
>

export class CreateQuestionUseCase {
  constructor(private questionsRepository: QuestionsRepository) {}

  async execute({
    authorId,
    title,
    content,
    attachmentsIds,
  }: CreateQuestionUseCaseRequest): Promise<CreateQuestionUseCaseResponse> {
    const question = Question.create({
      authorId: new UniqueEntityId(authorId),
      title,
      content,
    })

    const attachments = attachmentsIds.map((id) =>
      QuestionAttachment.create({
        attachmentId: new UniqueEntityId(id),
        questionId: question.id,
      }),
    )

    question.attachments = new QuestionAttachmentList(attachments)

    await this.questionsRepository.create(question)

    return right({ question })
  }
}
