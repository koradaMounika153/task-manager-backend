const express = require("express");
const cors = require("cors");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// In-memory storage
let tasks = [];

/*
Task Structure:
{
  id: number,
  title: string,
  completed: boolean,
  createdAt: date,
  dueDate: date | null
}
*/

// ✅ GET all tasks
app.get("/tasks", (req, res) => {
  res.json(tasks);
});

// ✅ CREATE task (FIXED RESPONSE FORMAT)
app.post("/tasks", (req, res) => {
  const { title, dueDate } = req.body;

  // Validation
  if (!title || title.trim() === "") {
    return res.status(400).json({ error: "Title is required" });
  }

  const newTask = {
    id: Date.now(),
    title: title.trim(),
    completed: false,
    createdAt: new Date(),
    dueDate: dueDate ? new Date(dueDate) : null
  };

  tasks.push(newTask);

  // 🔥 IMPORTANT: return ONLY task (not wrapped)
  res.status(201).json(newTask);
});

// ✅ UPDATE task
app.patch("/tasks/:id", (req, res) => {
  const id = Number(req.params.id);
  const task = tasks.find(t => t.id === id);

  if (!task) {
    return res.status(404).json({ error: "Task not found" });
  }

  const { title, completed, dueDate } = req.body;

  if (title !== undefined) {
    if (title.trim() === "") {
      return res.status(400).json({ error: "Title cannot be empty" });
    }
    task.title = title.trim();
  }

  if (completed !== undefined) {
    task.completed = completed;
  }

  if (dueDate !== undefined) {
    task.dueDate = dueDate ? new Date(dueDate) : null;
  }

  res.json(task);
});

// ✅ DELETE task
app.delete("/tasks/:id", (req, res) => {
  const id = Number(req.params.id);

  const exists = tasks.some(t => t.id === id);

  if (!exists) {
    return res.status(404).json({ error: "Task not found" });
  }

  tasks = tasks.filter(t => t.id !== id);

  res.json({ message: "Task deleted successfully" });
});

// ✅ Basic error handler
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: "Internal Server Error" });
});

// ✅ Start server
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});