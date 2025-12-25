import * as bcrypt from 'bcrypt';

/**
 * 加密密码
 * @param password 密码
 * @returns 加密后的密码
 */
export function hashPassword(password: string): string {
  return bcrypt.hashSync(password, 10);
}

/**
 * 比较密码
 * @param password 密码
 * @param hashedPassword 加密后的密码
 * @returns 是否匹配
 */
export function comparePassword(
  password: string,
  hashedPassword: string,
): boolean {
  return bcrypt.compareSync(password, hashedPassword);
}
