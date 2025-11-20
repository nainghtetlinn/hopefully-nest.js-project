import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';

export const GetLoggedInUser = createParamDecorator(
  (_, context: ExecutionContext) =>
    context.switchToHttp().getRequest<Request>().user,
);
