import { faker } from '@faker-js/faker'
import { Injectable } from '@nestjs/common'
import { UniqueEntityId } from '@/core/entities/value-objects/unique-entity-id'
import { Answer, AnswerProps } from '@/domain/forum/enterprice/entities/answer'
import { PrismaAnswerMapper } from '@/infra/database/prisma/mappers/prisma-answer-mapper'
import { PrismaService } from '@/infra/database/prisma/prisma.service'

/**
 * Use Factory Pattern to create a answer object.
 * By default object properties are generated with faker, to avoid objects with the same values.
 *
 * @param override optional object properties to override the default values
 * @param id optional unique entity id to create an object with a specific id
 * @returns a answer object
 */
export function makeAnswer(
  override: Partial<AnswerProps> = {},
  id?: UniqueEntityId,
): Answer {
  return Answer.create(
    {
      authorId: new UniqueEntityId(),
      questionId: new UniqueEntityId(),
      content: faker.lorem.text(),
      ...override,
    },
    id,
  )
}

@Injectable()
export class AnswerFactory {
  constructor(private prisma: PrismaService) {}

  async makePrismaAnswer(data: Partial<AnswerProps> = {}): Promise<Answer> {
    const answer = makeAnswer(data)

    await this.prisma.answer.create({
      data: PrismaAnswerMapper.toPersistence(answer),
    })

    return answer
  }
}
