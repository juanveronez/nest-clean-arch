import { Injectable } from '@nestjs/common'
import { StudentsRepository } from '@/domain/forum/application/repository/students-repository'
import { Student } from '@/domain/forum/enterprice/entities/student'
import { PrismaStudentMapper } from '../mappers/prisma-student-mapper'
import { PrismaService } from '../prisma.service'

@Injectable()
export class PrismaStudentsRepository implements StudentsRepository {
  constructor(private prisma: PrismaService) {}

  async create(student: Student): Promise<void> {
    const data = PrismaStudentMapper.toPersistence(student)
    await this.prisma.user.create({ data })
  }

  async findByEmail(email: string): Promise<Student | null> {
    const student = await this.prisma.user.findUnique({ where: { email } })

    if (!student) return null
    return PrismaStudentMapper.toDomain(student)
  }
}
