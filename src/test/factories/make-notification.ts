import { faker } from '@faker-js/faker'
import { Injectable } from '@nestjs/common'
import { UniqueEntityId } from '@/core/entities/value-objects/unique-entity-id'
import {
  Notification,
  NotificationProps,
} from '@/domain/notification/enterprise/entities/notification'
import { PrismaNotificationMapper } from '@/infra/database/prisma/mappers/prisma-notification-mapper'
import { PrismaService } from '@/infra/database/prisma/prisma.service'

export function makeNotification(
  override: Partial<NotificationProps>,
  id?: UniqueEntityId,
) {
  return Notification.create(
    {
      title: faker.lorem.sentence(),
      content: faker.lorem.text(),
      recipientId: new UniqueEntityId(),
      ...override,
    },
    id,
  )
}

@Injectable()
export class NotificationFactory {
  constructor(private prisma: PrismaService) {}

  async make(data: Partial<NotificationProps> = {}): Promise<Notification> {
    const notification = makeNotification(data)

    await this.prisma.notification.create({
      data: PrismaNotificationMapper.toPersistence(notification),
    })

    return notification
  }
}
