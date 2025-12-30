import { Transform } from 'class-transformer';

export function ToNumber(defaultValue?: number) {
  return Transform(({ value }) => {
    const num = Number(value);
    if (value === '' || value === undefined || value === null || isNaN(num)) {
      return defaultValue ?? undefined;
    }
    return num;
  });
}
