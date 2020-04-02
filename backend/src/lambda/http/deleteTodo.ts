import 'source-map-support/register';

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import * as middy from 'middy';
import { cors } from 'middy/middlewares';
import { deleteTodo } from '../../businessLogic/todos';
import { getUserId } from '../utils';
import { createLogger } from '../../utils/logger';

const logger = createLogger('deleteTodo');

export const handler = middy(async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  logger.info('Processing event', event);
  const todoId = event.pathParameters.todoId;
  const userId = getUserId(event);

  await deleteTodo(todoId, userId);

  return {
    statusCode: 200,
    body: ''
  };
});

handler.use(
  cors({
    credentials: true
  })
);
