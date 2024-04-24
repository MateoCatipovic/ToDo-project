const express = require('express');
const bodyParser = require('body-parser');
const twilio = require('twilio');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.json());

// In-memory database for demo purposes
let todos = [
  { id: 1, text: 'Buy groceries', done: false },
  { id: 2, text: 'Walk the dog', done: true }
];

// Twilio configuration
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const fromNumber = process.env.FROM_NUMBER;
const client = twilio(accountSid, authToken);

// Send SMS function
const sendSMS = (to, message) => {
  client.messages
    .create({
      body: message,
      from: fromNumber,
      to: to
    })
    .then(message => console.log(`SMS sent: ${message.sid}`))
    .catch(err => console.error(`Error sending SMS: ${err}`));
};

// Routes
app.get('/api/todos', (req, res) => {
  const sortedTodos = req.query.sort === 'ASC' ? todos.slice().sort((a, b) => a.id - b.id) : todos.slice().sort((a, b) => b.id - a.id);
  res.json(sortedTodos);
});

app.get('/api/todos/:id', (req, res) => {
  const todo = todos.find(todo => todo.id === parseInt(req.params.id));
  if (!todo) {
    return res.status(404).json({ error: 'Todo not found' });
  }
  res.json(todo);
});

app.post('/api/todos', (req, res) => {
  const { text, done } = req.body;
  const newTodo = { id: todos.length + 1, text, done: done || false };
  todos.push(newTodo);
  res.status(201).json(newTodo);
});

app.patch('/api/todos/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const todoIndex = todos.findIndex(todo => todo.id === id);
  if (todoIndex === -1) {
    return res.status(404).json({ error: 'Todo not found' });
  }
  todos[todoIndex] = { ...todos[todoIndex], ...req.body };

  // Check if the update is to mark a ToDo as done and send an SMS
  if (req.body.done) {
    const todo = todos[todoIndex];
    sendSMS(process.env.TO_NUMBER, `Todo "${todo.text}" is now marked as done.`);
  }

  res.json(todos[todoIndex]);
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
