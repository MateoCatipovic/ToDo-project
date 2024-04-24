// App.js

import React, { useState, useEffect } from "react";
import axios from "axios";
import { v4 as uuidv4 } from "uuid";
import "./App.css";
import { ToDo } from "../types/todo";
import TodoTable from "./components/TodoTable";
import SingleToDo from "./components/SingleToDo";

function App() {
  const [todos, setTodos] = useState<ToDo[]>([]);
  const [newTodoText, setNewTodoText] = useState("");
  const [sortOrder, setSortOrder] = useState("createdAt"); // Default sort order

  const api = "http://localhost:3001/todos";
  const smsEndpoint = "http://localhost:3002/send-sms"; // Server-side endpoint for sending SMS

  useEffect(() => {
    fetchTodos();
  }, [sortOrder]);

  const fetchTodos = async () => {
    try {
      const response = await axios.get(`${api}?_sort=${sortOrder}`);
      setTodos(response.data);
    } catch (error) {
      console.error("Error fetching todos:", error);
    }
  };

  const fetchSingleTodo = async (id: string) => {
    try {
      const response = await axios.get(`${api}/${id}`);
      console.log(response.data);
      setTodos(response.data);
    } catch (error) {
      console.error("Error fetching todos:", error);
    }
  };

  const addTodo = async () => {
    // Generate a new UUID
    try {
      const uuid = uuidv4();
      const response = await axios.post(`${api}`, {
        id: uuid,
        text: newTodoText,
        done: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      setTodos([...todos, response.data]);
      fetchTodos();
      setNewTodoText("");
    } catch (error) {
      console.error("Error adding todo:", error);
    }
  };

  const toggleTodo = async (id: string, done: boolean) => {
    try {
      await axios.patch(`${api}/${id}`, { done: !done, updatedAt: new Date() });
      fetchTodos(); // Refresh the list of todos

      // Send SMS message when todo is marked as done
      if (!done) {
        const todoText = todos.find((todo) => todo.id === id)?.text;
        if (todoText) {
          await sendSms(todoText);
        }
      }
    } catch (error) {
      console.error("Error updating todo:", error);
    }
  };

  // Function to send SMS message
  const sendSms = async (text: string) => {
    try {
      await axios.post(smsEndpoint, { message: `Todo marked as done: ${text}` });
      console.log("SMS sent successfully");
    } catch (error) {
      console.error("Error sending SMS:", error);
    }
  };

  const editTodo = async (id: string, text: string) => {
    console.log(text);
    try {
      await axios.patch(`${api}/${id}`, { text: text, updatedAt: new Date() });
      fetchTodos(); // Refresh the list of todos
    } catch (error) {
      console.error("Error updating todo:", error);
    }
  };

  const deleteTodo = async (id: string) => {
    try {
      await axios.delete(`${api}/${id}`);
      fetchTodos(); // Refresh the list of todos
    } catch (error) {
      console.error("Error updating todo:", error);
    }
  };

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSortOrder(e.target.value);
  };

  return (
    <div className="App">
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <h1>ToDo List</h1>
        <div>
          <label htmlFor="sortOrder">Sort Order:</label>
          <select
            id="sortOrder"
            className="custom-select"
            value={sortOrder}
            onChange={handleSortChange}
          >
            <option value="-createdAt">Descending</option>
            <option value="createdAt">Ascending</option>
          </select>
        </div>
      </div>
      <div className="input-div">
        <div>
          <input
            className="input-add"
            type="text"
            value={newTodoText}
            placeholder="Add new todo"
            onChange={(e) => setNewTodoText(e.target.value)}
          />
          <button onClick={addTodo}>Add Todo</button>
        </div>
        <SingleToDo fetchSingleTodo={fetchSingleTodo} />
      </div>
      <TodoTable
        todos={todos}
        toggleTodo={toggleTodo}
        editTodo={editTodo}
        deleteTodo={deleteTodo}
      />
    </div>
  );
}

export default App;
