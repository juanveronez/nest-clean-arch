import { FakeUploader } from '@/test/storage/uploader'
import { InMemoryAttachmentsRepository } from './../../../../test/repositories/in-memory-attachments-repository'
import { InvalidAttachmentTypeError } from './errors/invalid-attachment-type-error'
import { UploadAttachmentUseCase } from './upload-attachment'

describe('Upload Attachment', () => {
  let inMemoryAttachmentsRepository: InMemoryAttachmentsRepository
  let fakeUploader: FakeUploader
  let sut: UploadAttachmentUseCase

  beforeEach(() => {
    inMemoryAttachmentsRepository = new InMemoryAttachmentsRepository()
    fakeUploader = new FakeUploader()
    sut = new UploadAttachmentUseCase(
      inMemoryAttachmentsRepository,
      fakeUploader,
    )
  })

  it('should be able to upload an attachment', async () => {
    const result = await sut.execute({
      fileName: 'profile.png',
      fileType: 'image/png',
      body: Buffer.from(''),
    })

    expect(result.isRight()).toBeTruthy()
    expect(result.value).toEqual({
      attachment: inMemoryAttachmentsRepository.items[0],
    })

    expect(fakeUploader.items).toEqual([
      expect.objectContaining({
        fileName: 'profile.png',
      }),
    ])
  })

  it('should not be able to upload an attachment with invalid file type', async () => {
    const result = await sut.execute({
      fileName: 'music.mp3',
      fileType: 'audio/mpeg',
      body: Buffer.from(''),
    })

    expect(result.isLeft()).toBeTruthy()
    expect(result.value).toBeInstanceOf(InvalidAttachmentTypeError)
  })
})
