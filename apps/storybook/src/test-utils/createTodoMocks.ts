import { configureMock } from '@dynamic-msw/core';
import { HttpResponse, http } from 'msw';
import { createApiURL } from './createApiURL';

type Todo = { id: string; title: string; done: boolean };
const initialTodos: Todo[] = [];

export const createTodoMocks = configureMock(
  {
    key: 'todos',
    data: { todos: initialTodos },
  },
  (_parameters, data, updateData) => {
    return [
      http.post<never, Todo>(
        createApiURL('/todos/create'),
        async ({ request }) => {
          const newTodo = await request.json();
          const newTodos = [...data.todos, newTodo];
          updateData({ todos: newTodos });
          return HttpResponse.json<Todo>(newTodo);
        }
      ),
      http.get(createApiURL('/todos'), () => {
        return HttpResponse.json<Todo[]>(data.todos);
      }),
    ];
  }
);
