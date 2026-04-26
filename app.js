const express = require('express');
const app = express();

app.use(express.json());

let tasks = [];

// UI Route
app.get('/', (req, res) => {
    res.send(`
    <html>
    <head>
        <title>Task Manager</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
            * {
                box-sizing: border-box;
                font-family: 'Segoe UI', sans-serif;
            }
            body {
                margin: 0;
                background: #0f172a;
                display: flex;
                justify-content: center;
                align-items: center;
                height: 100vh;
                color: white;
            }
            .app {
                background: #1e293b;
                padding: 25px;
                border-radius: 16px;
                width: 380px;
                box-shadow: 0 10px 30px rgba(0,0,0,0.4);
            }
            h1 {
                margin: 0 0 20px;
                font-size: 22px;
                text-align: center;
                color: #38bdf8;
            }
            .input-box {
                display: flex;
                gap: 10px;
                margin-bottom: 20px;
            }
            input {
                flex: 1;
                padding: 10px;
                border-radius: 8px;
                border: none;
                outline: none;
                background: #0f172a;
                color: white;
            }
            button {
                padding: 10px 14px;
                border: none;
                border-radius: 8px;
                background: #38bdf8;
                color: black;
                cursor: pointer;
                font-weight: 600;
                transition: 0.2s;
            }
            button:hover {
                opacity: 0.85;
            }
            .task {
                display: flex;
                justify-content: space-between;
                align-items: center;
                background: #0f172a;
                padding: 10px;
                border-radius: 8px;
                margin-bottom: 10px;
                transition: 0.2s;
            }
            .task:hover {
                transform: scale(1.02);
            }
            .task span {
                font-size: 14px;
            }
            .delete {
                background: #ef4444;
                color: white;
                padding: 6px 10px;
                border-radius: 6px;
            }
            .empty {
                text-align: center;
                opacity: 0.6;
                font-size: 14px;
            }
        </style>
    </head>
    <body>
        <div class="app">
            <h1>📝 Task Manager</h1>

            <div class="input-box">
                <input id="taskInput" placeholder="Add a new task..." />
                <button onclick="addTask()">Add</button>
            </div>

            <div id="taskList"></div>
        </div>

        <script>
            async function loadTasks() {
                const res = await fetch('/tasks');
                const data = await res.json();

                let html = '';

                if (data.length === 0) {
                    html = '<div class="empty">No tasks yet ✨</div>';
                } else {
                    data.forEach(t => {
                        html += \`
                            <div class="task">
                                <span>\${t.text}</span>
                                <button class="delete" onclick="deleteTask(\${t.id})">Delete</button>
                            </div>
                        \`;
                    });
                }

                document.getElementById('taskList').innerHTML = html;
            }

            async function addTask() {
                const input = document.getElementById('taskInput');
                const text = input.value.trim();
                if (!text) return;

                await fetch('/tasks', {
                    method: 'POST',
                    headers: {'Content-Type': 'application/json'},
                    body: JSON.stringify({ text })
                });

                input.value = '';
                loadTasks();
            }

            async function deleteTask(id) {
                await fetch('/tasks/' + id, { method: 'DELETE' });
                loadTasks();
            }

            loadTasks();
        </script>
    </body>
    </html>
    `);
});

// API Routes
app.get('/tasks', (req, res) => {
    res.json(tasks);
});

app.post('/tasks', (req, res) => {
    const task = {
        id: tasks.length + 1,
        text: req.body.text
    };
    tasks.push(task);
    res.json(task);
});

app.delete('/tasks/:id', (req, res) => {
    const id = parseInt(req.params.id);
    tasks = tasks.filter(t => t.id !== id);
    res.json({ message: "Deleted" });
});

// Start server
app.listen(3000, () => {
    console.log("Server running on port 3000");
});