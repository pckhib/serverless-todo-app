import * as AWS from 'aws-sdk';
import * as AWSXRay from 'aws-xray-sdk';

const XAWS = AWSXRay.captureAWS(AWS);

import { TodoItem } from '../models/TodoItem';
import { DocumentClient } from 'aws-sdk/clients/dynamodb';

export class TodosAccess {

  constructor(
    private readonly docClient: DocumentClient = createDynamoDBClient(),
    private readonly todosTable = process.env.TODOS_TABLE,
    private readonly todoIndex = process.env.TODO_INDEX
  ) {}

  async getAllTodos(userId: string): Promise<TodoItem[]> {
    console.log('Getting all todos for user ', userId);

    const result = await this.docClient.query({
      TableName: this.todosTable,
      IndexName: this.todoIndex,
      KeyConditionExpression: 'userId = :userId',
      ExpressionAttributeValues: {
        ':userId': userId
      }
    }).promise();

    const items = result.Items;
    return items as TodoItem[];
  }
}

function createDynamoDBClient() {
  if (process.env.IS_OFFLINE) {
    console.log('Creating a local DynamoDB instance');
    return new XAWS.DynamoDB.DocumentClient({
      region: 'localhost',
      endpoint: 'http://localhost:8000'
    });
  }

  return new XAWS.DynamoDB.DocumentClient();
}