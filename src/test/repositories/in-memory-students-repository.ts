import { StudentsRepository } from '@/domain/forum/application/repository/students-repository'
import { Student } from '@/domain/forum/enterprice/entities/student'

export class InMemoryStudentsRepository implements StudentsRepository {
  items: Student[] = []

  async create(student: Student): Promise<void> {
    this.items.push(student)
  }

  async findByEmail(email: string): Promise<Student | null> {
    return this.items.find((student) => student.email === email) ?? null
  }
}
