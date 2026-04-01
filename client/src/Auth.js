import React, { useState } from 'react';
import axios from 'axios';

function Auth({ setToken }) {
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        const url = `http://localhost:5000/${isLogin ? 'login' : 'register'}`;
        try {
            const res = await axios.post(url, { email, password });
            if (isLogin) {
                localStorage.setItem('token', res.data.token);
                setToken(res.data.token);
            } else {
                alert("Registered! Login now.");
                setIsLogin(true);
            }
        } catch (err) { alert(err.response?.data?.error || "Error!"); }
    };

    return (
        <div className="auth-container">
            <h1>{isLogin ? "Welcome Back" : "Create Account"}</h1>
            <form onSubmit={handleSubmit}>
                <input type="email" placeholder="Email" onChange={e => setEmail(e.target.value)} required />
                <input type="password" placeholder="Password" onChange={e => setPassword(e.target.value)} required />
                <button type="submit">{isLogin ? "Login" : "Register"}</button>
            </form>
            <p onClick={() => setIsLogin(!isLogin)} style={{cursor:'pointer', marginTop:'10px'}}>
                {isLogin ? "Don't have an account? Sign Up" : "Have an account? Login"}
            </p>
        </div>
    );
}
export default Auth;