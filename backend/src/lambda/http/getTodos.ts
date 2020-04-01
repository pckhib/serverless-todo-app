import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { getAllTodos } from '../../businessLogic/todos';
import * as middy from 'middy';
import { cors } from 'middy/middlewares';
import { getUserId } from '../utils';

export const handler = middy(async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const userId = getUserId(event);
  const todos = await getAllTodos(userId);

  return {
    statusCode: 201,
    body: JSON.stringify({
      items: todos
    })
  }
});

handler.use(
  cors({
    credentials: true
  })
);