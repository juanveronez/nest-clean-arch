import { Module } from '@nestjs/common'
import { AnswerAttachmentsRepository } from '@/domain/forum/application/repository/answer-attachments-repository'
import { AnswerCommentsRepository } from '@/domain/forum/application/repository/answer-comments-repository'
import { AnswersRepository } from '@/domain/forum/application/repository/answers-repository'
import { QuestionAttachmentsRepository } from '@/domain/forum/application/repository/question-attachments-repository'
import { QuestionCommentsRepository } from '@/domain/forum/application/repository/question-comments-repository'
import { QuestionsRepository } from '@/domain/forum/application/repository/questions-repository'
import { StudentsRepository } from '@/domain/forum/application/repository/students-repository'
import { EnvService } from '../env/env.service'
import { PrismaService } from './prisma/prisma.service'
import { PrismaAnswerAttachmentsRepository } from './prisma/repositories/prisma-answer-attachments-repository'
import { PrismaAnswerCommentsRepository } from './prisma/repositories/prisma-answer-comments-repository'
import { PrismaAnswersRepository } from './prisma/repositories/prisma-answers-repository'
import { PrismaNotificationsRepository } from './prisma/repositories/prisma-notifications-repository'
import { PrismaQuestionAttachmentsRepository } from './prisma/repositories/prisma-question-attachments-repository'
import { PrismaQuestionCommentsRepository } from './prisma/repositories/prisma-question-comments-repository'
import { PrismaQuestionsRepository } from './prisma/repositories/prisma-questions-repository'
import { PrismaStudentsRepository } from './prisma/repositories/prisma-students-repository'

@Module({
  providers: [
    EnvService,
    PrismaService,
    {
      provide: AnswerAttachmentsRepository,
      useClass: PrismaAnswerAttachmentsRepository,
    },
    {
      provide: AnswerCommentsRepository,
      useClass: PrismaAnswerCommentsRepository,
    },
    { provide: AnswersRepository, useClass: PrismaAnswersRepository },
    PrismaNotificationsRepository,
    {
      provide: QuestionAttachmentsRepository,
      useClass: PrismaQuestionAttachmentsRepository,
    },
    {
      provide: QuestionCommentsRepository,
      useClass: PrismaQuestionCommentsRepository,
    },
    { provide: QuestionsRepository, useClass: PrismaQuestionsRepository },
    { provide: StudentsRepository, useClass: PrismaStudentsRepository },
  ],
  exports: [
    PrismaService,
    AnswerAttachmentsRepository,
    AnswerCommentsRepository,
    AnswersRepository,
    PrismaNotificationsRepository,
    QuestionAttachmentsRepository,
    QuestionCommentsRepository,
    QuestionsRepository,
    StudentsRepository,
  ],
})
export class DatabaseModule {}
