export abstract class HashGenerator {
  abstract compare(plain: string, hash: string): Promise<boolean>
}
