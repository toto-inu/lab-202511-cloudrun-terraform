import { Injectable, NotFoundException } from '@nestjs/common';
import { Todo } from './todo.model';
import { CreateTodoInput } from './dto/create-todo.input';
import { UpdateTodoInput } from './dto/update-todo.input';

@Injectable()
export class TodoService {
  // モックデータストア（メモリ内で保持）
  private todos: Todo[] = [
    {
      id: '1',
      title: 'Learn NestJS',
      description: 'Study NestJS framework basics',
      completed: false,
    },
    {
      id: '2',
      title: 'Learn GraphQL',
      description: 'Understand GraphQL queries and mutations',
      completed: false,
    },
    {
      id: '3',
      title: 'Deploy to Cloud Run',
      description: 'Deploy the application using Terraform',
      completed: false,
    },
  ];

  private idCounter = 4; // 次のIDカウンター

  findAll(): Todo[] {
    return this.todos;
  }

  findOne(id: string): Todo {
    const todo = this.todos.find((t) => t.id === id);
    if (!todo) {
      throw new NotFoundException(`Todo with ID ${id} not found`);
    }
    return todo;
  }

  create(createTodoInput: CreateTodoInput): Todo {
    const newTodo: Todo = {
      id: String(this.idCounter++),
      title: createTodoInput.title,
      description: createTodoInput.description,
      completed: false,
    };
    this.todos.push(newTodo);
    return newTodo;
  }

  update(id: string, updateTodoInput: UpdateTodoInput): Todo {
    const todo = this.findOne(id);

    if (updateTodoInput.title !== undefined) {
      todo.title = updateTodoInput.title;
    }
    if (updateTodoInput.description !== undefined) {
      todo.description = updateTodoInput.description;
    }
    if (updateTodoInput.completed !== undefined) {
      todo.completed = updateTodoInput.completed;
    }

    return todo;
  }

  remove(id: string): boolean {
    const index = this.todos.findIndex((t) => t.id === id);
    if (index === -1) {
      throw new NotFoundException(`Todo with ID ${id} not found`);
    }
    this.todos.splice(index, 1);
    return true;
  }
}
