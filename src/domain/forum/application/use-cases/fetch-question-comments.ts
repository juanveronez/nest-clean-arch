import { Injectable } from '@nestjs/common'
import { Either, right } from '@/core/either'
import { CommentWithAuthor } from '../../enterprice/entities/value-objects/comment-with-author'
import { QuestionCommentsRepository } from '../repository/question-comments-repository'

interface FetchQuestionCommentsUseCaseRequest {
  questionId: string
  page: number
}

type FetchQuestionCommentsUseCaseResponse = Either<
  null,
  {
    comments: CommentWithAuthor[]
  }
>

@Injectable()
export class FetchQuestionCommentsUseCase {
  constructor(private questionCommentsRepository: QuestionCommentsRepository) {}

  async execute({
    questionId,
    page,
  }: FetchQuestionCommentsUseCaseRequest): Promise<FetchQuestionCommentsUseCaseResponse> {
    const comments =
      await this.questionCommentsRepository.findManyWithAuthorByQuestionId(
        questionId,
        {
          page,
        },
      )
    return right({ comments })
  }
}
