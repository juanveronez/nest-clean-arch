import { Injectable } from '@nestjs/common'
import { QuestionAttachmentsRepository } from '@/domain/forum/application/repository/question-attachments-repository'
import { QuestionAttachment } from '@/domain/forum/enterprice/entities/question-attachment'

@Injectable()
export class PrismaQuestionAttachmentsRepository
  implements QuestionAttachmentsRepository
{
  findManyByQuestionId(questionId: string): Promise<QuestionAttachment[]> {
    throw new Error('Method not implemented.')
  }
  deleteManyByQuestionId(questionId: string): Promise<void> {
    throw new Error('Method not implemented.')
  }
}
