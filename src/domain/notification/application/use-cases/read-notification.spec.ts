import { UniqueEntityId } from '@/core/entities/value-objects/unique-entity-id'
import { NotAllowedError } from '@/core/errors/not-allowed-error'
import { makeNotification } from '@/test/factories/make-notification'
import { InMemoryNotificationsRepository } from '@/test/repositories/in-memory-notifications-repository'
import { ReadNotificationUseCase } from './read-notification'

describe('Read Notification', () => {
  let notificationsRepository: InMemoryNotificationsRepository
  let sut: ReadNotificationUseCase

  beforeEach(() => {
    notificationsRepository = new InMemoryNotificationsRepository()
    sut = new ReadNotificationUseCase(notificationsRepository)
  })

  it('should be able to read a notification', async () => {
    const notification = makeNotification({
      recipientId: new UniqueEntityId('me'),
    })

    await notificationsRepository.create(notification)

    expect(notificationsRepository.items[0].readAt).toBeUndefined()

    const result = await sut.execute({
      recipientId: 'me',
      notificationId: notification.id.toString(),
    })

    expect(result.isRight()).toBeTruthy()
    expect(notificationsRepository.items[0].readAt).toEqual(expect.any(Date))
  })

  it('should not be able to read a notification from other one', async () => {
    const notification = makeNotification({
      recipientId: new UniqueEntityId('other-one'),
    })

    await notificationsRepository.create(notification)

    const result = await sut.execute({
      recipientId: 'me',
      notificationId: notification.id.toString(),
    })

    expect(result.isLeft()).toBeTruthy()
    expect(result.value).toBeInstanceOf(NotAllowedError)
  })
})
