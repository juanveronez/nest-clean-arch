import { ValueObject } from '@/core/entities/value-object'
import { UniqueEntityId } from '@/core/entities/value-objects/unique-entity-id'
import { Attachment } from '../attachment'
import { Slug } from './slug'

interface QuestionDetailsProps {
  questionId: UniqueEntityId
  title: string
  content: string
  slug: Slug
  createdAt: Date
  updatedAt?: Date
  authorId: UniqueEntityId
  author: string
  attachments: Attachment[]
  bestAnswerId?: UniqueEntityId
}

export class QuestionDetails extends ValueObject<QuestionDetailsProps> {
  get questionId() {
    return this.props.questionId
  }

  get title() {
    return this.props.title
  }

  get content() {
    return this.props.content
  }

  get slug() {
    return this.props.slug
  }

  get createdAt() {
    return this.props.createdAt
  }

  get updatedAt() {
    return this.props.updatedAt
  }

  get authorId() {
    return this.props.authorId
  }

  get author() {
    return this.props.author
  }

  get attachments() {
    return this.props.attachments
  }

  get bestAnswerId() {
    return this.props.bestAnswerId
  }

  static create(props: QuestionDetailsProps) {
    return new QuestionDetails(props)
  }
}
