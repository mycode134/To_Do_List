import React, { useEffect, useState } from "react";
import "./App.css";

const URL = "http://localhost:3001/todos"; // JSON Server URL

function App() {
  const [data, setData] = useState([]);
  const [newTask, setNewTask] = useState("");
  const [targetDate, setTargetDate] = useState("");

  useEffect(() => {
    fetch(URL, { method: "GET" })
      .then((res) => res.json())
      .then((resp) => setData(resp))
      .catch((err) => console.error("Error fetching data:", err));
  }, []);

  const addTask = () => {
    if (!newTask.trim()) {
      alert("Task title cannot be empty!");
      return;
    }
    if (!targetDate) {
      alert("Please select a target date!");
      return;
    }

    const newTaskData = {
      id: data.length ? data[data.length - 1].id + 1 : 1,
      title: newTask,
      completed: false,
      createdDate: new Date().toLocaleDateString(),
      completedDate: null,
      targetDate,
    };

    fetch(URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newTaskData),
    })
      .then((res) => res.json())
      .then((task) => {
        setData([...data, task]);
        setNewTask("");
        setTargetDate("");
      })
      .catch((err) => console.error("Error adding task:", err));
  };

  const toggleCompleted = (id, currentStatus) => {
    const updatedStatus = !currentStatus;
    const completedDate = updatedStatus ? new Date().toLocaleDateString() : null;

    const itemToUpdate = data.find((item) => item.id === id);

    fetch(`${URL}/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...itemToUpdate, completed: updatedStatus, completedDate }),
    })
      .then((res) => res.json())
      .then(() => {
        setData((prevData) =>
          prevData.map((item) =>
            item.id === id
              ? { ...item, completed: updatedStatus, completedDate }
              : item
          )
        );
      })
      .catch((err) => console.error("Error updating status:", err));
  };

  const deleteTask = (id) => {
    fetch(`${URL}/${id}`, {
      method: "DELETE",
    })
      .then(() => {
        setData((prevData) => prevData.filter((item) => item.id !== id));
      })
      .catch((err) => console.error("Error deleting task:", err));
  };

  return (
    <div>
      <br></br><br></br>
   
    <div className="container butterfly-container">
      
      <h1 className="butterfly-heading">🦋 To Do List 🦋</h1>
      <div className="row butterfly-forms">
        <input
          type="text"
          placeholder="Add a new task"
          className="form-control butterfly-input"
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
        />
        <input
          type="date"
          placeholder="Target Date"
          className="form-control butterfly-input"
          value={targetDate}
          onChange={(e) => setTargetDate(e.target.value)}
        />
        <button className="butterfly-button" onClick={addTask}>Add Task</button>
      </div>
      <table className="table butterfly-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Title</th>
            <th>Target Date</th>
            <th>Completed</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item) => (
            <tr key={item.id}>
              <td>{item.id}</td>
              <td>
                <textarea
                  value={item.title}
                  className="butterfly-textarea"
                  readOnly
                />
              </td>
              <td>{item.targetDate}</td>
              <td>
                <button
                  onClick={() => toggleCompleted(item.id, item.completed)}
                  className={item.completed ? "completed-button" : "not-completed-button"}
                >
                  {item.completed ? "✔️" : "❌"}
                </button>
              </td>
              <td>
                <button
                  className="butterfly-delete-button"
                  onClick={() => deleteTask(item.id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
    </div> 
  );
}

export default App;
