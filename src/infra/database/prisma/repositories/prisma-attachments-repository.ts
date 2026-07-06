import { Injectable } from '@nestjs/common'
import { AttachmentsRepository } from '@/domain/forum/application/repository/attachments-repository'
import { Attachment } from '@/domain/forum/enterprice/entities/attachment'
import { PrismaAttachmentMapper } from '../mappers/prisma-attachment-mapper'
import { PrismaService } from '../prisma.service'

@Injectable()
export class PrismaAttachmentsRepository implements AttachmentsRepository {
  constructor(private prisma: PrismaService) {}

  async create(attachment: Attachment): Promise<void> {
    const data = PrismaAttachmentMapper.toPersistence(attachment)

    await this.prisma.attachment.create({ data })
  }
}
