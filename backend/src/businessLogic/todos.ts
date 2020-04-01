import { TodosAccess } from "../dataLayer/todosAccess";
import { TodoItem } from "../models/TodoItem";

const todosAccess = new TodosAccess();

export async function getAllTodos(userId: string): Promise<TodoItem[]> {
  return todosAccess.getAllTodos(userId);
}