# Dynamic Msw

## Create mocks

<!-- TODO: use webshop mocks as example as todos are to simple -->

```ts
import { createMock } from 'dynamic-msw';
import { HttpResponse, http } from 'msw';

type Todo = { id: string; title: string; done: boolean };

export const todoMocks = createMock(
  {
    key: 'todos',
    parameters: {
      createTodoFailure: true,
    },
    data: { todos: [] satisfies Todo[] as Todo[] },
  },
  (options, data, updateData) => {
    return [
      http.post('/todos/create', () => {
        if (options.createTodoFailure) {
          return HttpResponse.json(
            {
              errorMessage: 'Todo already exsists',
            },
            { status: 500 }
          );
        }
        const newTodo = await request.json();
        const newTodos = [...data.todos, newTodo];
        updateData({ todos: newTodos });
        return HttpResponse.json(newTodos);
      }),
      http.get('/todos', () => {
        return HttpResponse.json(data.todos);
      }),
    ];
  }
);
```
