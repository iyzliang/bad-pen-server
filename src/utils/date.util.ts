import dayjs from 'dayjs';

/**
 * 格式化时间为 YYYY-MM-DD HH:mm:ss
 * @param date 日期对象，默认为当前时间
 * @returns 格式化后的时间字符串
 */
export function formatDateTime(date?: Date | string | number): string {
  return dayjs(date).format('YYYY-MM-DD HH:mm:ss');
}

