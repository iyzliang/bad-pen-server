import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { UserEntity } from '@/admin/user/entities';

export const CurrentUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): UserEntity => {
    const request = ctx.switchToHttp().getRequest<{ user: UserEntity }>();
    return request.user;
  },
);
