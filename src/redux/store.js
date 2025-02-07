import { configureStore } from '@reduxjs/toolkit';
import { todoReducer } from './todo/reducers';

const store = configureStore({
  reducer: {
    todos: todoReducer,
  },
});

export default store;
