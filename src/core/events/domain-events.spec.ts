import { AggregateRoot } from '../entities/aggregate-root'
import { UniqueEntityId } from '../entities/value-objects/unique-entity-id'
import { DomainEvent } from './domain-event'
import { DomainEvents } from './domain-events'

class CustomAggregateCreated implements DomainEvent {
  ocurredAt: Date
  private aggregate: AggregateRoot<unknown>

  constructor(aggregate: AggregateRoot<unknown>) {
    this.aggregate = aggregate
    this.ocurredAt = new Date()
  }

  getAggregateId(): UniqueEntityId {
    return this.aggregate.id
  }
}

class CustomAggregate extends AggregateRoot<null> {
  static create() {
    const aggregate = new CustomAggregate(null)

    aggregate.addDomainEvent(new CustomAggregateCreated(aggregate))

    return aggregate
  }
}

describe('Domain Events', () => {
  it('should be possible to dispatch and listen to event', () => {
    const callbackSpy = vi.fn()
    DomainEvents.register(callbackSpy, CustomAggregateCreated.name)

    const aggregate = CustomAggregate.create()

    expect(callbackSpy).not.toBeCalled()
    expect(aggregate.domainEvents).toHaveLength(1)

    DomainEvents.dispatchEventsForAggregate(aggregate.id)

    expect(callbackSpy).toBeCalled()
    expect(aggregate.domainEvents).toHaveLength(0)
  })

  it('should be possible to dispatch and listen to events', () => {
    const callbackSpy = vi.fn()
    DomainEvents.register(callbackSpy, CustomAggregateCreated.name)

    const [aggregate0, aggregate1] = [
      CustomAggregate.create(),
      CustomAggregate.create(),
    ]

    expect(callbackSpy).not.toBeCalled()
    expect(aggregate0.domainEvents).toHaveLength(1)

    DomainEvents.dispatchEventsForAggregate(aggregate0.id)
    DomainEvents.dispatchEventsForAggregate(aggregate1.id)

    expect(callbackSpy).toBeCalledTimes(2)

    expect(aggregate0.domainEvents).toHaveLength(0)
    expect(aggregate0.domainEvents).toHaveLength(0)
  })
})
