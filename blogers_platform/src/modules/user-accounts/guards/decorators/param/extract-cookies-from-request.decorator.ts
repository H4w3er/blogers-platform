import { createParamDecorator, ExecutionContext } from "@nestjs/common";

export const ExtractCookieFromRequest = createParamDecorator(
  (data: string, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return {
      refreshToken: data ? request.cookies?.[data] : request.cookies,
      ip: request.headers['user-agent'],
      title: request.headers['x-forwarded-for'],
    };
  },
);
