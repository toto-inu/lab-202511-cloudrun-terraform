import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import * as admin from 'firebase-admin';

export const CurrentUser = createParamDecorator(
  (data: unknown, context: ExecutionContext): admin.auth.DecodedIdToken => {
    const gqlContext = GqlExecutionContext.create(context);
    const { req } = gqlContext.getContext();
    return req.user;
  },
);
