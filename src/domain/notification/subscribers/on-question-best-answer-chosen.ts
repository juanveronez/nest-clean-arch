import { DomainEvents } from '@/core/events/domain-events'
import { EventHandler } from '@/core/events/event-handler'
import { AnswersRepository } from '@/domain/forum/application/repository/answers-repository'
import { QuestionBestQuestionChosenEvent } from '@/domain/forum/events/question-best-answer-chosen-event'
import { SendNotificationUseCase } from '../application/use-cases/send-notification'

export class OnQuestionBestAnswerChosen implements EventHandler {
  constructor(
    private answersRepository: AnswersRepository,
    private sendNotification: SendNotificationUseCase,
  ) {
    this.setupSubscriptions()
  }

  setupSubscriptions(): void {
    DomainEvents.register(
      this.sendQuestionBestAnswerChosenNotification.bind(this),
      QuestionBestQuestionChosenEvent.name,
    )
  }

  private async sendQuestionBestAnswerChosenNotification({
    question,
    bestAnswerId,
  }: QuestionBestQuestionChosenEvent) {
    const bestAnswer = await this.answersRepository.findById(
      bestAnswerId.toString(),
    )

    if (!bestAnswer) return

    this.sendNotification.execute({
      recipientId: bestAnswer.authorId.toString(),
      title: 'Sua resposta foi escolhida!',
      content: `A resposta que você enviou em "${question.title.substring(0, 20).concat('...')}" foi escolhida pelo autor!`,
    })
  }
}
