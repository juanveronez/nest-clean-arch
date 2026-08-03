import { Injectable } from '@nestjs/common'
import { AnswerAttachmentsRepository } from '@/domain/forum/application/repository/answer-attachments-repository'
import { AnswerAttachment } from '@/domain/forum/enterprice/entities/answer-attachment'
import { PrismaAnswerAttachmentMapper } from '../mappers/prisma-answer-attachment-mapper'
import { PrismaService } from '../prisma.service'

@Injectable()
export class PrismaAnswerAttachmentsRepository
  implements AnswerAttachmentsRepository
{
  constructor(private prisma: PrismaService) {}

  async createMany(attachments: AnswerAttachment[]): Promise<void> {
    if (!attachments.length) return

    const updateManyArgs =
      PrismaAnswerAttachmentMapper.toPersistenceUpdateMany(attachments)

    await this.prisma.attachment.updateMany(updateManyArgs)
  }

  async deleteMany(attachments: AnswerAttachment[]): Promise<void> {
    if (!attachments.length) return

    const attachmentIds = attachments.map((att) => att.id.toString())

    await this.prisma.attachment.deleteMany({
      where: { id: { in: attachmentIds } },
    })
  }

  async findManyByAnswerId(answerId: string): Promise<AnswerAttachment[]> {
    const attachments = await this.prisma.attachment.findMany({
      where: { answerId },
    })

    return attachments.map(PrismaAnswerAttachmentMapper.toDomain)
  }

  async deleteManyByAnswerId(answerId: string): Promise<void> {
    await this.prisma.attachment.deleteMany({ where: { answerId } })
  }
}
