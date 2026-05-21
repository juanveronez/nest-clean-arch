/**
 * Make some properties of T optional
 *
 * @example
 * interface User {
 *   id: string;
 *   name: string;
 *   email: string;
 * }
 *
 * type UserWithOptionalEmail = Optional<User, 'email'>;
 * // Result: { id: string; name: string; email?: string; }
 */
export type Optional<T, K extends keyof T> = Pick<Partial<T>, K> & Omit<T, K>
