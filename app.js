const express = require('express');
const app = express();

app.use(express.json());

let tasks = [];

app.get('/', (req, res) => {
    res.send('Task Manager API is running 🚀');
});

app.get('/tasks', (req, res) => {
    res.json(tasks);
});

app.post('/tasks', (req, res) => {
    const task = {
        id: tasks.length + 1,
        text: req.body.text
    };
    tasks.push(task);
    res.json({ message: 'Task added', task });
});

app.delete('/tasks/:id', (req, res) => {
    const id = parseInt(req.params.id);
    tasks = tasks.filter(t => t.id !== id);
    res.json({ message: 'Task deleted' });
});

app.listen(3000, () => {
    console.log('Server running on port 3000');
});