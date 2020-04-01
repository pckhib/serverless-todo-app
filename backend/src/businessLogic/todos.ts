import * as uuid from 'uuid';
import { TodosAccess } from "../dataLayer/todosAccess";
import { TodoItem } from "../models/TodoItem";
import { CreateTodoRequest } from "../requests/CreateTodoRequest";
import { TodoUpdate } from '../models/TodoUpdate';
import { UpdateTodoRequest } from '../requests/UpdateTodoRequest';

const todosAccess = new TodosAccess();

export async function getAllTodos(userId: string): Promise<TodoItem[]> {
  return todosAccess.getAllTodos(userId);
}

export async function createTodo(createTodoRequest: CreateTodoRequest, userId: string): Promise<TodoItem> {
  const itemId = uuid.v4();

  return await todosAccess.createTodo({
    userId: userId,
    todoId: itemId,
    createdAt: new Date().toISOString(),
    name: createTodoRequest.name,
    dueDate: createTodoRequest.dueDate,
    done: false
  });
}

export async function updateTodo(todoId: string, updateTodoRequest: UpdateTodoRequest, userId: string): Promise<TodoUpdate> {
  return await todosAccess.updateTodo(
    todoId,
    {
      name: updateTodoRequest.name,
      dueDate: updateTodoRequest.dueDate,
      done: updateTodoRequest.done
    },
    userId);
}

export async function deleteTodo(todoId: string, userId: string) {
  await todosAccess.deleteTodo(todoId, userId);
}

export async function generateUploadUrl(todoId: string, userId: string) {
  const uploadUrl = todosAccess.generateUploadUrl(todoId);

  await todosAccess.addAttachmentUrl(todoId, userId);

  return uploadUrl;
}