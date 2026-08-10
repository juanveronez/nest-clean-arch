/**
 * A value object is used because when we are handling with an object with a mix of entities we don't have a id, or something to identify it.
 * So the better way to represent it is a value object
 */
export abstract class ValueObject<T> {
  protected props: T

  protected constructor(props: T) {
    this.props = props
  }

  public equals(vo: ValueObject<unknown>) {
    if (vo === null || vo === undefined) return false
    if (vo.props === undefined) return false

    return JSON.stringify(vo.props) === JSON.stringify(this.props)
  }
}
