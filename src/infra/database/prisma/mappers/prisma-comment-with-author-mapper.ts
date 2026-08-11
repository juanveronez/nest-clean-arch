import { UniqueEntityId } from '@/core/entities/value-objects/unique-entity-id'
import { CommentWithAuthor } from '@/domain/forum/enterprice/entities/value-objects/comment-with-author'
import {
  Comment as PrismaComment,
  User as PrismaUser,
} from '../../../../../generated/prisma/client'

type PrismaCommentWithAuthor = PrismaComment & {
  author: Pick<PrismaUser, 'name'>
}

export class PrismaCommentWithAuthorMapper {
  static toDomain(raw: PrismaCommentWithAuthor): CommentWithAuthor {
    return CommentWithAuthor.create({
      commentId: new UniqueEntityId(raw.id),
      content: raw.content,
      createdAt: raw.createdAt,
      updatedAt: raw.updatedAt,
      authorId: new UniqueEntityId(raw.authorId),
      author: raw.author.name,
    })
  }
}
