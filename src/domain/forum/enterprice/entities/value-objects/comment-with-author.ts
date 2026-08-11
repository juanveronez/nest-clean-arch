import { ValueObject } from '@/core/entities/value-object'
import { UniqueEntityId } from '@/core/entities/value-objects/unique-entity-id'

export interface CommentWithAuthorProps {
  commentId: UniqueEntityId
  content: string
  authorId: UniqueEntityId
  author: string
  createdAt: Date
  updatedAt?: Date | null
}

/**
 * Here we have an example of object used to return some data specific for FE proposal, so it is necessary to fetch necessary data
 * It will be used when listing comments to list them with author.
 */
export class CommentWithAuthor extends ValueObject<CommentWithAuthorProps> {
  get commentId() {
    return this.props.commentId
  }

  get content() {
    return this.props.content
  }

  get authorId() {
    return this.props.authorId
  }

  get author() {
    return this.props.author
  }

  get createdAt() {
    return this.props.createdAt
  }

  get updatedAt() {
    return this.props.updatedAt
  }

  static create(props: CommentWithAuthorProps) {
    return new CommentWithAuthor(props)
  }
}
