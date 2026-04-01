import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Auth from './Auth';
import './App.css';

function App() {
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [todos, setTodos] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const API_URL = "https://todo-app-o2lx.onrender.com";

  // Sabhi requests ke liye Common Headers (Security ke liye)
  const config = {
    headers: { Authorization: `Bearer ${token}` }
  };

  // Fetch Tasks
  useEffect(() => {
    if (token) {
      setLoading(true);
      axios.get(API_URL, config)
        .then(res => {
          setTodos(res.data);
          setLoading(false);
        })
        .catch(err => {
          console.error("Fetch Error:", err);
          setLoading(false);
        });
    }
  }, [token]);

  // Add Task
  const addTodo = async () => {
    if (!input.trim()) return;
    try {
      const res = await axios.post(API_URL, { text: input }, config);
      setTodos([...todos, res.data]);
      setInput('');
    } catch (err) {
      alert("Task add nahi ho paya!");
    }
  };

  // Toggle Task Status (Complete/Incomplete)
  const toggle = async (id) => {
    try {
      const res = await axios.put(`${API_URL}/${id}`, {}, config);
      setTodos(todos.map(t => t._id === id ? res.data : t));
    } catch (err) {
      console.error("Toggle Error:", err);
    }
  };

  // Delete Task
  const del = async (id) => {
    try {
      await axios.delete(`${API_URL}/${id}`, config);
      setTodos(todos.filter(t => t._id !== id));
    } catch (err) {
      console.error("Delete Error:", err);
    }
  };

  // Logout Function
  const handleLogout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setTodos([]);
  };

  // Agar login nahi hai toh Auth component dikhao
  if (!token) return <Auth setToken={setToken} />;

  return (
    <div className="App">
      <button className="logout-btn" onClick={handleLogout}>
        Logout
      </button>
      
      <h1>My Tasks</h1>
      
      <div className="input-container">
        <input 
          value={input} 
          onChange={(e) => setInput(e.target.value)} 
          onKeyPress={(e) => e.key === 'Enter' && addTodo()} // Enter dabane par bhi add hoga
          placeholder="What's on your mind?" 
        />
        <button onClick={addTodo}>Add</button>
      </div>

      {loading ? (
        <p style={{ textAlign: 'center', color: '#64748b' }}>Loading tasks...</p>
      ) : (
        <ul>
          {todos.length > 0 ? (
            todos.map(t => (
              <li key={t._id} className={t.completed ? 'completed' : ''}>
                <span onClick={() => toggle(t._id)}>{t.text}</span>
                <button className="del-btn" onClick={() => del(t._id)}>
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M18 6L6 18M6 6l12 12"></path>
                  </svg>
                </button>
              </li>
            ))
          ) : (
            <p style={{ textAlign: 'center', color: '#64748b', marginTop: '20px' }}>No tasks yet. Add one!</p>
          )}
        </ul>
      )}
    </div>
  );
}

export default App;