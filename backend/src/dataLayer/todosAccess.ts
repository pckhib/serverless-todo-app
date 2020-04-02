import * as AWS from 'aws-sdk';
import * as AWSXRay from 'aws-xray-sdk';

const XAWS = AWSXRay.captureAWS(AWS);

import { TodoItem } from '../models/TodoItem';
import { DocumentClient } from 'aws-sdk/clients/dynamodb';
import { TodoUpdate } from '../models/TodoUpdate';
import { createLogger } from '../utils/logger';

export class TodosAccess {

  constructor(
    private readonly docClient: DocumentClient = createDynamoDBClient(),
    private readonly s3 = new XAWS.S3({signatureVersion: 'v4'}),
    private readonly todosTable = process.env.TODOS_TABLE,
    private readonly todoIndex = process.env.TODO_INDEX,
    private readonly s3Bucket = process.env.IMAGES_S3_BUCKET,
    private readonly urlExpiration = process.env.SIGNED_URL_EXPIRATION,
    private readonly logger = createLogger('todosAccess')
  ) {}

  async getAllTodos(userId: string): Promise<TodoItem[]> {
    this.logger.info('Getting all todos for user', userId);

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

  async createTodo(todoItem: TodoItem): Promise<TodoItem> {
    await this.docClient.put({
      TableName: this.todosTable,
      Item: todoItem
    }).promise();

    return todoItem;
  }

  async updateTodo(todoId: string, todoUpdate: TodoUpdate, userId: string): Promise<TodoUpdate> {
    await this.docClient.update({
      TableName: this.todosTable,
      Key: {
        todoId: todoId,
        userId: userId
      },
      UpdateExpression: 'set #name = :name, dueDate = :dueDate, done = :done',
      ExpressionAttributeNames: {
          '#name': 'name'
      },
      ExpressionAttributeValues: {
        ':name': todoUpdate.name,
        ':dueDate': todoUpdate.dueDate,
        ':done' : todoUpdate.done
      }
    }).promise();

    return todoUpdate;
  }

  async deleteTodo(todoId: string, userId: string) {
    await this.docClient.delete({
      TableName: this.todosTable,
      Key: {
        todoId: todoId,
        userId: userId
      }
    }).promise();
  }

  async addAttachmentUrl(todoId: string, userId: string) {
    const attachmentUrl = `https://${this.s3Bucket}.s3.amazonaws.com/${todoId}`;

    await this.docClient.update({
      TableName: this.todosTable,
      Key: {
        todoId: todoId,
        userId: userId
      },
      UpdateExpression: 'set #attachmentUrl = :attachmentUrl',
      ExpressionAttributeNames: {
        '#attachmentUrl': 'attachmentUrl'
      },
      ExpressionAttributeValues: {
        ':attachmentUrl': attachmentUrl
      }
    }).promise();
  }

  generateUploadUrl(todoId: string): string {
    return this.s3.getSignedUrl('putObject', {
      Bucket: this.s3Bucket,
      Key: todoId,
      Expires: this.urlExpiration
    });
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