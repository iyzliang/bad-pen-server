import { randomBytes } from 'crypto';

/**
 * 生成指定长度的随机字符串
 * @param length 字符串长度，默认为 8
 * @returns 随机字符串（包含数字、大写字母、小写字母）
 * @example
 * generateRandomString() // 生成 8 位随机字符串
 * generateRandomString(16) // 生成 16 位随机字符串
 */
export function generateRandomString(length: number = 8): string {
  if (length <= 0) {
    throw new Error('长度必须大于 0');
  }

  // 字符集：数字 + 大写字母 + 小写字母
  const chars =
    '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
  const charsLength = chars.length;
  let result = '';

  // 使用 crypto.randomBytes 生成安全的随机字节
  const randomBytesBuffer = randomBytes(length);

  for (let i = 0; i < length; i++) {
    // 将字节值映射到字符集索引
    result += chars[randomBytesBuffer[i] % charsLength];
  }

  return result;
}
