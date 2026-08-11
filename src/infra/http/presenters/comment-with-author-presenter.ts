import { CommentWithAuthor } from '@/domain/forum/enterprice/entities/value-objects/comment-with-author'

// A presenter layer can alter the input value to any formatted as requested by consumers
export class CommentWithAuthorPresenter {
  static toHTTP(commentWithAuthor: CommentWithAuthor) {
    return {
      commentId: commentWithAuthor.commentId.toString(),
      content: commentWithAuthor.content,
      createdAt: commentWithAuthor.createdAt,
      updatedAt: commentWithAuthor.updatedAt,
      author: {
        id: commentWithAuthor.authorId.toString(),
        name: commentWithAuthor.author,
      },
    }
  }
}
