import { UniqueEntityId } from '@/core/entities/value-objects/unique-entity-id'
import { Student } from '@/domain/forum/enterprice/entities/student'
import { User as PrismaStudent } from '../../../../../generated/prisma/client'
import { UserUncheckedCreateInput } from '../../../../../generated/prisma/models'

export class PrismaStudentMapper {
  static toDomain(raw: PrismaStudent): Student {
    return Student.create(
      {
        name: raw.name,
        email: raw.email,
        password: raw.password,
      },
      new UniqueEntityId(raw.id),
    )
  }

  static toPersistence(student: Student): UserUncheckedCreateInput {
    return {
      name: student.name,
      email: student.email,
      password: student.password,
      role: 'STUDENT',
    }
  }
}
