import { UniqueEntityId } from '@/core/entities/value-objects/unique-entity-id'
import { Notification } from '@/domain/notification/enterprise/entities/notification'
import { Notification as PrismaNotification } from '../../../../../generated/prisma/client'
import { NotificationUncheckedCreateInput } from '../../../../../generated/prisma/models'

export class PrismaNotificationMapper {
  static toDomain(raw: PrismaNotification): Notification {
    return Notification.create(
      {
        title: raw.title,
        content: raw.content,
        recipientId: new UniqueEntityId(raw.recipientId),
        readAt: raw.reatAt,
        createdAt: raw.createdAt,
      },
      new UniqueEntityId(raw.id),
    )
  }

  static toPersistence(
    notification: Notification,
  ): NotificationUncheckedCreateInput {
    return {
      id: notification.id.toString(),
      recipientId: notification.recipientId.toString(),
      title: notification.title,
      content: notification.content,
      createdAt: notification.createdAt,
      reatAt: notification.readAt,
    }
  }
}
