import { DomainEvents } from '@/core/events/domain-events'
import { EventHandler } from '@/core/events/event-handler'
import { QuestionsRepository } from '@/domain/forum/application/repository/questions-repository'
import { AnswerCreatedEvent } from '@/domain/forum/events/answer-created-event'
import { SendNotificationUseCase } from '../application/use-cases/send-notification'

export class OnAnswerCreated implements EventHandler {
  constructor(
    private questionsRepository: QuestionsRepository,
    private sendNotification: SendNotificationUseCase,
  ) {
    this.setupSubscriptions()
  }

  setupSubscriptions(): void {
    DomainEvents.register(
      // bind this is used to keep same `this` context inside `DomainEvents` context
      // necessary to use correct context inside `sendAnswerCreatedNotification` method
      this.sendAnswerCreatedNotification.bind(this),
      AnswerCreatedEvent.name,
    )
  }

  private async sendAnswerCreatedNotification({ answer }: AnswerCreatedEvent) {
    const question = await this.questionsRepository.findById(
      answer.questionId.toString(),
    )

    if (!question) return

    await this.sendNotification.execute({
      recipientId: question.authorId.toString(),
      title: `Nova resposta em "${question.title.substring(0, 40).concat('...')}"`,
      content: answer.excerpt,
    })
  }
}
