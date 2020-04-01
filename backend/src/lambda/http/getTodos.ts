import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { getAllTodos } from '../../businessLogic/todos';
import * as middy from 'middy';
import { cors } from 'middy/middlewares';

export const handler = middy(async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const todos = await getAllTodos(event);

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