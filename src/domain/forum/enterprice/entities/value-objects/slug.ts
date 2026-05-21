export class Slug {
  public value: string

  private constructor(value: string) {
    this.value = value
  }

  static create(value: string) {
    return new Slug(value)
  }

  /**
   * Receives a string and normalize it as a slug
   *
   * Example: "An example title" -> "an-example-title"
   *
   * @param text {string}
   */
  static createFromText(text: string) {
    const slugText = text
      .normalize('NFKD') // Normalize accented characters
      .toLowerCase()
      .trim()
      .replace(/\s+/g, '-') // Replace spaces with "-"
      .replace(/[^\w-]+/g, '') // Remove all non-word chars
      .replace(/_/g, '-') // Replace underscores with "-"
      .replace(/--+/g, '-') // Replace multiple "-" with single "-"
      .replace(/-$/g, '') // Remove trailing "-"

    return new Slug(slugText)
  }
}
