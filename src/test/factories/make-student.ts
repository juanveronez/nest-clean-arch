import { faker } from '@faker-js/faker'
import { UniqueEntityId } from '@/core/entities/value-objects/unique-entity-id'
import {
  Student,
  StudentProps,
} from '@/domain/forum/enterprice/entities/student'

export function makeStudent(
  override: Partial<StudentProps> = {},
  id?: UniqueEntityId,
): Student {
  return Student.create(
    {
      name: faker.person.fullName(),
      email: faker.internet.email(),
      password: faker.internet.password(),
      ...override,
    },
    id,
  )
}
