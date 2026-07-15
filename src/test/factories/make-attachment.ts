import { faker } from '@faker-js/faker'
import { Injectable } from '@nestjs/common'
import { UniqueEntityId } from '@/core/entities/value-objects/unique-entity-id'
import {
  Attachment,
  AttachmentProps,
} from '@/domain/forum/enterprice/entities/attachment'
import { PrismaAttachmentMapper } from '@/infra/database/prisma/mappers/prisma-attachment-mapper'
import { PrismaService } from '@/infra/database/prisma/prisma.service'

/**
 * Use Factory Pattern to create a Attachment object.
 * By default object properties are generated with faker, to avoid objects with the same values.
 *
 * @param override optional object properties to override the default values
 * @param id optional unique entity id to create an object with a specific id
 * @returns a Attachment object
 */
export function makeAttachment(
  override: Partial<AttachmentProps> = {},
  id?: UniqueEntityId,
): Attachment {
  return Attachment.create(
    {
      title: faker.system.fileName(),
      url: faker.internet.url(),
      ...override,
    },
    id,
  )
}

@Injectable()
export class AttachmentFactory {
  constructor(private prisma: PrismaService) {}

  async make(data: Partial<AttachmentProps> = {}): Promise<Attachment> {
    const attachment = makeAttachment(data)

    await this.prisma.attachment.create({
      data: PrismaAttachmentMapper.toPersistence(attachment),
    })

    return attachment
  }
}
