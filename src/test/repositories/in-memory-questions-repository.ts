import { DomainEvents } from '@/core/events/domain-events'
import {
  DEFAULT_PAGE_SIZE,
  PaginationParams,
} from '@/core/repositories/pagination-params'
import { QuestionsRepository } from '@/domain/forum/application/repository/questions-repository'
import { Question } from '@/domain/forum/enterprice/entities/question'
import { QuestionDetails } from '@/domain/forum/enterprice/entities/value-objects/question-details'
import { InMemoryAttachmentsRepository } from './in-memory-attachments-repository'
import { InMemoryQuestionAttachmentsRepository } from './in-memory-question-attachments-repository'
import { InMemoryStudentsRepository } from './in-memory-students-repository'

export class InMemoryQuestionsRepository implements QuestionsRepository {
  public items: Question[] = []

  constructor(
    private questionAttachmentsRepository: InMemoryQuestionAttachmentsRepository,
    private attachmentsRepository: InMemoryAttachmentsRepository,
    private studentsRepository: InMemoryStudentsRepository,
  ) {}

  async create(question: Question): Promise<void> {
    this.items.push(question)

    await this.questionAttachmentsRepository.createMany(
      question.attachments.getItems(),
    )

    DomainEvents.dispatchEventsForAggregate(question.id)
  }

  /**
   *   In memory repositories the entities are stored by reference.
   * So, when we update the entity properties, it is already updated in the repository.
   *
   *   And we use the questionAttachmentsRepository easily to alter attachments because it's
   * an watched list, an data structure used to simplify the oparations when altering an entity
   * in this case it isn't only an Watched list, but an Aggregated too, it mean that this watched
   * list is linked with an main entity Aggregator.
   */
  async save(question: Question): Promise<void> {
    await this.questionAttachmentsRepository.createMany(
      question.attachments.getNewItems(),
    )

    await this.questionAttachmentsRepository.deleteMany(
      question.attachments.getRemovedItems(),
    )

    DomainEvents.dispatchEventsForAggregate(question.id)
  }

  async findById(id: string): Promise<Question | null> {
    const question = this.items.find((item) => item.id.toString() === id)
    return question ?? null
  }

  async findDetailsBySlug(slug: string): Promise<QuestionDetails | null> {
    const question = this.items.find((item) => item.slug.value === slug)

    if (!question) return null

    const author = this.studentsRepository.items.find((author) =>
      author.id.equals(question.authorId),
    )

    if (!author)
      throw new Error(
        `Author with ID ${question.authorId.toString()} not found.`,
      )

    const questionAttachments = this.questionAttachmentsRepository.items.filter(
      (questionAttachment) => questionAttachment.questionId.equals(question.id),
    )

    const attachments = questionAttachments.map((questionAttachment) => {
      const attachment = this.attachmentsRepository.items.find((att) =>
        questionAttachment.attachmentId.equals(att.id),
      )

      if (!attachment)
        throw new Error(
          `Attachment with ID ${questionAttachment.attachmentId.toString()} not found.`,
        )
      return attachment
    })

    return QuestionDetails.create({
      questionId: question.id,
      content: question.content,
      title: question.title,
      slug: question.slug,
      createdAt: question.createdAt,
      updatedAt: question.updatedAt,
      bestAnswerId: question.bestAnswerId,
      authorId: author.id,
      author: author.name,
      attachments,
    })
  }

  async findManyRecent({ page }: PaginationParams): Promise<Question[]> {
    return this.items
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      .slice((page - 1) * DEFAULT_PAGE_SIZE, page * DEFAULT_PAGE_SIZE)
  }

  async delete(question: Question): Promise<void> {
    const itemIndex = this.items.indexOf(question)
    if (itemIndex > -1) this.items.splice(itemIndex, 1)

    await this.questionAttachmentsRepository.deleteManyByQuestionId(
      question.id.toString(),
    )
  }
}
