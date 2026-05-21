import { UniqueEntityId } from '@/core/entities/value-objects/unique-entity-id'
import { InMemoryNotificationsRepository } from '@/test/repositories/in-memory-notifications-repository'
import { SendNotificationUseCase } from './send-notification'

describe('Send Notification', () => {
  let notificationsRepository: InMemoryNotificationsRepository
  let sut: SendNotificationUseCase

  beforeEach(() => {
    notificationsRepository = new InMemoryNotificationsRepository()
    sut = new SendNotificationUseCase(notificationsRepository)
  })

  it('should be able to send a notification', async () => {
    const result = await sut.execute({
      recipientId: '1',
      title: 'Notification title',
      content: 'Notification content',
    })

    expect(result.isRight()).toBeTruthy()

    expect(notificationsRepository.items).toHaveLength(1)
    expect(notificationsRepository.items[0]).toEqual(
      expect.objectContaining({
        title: 'Notification title',
        content: 'Notification content',
        recipientId: new UniqueEntityId('1'),
      }),
    )
  })
})
