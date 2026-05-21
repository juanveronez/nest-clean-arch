import { Module } from '@nestjs/common'
import { CreateQuestionUseCase } from '@/domain/forum/application/use-cases/create-question'
import { DatabaseModule } from '../database/database.module'
import { AuthenticateController } from './controllers/authenticate.controller'
import { CreateAccountController } from './controllers/create-account.controller'
import { CreateQuestionController } from './controllers/create-question.controller'
import { FetchRecentQuestions } from './controllers/fetch-recent-questions.controller'

@Module({
  imports: [DatabaseModule],
  controllers: [
    AuthenticateController,
    CreateAccountController,
    CreateQuestionController,
    FetchRecentQuestions,
  ],
  providers: [CreateQuestionUseCase],
})
export class HttpModule {}
