import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { useAuth } from './context/AuthContext';

import SignIn from './pages/auth/SignIn';
import SignUp from './pages/auth/SignUp';
import TodoList from './pages/todo/TodoList';

function App() {
  const { token, logout } = useAuth();

  return (
    <Router>
      <nav>
        <ul>
          {/* {!token && <li><Link to="/login">Login</Link></li>} */}
          {token && <li><Link to="/todos">To-Do List</Link></li>}
          {token && <button onClick={logout}>Logout</button>}
        </ul>
      </nav>

      <Routes>
        <Route
          path="/"
          element={
            token ? (
              <RedirectToLogin path="/todos" />
            ) : (
              <RedirectToLogin path="/login" />
            )
          }
        />
        <Route path="/login" element={<SignIn />} />
        <Route path="/register" element={<SignUp />} />
        <Route path="/todos" element={token ? <TodoList /> : <SignIn />} />
      </Routes>
    </Router>
  );
}
const RedirectToLogin = ({path}) => {
  // Automatically redirect to login page
  window.location.href = path;
  return null;
};

export default App;
