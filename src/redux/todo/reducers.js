import { FETCH_TODOS, ADD_TODO, UPDATE_TODO, DELETE_TODO } from './actions';

const initialState = {
  todos: [],
};

export const todoReducer = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_TODOS:
      return { ...state, todos: action.payload };
    case ADD_TODO:
      return { ...state, todos: [...state.todos, action.payload.todo] };
    case DELETE_TODO:
        return { ...state, todos: state.todos.filter((todo) => todo.id !== action.payload) };
    case UPDATE_TODO:
      return {
        ...state,
        todos: state.todos.map((todo) =>
          todo.id === action.payload.todo.id ? action.payload.todo : todo
        ),
      };
    
    default:
      return state;
  }
};
