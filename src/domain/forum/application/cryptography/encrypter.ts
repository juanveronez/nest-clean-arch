export abstract class Encryper {
  abstract encrypt(payload: Record<string, unknown>): Promise<string>
}
