type deleteTodo = (arg1: string) => void;
type fetchSingleTodo = (arg1: string) => void;
type editTodo = (arg1: string, arg2: string) => void;
type toggleTodo = (arg1: string, arg2: boolean) => void;

export interface ToDo {
  id: string;
  text: string;
  done: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface TodoTableProps {
  todos: ToDo[] | ToDo;
  deleteTodo: deleteTodo;
  toggleTodo: toggleTodo;
  editTodo: editTodo;
}

export interface SingleToDoProps {
  fetchSingleTodo: fetchSingleTodo;
}
