import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from 'class-validator';

/**
 * 密码强度验证约束
 * 要求：
 * - 长度6-16位
 * - 可以包含数字、英文大小写字母、特殊字符
 * - 不可以为纯数字
 */
@ValidatorConstraint({ name: 'isStrongPassword', async: false })
export class IsStrongPasswordConstraint implements ValidatorConstraintInterface {
  /**
   * 允许的特殊字符（可根据需求调整）
   */
  private readonly allowedSpecialChars = '!@#$%^&*()_+-=[]{}|;:,.<>?/~`';

  validate(value: any, args: ValidationArguments): boolean {
    if (typeof value !== 'string') {
      return false;
    }

    const password = value;

    // 1. 检查长度：6-16位
    if (password.length < 6 || password.length > 16) {
      return false;
    }

    // 2. 检查不能为纯数字
    if (/^\d+$/.test(password)) {
      return false;
    }

    // 3. 检查字符范围：只允许数字、大小写字母和特定特殊字符
    // 在字符类中，需要转义的特殊字符：] \ - ^
    const escapedSpecialChars = this.escapeForCharacterClass(
      this.allowedSpecialChars,
    );
    const allowedCharsRegex = new RegExp(
      `^[0-9A-Za-z${escapedSpecialChars}]+$`,
    );
    if (!allowedCharsRegex.test(password)) {
      return false;
    }

    return true;
  }

  defaultMessage(args: ValidationArguments): string {
    const value = args.value;

    if (typeof value !== 'string') {
      return '密码必须是字符串';
    }

    if (value.length < 6 || value.length > 16) {
      return '密码长度为6-16位';
    }

    if (/^\d+$/.test(value)) {
      return '密码不能为纯数字';
    }

    return '密码只能包含数字、英文大小写字母和特殊字符';
  }

  /**
   * 为字符类转义特殊字符
   * 在字符类 [] 中，需要转义的字符：] \ - ^
   */
  private escapeForCharacterClass(str: string): string {
    return str
      .replace(/\\/g, '\\\\') // 先转义反斜杠
      .replace(/]/g, '\\]') // 转义右方括号
      .replace(/-/g, '\\-') // 转义连字符
      .replace(/\^/g, '\\^'); // 转义脱字符（放在开头或结尾也可以，但转义更安全）
  }
}

/**
 * 密码强度验证装饰器
 * @param validationOptions 验证选项
 * @example
 * class RegisterDto {
 *   @IsStrongPassword({ message: '密码不符合要求' })
 *   password: string;
 * }
 */
export function IsStrongPassword(
  validationOptions?: ValidationOptions,
): PropertyDecorator {
  return function (object: object, propertyName: string | symbol) {
    registerDecorator({
      name: 'isStrongPassword',
      target: object.constructor,
      propertyName: propertyName as string,
      options: validationOptions,
      constraints: [],
      validator: IsStrongPasswordConstraint,
    });
  };
}
