import { QuestionAttachment } from '../../enterprice/entities/question-attachment'

export abstract class QuestionAttachmentsRepository {
  abstract findManyByQuestionId(
    questionId: string,
  ): Promise<QuestionAttachment[]>
  abstract deleteManyByQuestionId(questionId: string): Promise<void>
}
