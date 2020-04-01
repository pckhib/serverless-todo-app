import { TodosAccess } from "../dataLayer/todosAccess";
import { TodoItem } from "../models/TodoItem";
import { getUserId } from "../lambda/utils";
import { APIGatewayProxyEvent } from "aws-lambda";

const todosAccess = new TodosAccess();

export async function getAllTodos(event: APIGatewayProxyEvent): Promise<TodoItem[]> {
  const userId = getUserId(event);
  return todosAccess.getAllTodos(userId);
}