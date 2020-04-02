import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import * as middy from 'middy';
import { cors } from 'middy/middlewares';

import { CreateTodoRequest } from '../../requests/CreateTodoRequest'
import { getUserId } from '../utils';
import { createTodo } from '../../businessLogic/todos';
import { createLogger } from '../../utils/logger';

const logger = createLogger('createTodo');

export const handler = middy(async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  logger.info('Processing event', event);
  const newTodo: CreateTodoRequest = JSON.parse(event.body);
  const userId = getUserId(event);
  const newItem = await createTodo(newTodo, userId);

  return {
    statusCode: 201,
    body: JSON.stringify({
      item: newItem
    })
  }
});

handler.use(
  cors({
    credentials: true
  })
);
