import { Module } from '@nestjs/common'
import { ReadNotificationUseCase } from '@/domain/notification/application/use-cases/read-notification'
import { SendNotificationUseCase } from '@/domain/notification/application/use-cases/send-notification'
import { OnAnswerCreated } from '@/domain/notification/subscribers/on-answer-created'
import { OnQuestionBestAnswerChosen } from '@/domain/notification/subscribers/on-question-best-answer-chosen'
import { DatabaseModule } from '../database/database.module'

@Module({
  imports: [DatabaseModule],
  providers: [
    OnAnswerCreated,
    OnQuestionBestAnswerChosen,
    ReadNotificationUseCase,
    SendNotificationUseCase,
  ],
})
export class EventsModule {}
