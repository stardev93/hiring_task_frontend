import api from "../../axios"; 

export const FETCH_TODOS = 'FETCH_TODOS';
export const ADD_TODO = 'ADD_TODO';
export const DELETE_TODO = 'DELETE_TODO';
export const UPDATE_TODO = 'UPDATE_TODO';

export const fetchTodos = (uuid) => async (dispatch) => {
  const response = await api.get(`/todo/${uuid}`);
  dispatch({ type: FETCH_TODOS, payload: response.data.todos });
};

export const addTodo = ({title, description, status, dueDate, user_id}) => async (dispatch) => {
  const response = await api.post("/todo/store", { title, description, status, due_date: dueDate , user_id});
  dispatch({ type: ADD_TODO, payload: response.data });
};

export const updateTodo = ({id, title, description, status, dueDate, user_id}) => async (dispatch) => {
  const response = await api.put(`/todo/${id}`, { title, description, status, due_date: dueDate , user_id});
  dispatch({ type: UPDATE_TODO, payload: response.data });
};

export const deleteTodo = (id) => async (dispatch) => {
  await api.delete(`/todo/${id}`);
  dispatch({ type: DELETE_TODO, payload: id });
};
