import { UniqueEntityId } from '@/core/entities/value-objects/unique-entity-id'
import { QuestionDetails } from '@/domain/forum/enterprice/entities/value-objects/question-details'
import { Slug } from '@/domain/forum/enterprice/entities/value-objects/slug'
import {
  Attachment as PrismaAttachment,
  Question as PrismaQuestion,
  User as PrismaUser,
} from '../../../../../generated/prisma/client'
import { PrismaAttachmentMapper } from './prisma-attachment-mapper'

type PrismaQuestionDetails = PrismaQuestion & {
  attachments: PrismaAttachment[]
  author: PrismaUser
}

export class PrismaQuestionDetailsMapper {
  static toDomain(raw: PrismaQuestionDetails): QuestionDetails {
    return QuestionDetails.create({
      questionId: new UniqueEntityId(raw.id),
      slug: Slug.create(raw.slug),
      authorId: new UniqueEntityId(raw.authorId),
      title: raw.title,
      content: raw.content,
      bestAnswerId: raw.bestAnswerId
        ? new UniqueEntityId(raw.bestAnswerId)
        : undefined,
      createdAt: raw.createdAt,
      updatedAt: raw.updatedAt,
      author: raw.author.name,
      attachments: raw.attachments.map(PrismaAttachmentMapper.toDomain),
    })
  }
}
