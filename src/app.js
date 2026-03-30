const express = require('express');
const app = express();

app.use(express.json());

// In-memory store
let tasks = [
    { id: 1, title: 'Setup Project', completed: true },
    { id: 2, title: 'Run Tests', completed: false }
];

// Utility: validate ID
const parseId = (id) => {
    const parsed = Number(id);
    return Number.isInteger(parsed) && parsed > 0 ? parsed : null;
};

// 1. Health Check
app.get('/health', (req, res) => {
    res.status(200).json({
        status: 'UP',
        timestamp: new Date().toISOString()
    });
});

// 2. Get All Tasks
app.get('/api/tasks', (req, res) => {
    res.status(200).json(tasks);
});

// 3. Get Single Task
app.get('/api/tasks/:id', (req, res) => {
    const id = parseId(req.params.id);
    if (!id) {
        return res.status(400).json({ message: 'Invalid task ID' });
    }

    const task = tasks.find(t => t.id === id);
    if (!task) {
        return res.status(404).json({ message: 'Task not found' });
    }

    return res.status(200).json(task);
});

// 4. Create Task
app.post('/api/tasks', (req, res) => {
    const { title } = req.body;

    if (!title || typeof title !== 'string' || title.trim().length === 0) {
        return res.status(400).json({ message: 'Valid title is required' });
    }

    const newTask = {
        id: tasks.length > 0 ? tasks[tasks.length - 1].id + 1 : 1,
        title: title.trim(),
        completed: false
    };

    tasks.push(newTask);
    return res.status(201).json(newTask);
});

// 5. Delete Task
app.delete('/api/tasks/:id', (req, res) => {
    const id = parseId(req.params.id);
    if (!id) {
        return res.status(400).json({ message: 'Invalid task ID' });
    }

    const index = tasks.findIndex(t => t.id === id);
    if (index === -1) {
        return res.status(404).json({ message: 'Task not found' });
    }

    tasks.splice(index, 1);
    return res.status(204).send();
});

module.exports = app;
