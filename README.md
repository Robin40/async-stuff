# @tdc-cl/async-stuff

## Installation

Install async-stuff and its peer dependencies

> TypeScript type definitions included

### npm

```shell
npm install @tdc-cl/async-stuff decimal.js js-joda superstruct
```

### yarn

```shell
yarn add @tdc-cl/async-stuff decimal.js js-joda superstruct
```

## Basic example

```typescript
// types.ts

export interface EmailPass {
    email: string;
    pass: string;
}

export interface Tokens {
    access: string;
    refresh: string;
}

export interface Todo {
    id: number;
    title: string;
    done: boolean;
}
```

```typescript
// endpoints.ts

import { Server } from '@tdc-cl/async-stuff';
import { EmailPass, Tokens, Todo } from './types';

const server = new Server('http.../api');

export const login = server.endpoint.post<EmailPass, Tokens>('login/');

export const getAllTodos = server.endpoint.getAll<Todo[]>('/user/todos');
export const todoById = server.endpoint.get<number, Todo>('user/todos/');
export const createTodo = server.endpoint.post<Omit<Todo, 'id'>, void>('/user/todos/');
export const replaceTodo = server.endpoint.put<number, Omit<Todo, 'id'>, Todo>('user/todos');
export const patchTodo = server.endpoint.patch<number, Partial<Omit<Todo, 'id'>>, Todo>('/user/todos');
export const deleteTodo = server.endpoint.delete<number, void>('user/todos');
```

```typescript
// LoginForm.tsx

import { login } from './endpoints';

export default function LoginForm() {
    async function onSubmit() {
        const tokens = await login.fetch({ user: ..., pass: ... });
        // `tokens` is of type `Tokens` as defined in the endpoint
        ...
    }
    ...
}
```


```typescript
// Todos.tsx

import { getAllTodos, todoById, createTodo, replaceTodo, patchTodo, deleteTodo } from './endpoints';
import { Todo } from './types';

...

const todos: Todo[] = await getAllTodos.fetch();
const newTodo: Todo = await createTodo.fetch({ title: 'foo', done: false });
const thatTodo: Todo = await todoById.fetch(newTodo.id);
const anotherTodo: Todo = await replaceTodo.fetch(thatTodo.id, { title: 'bar', done: false });
const doneTodo: Todo = await patchTodo.fetch(anotherTodo.id, { done: true });
await deleteTodo.fetch(doneTodo.id);
```

> Note: authentication tokens will be handled in a future version