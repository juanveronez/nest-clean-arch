import { Injectable } from '@nestjs/common'
import { Either, right } from '@/core/either'
import { CommentWithAuthor } from '../../enterprice/entities/value-objects/comment-with-author'
import { AnswerCommentsRepository } from '../repository/answer-comments-repository'

interface FetchAnswerCommentsUseCaseRequest {
  answerId: string
  page: number
}

type FetchAnswerCommentsUseCaseResponse = Either<
  null,
  {
    comments: CommentWithAuthor[]
  }
>

@Injectable()
export class FetchAnswerCommentsUseCase {
  constructor(private answerCommentsRepository: AnswerCommentsRepository) {}

  async execute({
    answerId,
    page,
  }: FetchAnswerCommentsUseCaseRequest): Promise<FetchAnswerCommentsUseCaseResponse> {
    const comments =
      await this.answerCommentsRepository.findManyWithAuthorByAnswerId(
        answerId,
        {
          page,
        },
      )
    return right({ comments })
  }
}
