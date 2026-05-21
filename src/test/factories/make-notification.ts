import { faker } from '@faker-js/faker'
import { UniqueEntityId } from '@/core/entities/value-objects/unique-entity-id'
import {
  Notification,
  NotificationProps,
} from '@/domain/notification/enterprise/entities/notification'

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
