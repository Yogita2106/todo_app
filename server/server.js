const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const app = express();
app.use(express.json());
app.use(cors());

// --- Sabse Important Line Jo Missing Thi ---
const JWT_SECRET = process.env.JWT_SECRET || "mera_super_secret_key_123";

const MONGO_URI = process.env.MONGO_URI || "mongodb+srv://yogitatodo:yogitatodo@todoapp.3opmwmc.mongodb.net/?appName=todoapp";

mongoose.connect(MONGO_URI)
    .then(() => console.log("✅ Cloud MongoDB Connected!"))
    .catch(err => console.log("❌ DB Error:", err));

// User Model
const User = mongoose.model('User', new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true }
}));

// Todo Model
const Todo = mongoose.model('Todo', new mongoose.Schema({
    text: { type: String, required: true },
    completed: { type: Boolean, default: false }
}));

// --- ROUTES ---

app.post('/register', async (req, res) => {
    try {
        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        const newUser = new User({ email: req.body.email, password: hashedPassword });
        await newUser.save();
        res.status(201).json({ message: "Registered" });
    } catch (err) { 
        res.status(400).json({ error: "Email exists or something went wrong!" }); 
    }
});

app.post('/login', async (req, res) => {
    try {
        const user = await User.findOne({ email: req.body.email });
        if (!user || !(await bcrypt.compare(req.body.password, user.password))) {
            return res.status(400).json({ error: "Invalid Credentials" });
        }
        // Ab JWT_SECRET mil jayega code ko
        const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '1h' });
        res.json({ token });
    } catch (err) {
        res.status(500).json({ error: "Login failed!" });
    }
});

app.get('/todos', async (req, res) => {
    const todos = await Todo.find();
    res.json(todos);
});

app.post('/todos', async (req, res) => {
    const newTodo = new Todo({ text: req.body.text });
    await newTodo.save();
    res.json(newTodo);
});

app.put('/todos/:id', async (req, res) => {
    try {
        const todo = await Todo.findById(req.params.id);
        todo.completed = !todo.completed;
        await todo.save();
        res.json(todo);
    } catch (err) {
        res.status(400).json({ error: "Update failed" });
    }
});

app.delete('/todos/:id', async (req, res) => {
    await Todo.findByIdAndDelete(req.params.id);
    res.json({ message: "Deleted" });
});

app.listen(5000, () => console.log("🚀 Server is running on http://localhost:5000"));