import { FakeHasher } from '@/test/cryptography/fake-hasher'
import { makeStudent } from '@/test/factories/make-student'
import { InMemoryStudentsRepository } from '@/test/repositories/in-memory-students-repository'
import { StudentAlreadyExistsError } from './errors/student-already-exists-error'
import { RegisterStudentUseCase } from './register-student'

describe('Register Student', () => {
  let inMemoryStudentsRepository: InMemoryStudentsRepository
  let fakeHasher: FakeHasher
  let sut: RegisterStudentUseCase

  beforeEach(() => {
    inMemoryStudentsRepository = new InMemoryStudentsRepository()
    fakeHasher = new FakeHasher()
    sut = new RegisterStudentUseCase(inMemoryStudentsRepository, fakeHasher)
  })

  it('should be able to register a new student', async () => {
    const result = await sut.execute({
      name: 'John Doe',
      email: 'johndoe@email.com',
      password: '123456',
    })

    expect(result.isRight()).toBeTruthy()
    expect(result.value).toEqual({
      student: inMemoryStudentsRepository.items[0],
    })
  })

  it('should hash student password upon registration', async () => {
    const result = await sut.execute({
      name: 'John Doe',
      email: 'johndoe@email.com',
      password: '123456',
    })

    const hashedPassword = await fakeHasher.hash('123456')

    expect(result.isRight()).toBeTruthy()
    expect(inMemoryStudentsRepository.items[0].password).toEqual(hashedPassword)
  })

  it('should not be able to register a student with an already used email', async () => {
    const student = makeStudent({ email: 'johndoe@email.com' })
    inMemoryStudentsRepository.items.push(student)

    const result = await sut.execute({
      name: 'John Doe',
      email: 'johndoe@email.com',
      password: '123456',
    })

    expect(result.isLeft()).toBeTruthy()
    expect(result.value).toBeInstanceOf(StudentAlreadyExistsError)
  })
})
