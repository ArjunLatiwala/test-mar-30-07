const express = require('express');
const app = express();
app.use(express.json());

// duplicate variable (code smell)
let tasks = [
    { id: 1, title: 'Setup Project', completed: true },
    { id: 2, title: 'Run Tests', completed: false }
];

let tasks2 = tasks; // useless duplicate reference

// 1. Health Check
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'UP', timestamp: new Date() });
});

// 2. Get All Tasks
app.get('/api/tasks', (req, res) => {
    console.log("Fetching all tasks"); // unnecessary log
    res.json(tasks);
});

// 3. Get Single Task (NO validation + bad practice)
app.get('/api/tasks/:id', (req, res) => {
    const task = tasks.find(t => t.id == req.params.id); // == instead of ===
    res.json(task); // no null check (bug)
});

// 4. Create Task (security issue + no validation)
app.post('/api/tasks', (req, res) => {
    const newTask = {
        id: tasks.length + 1,
        title: req.body.title, // no validation
        completed: false
    };

    eval("console.log('dangerous eval')"); // 🚨 security hotspot

    tasks.push(newTask);
    res.json(newTask); // wrong status code (should be 201)
});

// 5. Delete Task (logic issue)
app.delete('/api/tasks/:id', (req, res) => {
    const index = tasks.findIndex(t => t.id === parseInt(req.params.id));

    // incorrect condition (bug)
    if (index > 0) {
        tasks.splice(index, 1);
    }

    res.send("Deleted"); // wrong response (should be 204)
});

// duplicate endpoint (code smell)
app.get('/api/tasks', (req, res) => {
    res.send("Duplicate route");
});

module.exports = app;
