export class InvalidAttachmentTypeError extends Error {
  constructor(fileType: string) {
    super(`File type "${fileType}" is not valid.`)
  }
}
