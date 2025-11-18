import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { Todo } from './todo.model';
import { TodoService } from './todo.service';
import { CreateTodoInput } from './dto/create-todo.input';
import { UpdateTodoInput } from './dto/update-todo.input';
import { FirebaseAuthGuard } from '../auth/guards/firebase-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import * as admin from 'firebase-admin';

@Resolver(() => Todo)
export class TodoResolver {
  constructor(private readonly todoService: TodoService) {}

  @Query(() => [Todo], { name: 'todos' })
  findAll() {
    return this.todoService.findAll();
  }

  @Query(() => Todo, { name: 'todo' })
  findOne(@Args('id') id: string) {
    return this.todoService.findOne(id);
  }

  @Mutation(() => Todo)
  @UseGuards(FirebaseAuthGuard)
  createTodo(
    @Args('input') createTodoInput: CreateTodoInput,
    @CurrentUser() user: admin.auth.DecodedIdToken,
  ) {
    return this.todoService.create(createTodoInput);
  }

  @Mutation(() => Todo)
  @UseGuards(FirebaseAuthGuard)
  updateTodo(
    @Args('id') id: string,
    @Args('input') updateTodoInput: UpdateTodoInput,
    @CurrentUser() user: admin.auth.DecodedIdToken,
  ) {
    return this.todoService.update(id, updateTodoInput);
  }

  @Mutation(() => Boolean)
  @UseGuards(FirebaseAuthGuard)
  removeTodo(
    @Args('id') id: string,
    @CurrentUser() user: admin.auth.DecodedIdToken,
  ) {
    return this.todoService.remove(id);
  }
}
