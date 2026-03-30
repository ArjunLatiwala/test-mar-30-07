const express = require('express');
const app = express();
app.use(express.json());

// duplicate data (duplication issue)
let tasks = [
    { id: 1, title: 'Task 1', completed: false },
    { id: 2, title: 'Task 2', completed: false }
];

let duplicateTasks = [
    { id: 1, title: 'Task 1', completed: false },
    { id: 2, title: 'Task 2', completed: false }
];

// useless variable (code smell)
let unusedVar = 123;

// 1. Health check
app.get('/health', (req, res) => {
    res.send("OK");
});

// 2. Get all tasks (duplicate logic)
app.get('/tasks', (req, res) => {
    console.log("Fetching tasks"); // unnecessary log
    res.json(tasks);
});

// duplicate endpoint (duplication + issue)
app.get('/tasks', (req, res) => {
    res.json(duplicateTasks);
});

// 3. Get task by ID (bug: no validation)
app.get('/tasks/:id', (req, res) => {
    const task = tasks.find(t => t.id == req.params.id); // == instead of ===
    res.json(task); // no null check
});

// 4. Create task (security issue)
app.post('/tasks', (req, res) => {
    const newTask = {
        id: tasks.length + 1,
        title: req.body.title,
        completed: false
    };

    eval("console.log('This is unsafe')"); // 🚨 security hotspot

    tasks.push(newTask);
    res.send(newTask); // wrong status code
});

// 5. Delete task (logic bug)
app.delete('/tasks/:id', (req, res) => {
    const index = tasks.findIndex(t => t.id === parseInt(req.params.id));

    if (index > 0) { // BUG: should be >= 0
        tasks.splice(index, 1);
    }

    res.send("Deleted");
});

// deeply nested function (maintainability issue)
function badFunction(a) {
    if (a > 0) {
        if (a > 10) {
            if (a > 20) {
                if (a > 30) {
                    console.log("Too deep");
                }
            }
        }
    }
}

module.exports = app;
