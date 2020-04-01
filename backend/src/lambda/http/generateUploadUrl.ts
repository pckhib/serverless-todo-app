import 'source-map-support/register';

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import * as middy from 'middy';
import { cors } from 'middy/middlewares';
import { generateUploadUrl } from '../../businessLogic/todos';
import { getUserId } from '../utils';

export const handler = middy(async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const todoId = event.pathParameters.todoId;
  const userId = getUserId(event);

  const uploadUrl = await generateUploadUrl(todoId, userId);

  return {
    statusCode: 200,
    body: JSON.stringify({
      uploadUrl
    })
  }
});

handler.use(
  cors({
    credentials: true
  })
);
