import { QuestionDetails } from '@/domain/forum/enterprice/entities/value-objects/question-details'

export class QuestionDetailsPresenter {
  static toHTTP(question: QuestionDetails) {
    return {
      questionId: question.questionId.toString(),
      title: question.title,
      slug: question.slug.value,
      bestAnswerId: question.bestAnswerId?.toString(),
      createdAt: question.createdAt,
      updatedAt: question.updatedAt,
      author: {
        id: question.authorId.toString(),
        name: question.author,
      },
      attachments: question.attachments.map((att) => ({
        title: att.title,
        url: att.url,
      })),
    }
  }
}
