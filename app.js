const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const port = 3000;

app.use(bodyParser.json());

let tasks = [];

app.get('/tasks', (req, res) => {
  res.json(tasks);
});


app.post('/tasks', (req, res) => {
  const newTask = {
    id: tasks.length + 1,
    name: req.body.name || 'Task',
    elapsedTime: 0,
    isRunning: false,
    startTime: null,
  };
  tasks.push(newTask);
  res.json(newTask);
});


app.put('/tasks/:Id/start', (req, res) => {
  const Id = req.params.Id;
  const task = tasks.find(task => task.id == Id);

  if (task && !task.isRunning) {
    task.isRunning = true;
    task.startTime = Date.now();
    res.json(task);
  } else {
    res.status(400).json({ error: 'Tarea no encontrada o en ejecucion' });
  }
});


app.put('/tasks/:Id/stop', (req, res) => {
  const Id = req.params.Id;
  const task = tasks.find(task => task.id == Id);

  if (task && task.isRunning) {
    const elapsedTime = Date.now() - task.startTime;
    task.elapsedTime += elapsedTime;
    task.isRunning = false;
    task.startTime = null;
    res.json(task);
  } else {
    res.status(400).json({ error: 'Tarea no encontrada o en ejecucion' });
  }
});


app.delete('/tasks/:Id', (req, res) => {
  const Id = req.params.taskId;
  const taskIndex = tasks.findIndex(task => task.id == Id);

  if (taskIndex !== -1) {
    const deletedTask = tasks.splice(taskIndex, 1);
    res.json(deletedTask[0]);
  } else {
    res.status(404).json({ error: 'Tarea no encontrada' });
  }
});

app.listen(port, () => {
  console.log(`http://localhost:${port}`);
});
