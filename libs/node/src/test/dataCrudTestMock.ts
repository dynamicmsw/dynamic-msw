import { configureMock } from '@dynamic-msw/core';
import { HttpResponse, http } from 'msw';

export type Todo = { id: string; title: string; done: boolean };

export const testTodos: Todo[] = [
  { id: 'test-todo', title: 'test todo', done: false },
];

export const createTodoMocks = configureMock(
  {
    key: 'todos',
    data: { todos: testTodos },
  },
  (_parameters, data, updateData) => {
    return [
      http.post('http://localhost/todos/create', async ({ request }) => {
        const newTodo = (await request.json()) as Todo;
        const newTodos = [...data.todos, newTodo];
        updateData({ todos: newTodos });
        return HttpResponse.json(newTodos);
      }),
      http.get('http://localhost/todos', () => {
        return HttpResponse.json(data.todos);
      }),
    ];
  }
);
