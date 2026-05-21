import { Either, left, right } from './either'

describe('Either', () => {
  function makeEither(type: 'left' | 'right'): Either<'error', 'success'> {
    const isRight = type === 'right'
    return isRight ? right('success') : left('error')
  }

  test('success result', () => {
    const result = makeEither('right')

    expect(result.value).toEqual('success')

    expect(result.isLeft()).toBeFalsy()
    expect(result.isRight()).toBeTruthy()
  })

  test('error result', () => {
    const result = makeEither('left')

    expect(result.value).toEqual('error')

    expect(result.isLeft()).toBeTruthy()
    expect(result.isRight()).toBeFalsy()
  })
})
