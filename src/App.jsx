
import { useState, useEffect } from "react";
import "./App.css";

function App() {
  
  const [input, setInput] = useState("");
  const [todos, setTodos] = useState(() => {
    try{
      const savedTodos = localStorage.getItem("todos");

      return savedTodos ? JSON.parse(savedTodos) : [];
    } catch{
      return[];
    }
  });

  
  const [editingId, setEditingId] = useState(null);
  const [editInput, setEditInput] = useState("");
  const [filter, setFilter] = useState("All");

  useEffect(() => {
    localStorage.setItem("todos", JSON.stringify(todos));
  }, [todos]);

  function handleAddTodo() {
    const trimmedInput = input.trim();

    if (trimmedInput === "") {
      return;
    }

    const newTodo = {
      id: crypto.randomUUID(),
      title: trimmedInput,
      completed: false,
    };

    setTodos([...todos, newTodo]);
    setInput("");
  }

  
  function toggleTodo(id) {
    setTodos((currentTodos) =>
      currentTodos.map((todo) =>
        todo.id === id
          ? { ...todo, completed: !todo.completed }
          : todo
      )
    );
  }

  
  function deleteTodo(id) {
    setTodos((currentTodos => 
      currentTodos.filter((todo) => todo.id !== id)));
  }

  function clearCompleted() {
  if (completedTasks === 0) {
    return;
  }

  const confirmed = window.confirm(
    "Are you sure you want to clear all completed tasks?"
  );

  if (!confirmed) {
    return;
  }

 setTodos((todos) =>
  todos.filter((todo) => !todo.completed)
);
}

  
  function handleEditTodo(todo) {
    setEditingId(todo.id);
    setEditInput(todo.title);
  }

  
  function saveEdit(id) {
    const trimmedInput = editInput.trim();

    if (trimmedInput === "") {
      return;
    }

    setTodos(
      todos.map((todo) =>
        todo.id === id
          ? { ...todo, title: trimmedInput }
          : todo
      )
    );

    setEditingId(null);
    setEditInput("");
  }

  
  function cancelEdit() {
    setEditingId(null);
    setEditInput("");
  }

  
  const totalTasks = todos.length;

  const completedTasks = todos.filter(
    (todo) => todo.completed
  ).length;

  const filteredTodos = todos.filter((todo) => {
    if(filter === "Pending"){
      return !todo.completed;
    }

    if(filter === "Completed"){
      return todo.completed;
    }

    return true;
  });

  return (
    <div className="app-container">
      <h1>My To-Do List</h1>

      
      <input
        type="text"
        placeholder="Enter a task..."
        value={input}
        onChange={(event) => setInput(event.target.value)}
      />

      <button onClick={handleAddTodo}>Add</button>

      <div className="task-summary">
      <p>
        Total tasks<strong>{totalTasks}</strong>
      </p>

      <p>
        Completed tasks<strong>{completedTasks}</strong>
      </p>

      <p>
        Remaining tasks<strong>{totalTasks - completedTasks}</strong>
      </p>

      </div>

      <div className="filter-controls">
        <button 
          className={filter === "All" ? "active-filter" : ""}
          onClick={() => setFilter("All")}>
          All
        </button>

        <button 
          className={filter === "Pending" ? "active-filter" : ""}
          onClick={() => setFilter("Pending")}>
          Pending
        </button>

        <button
          className={filter === "Completed" ? "active-filter" : ""}
          onClick={() => setFilter("Completed")}>
          Completed
        </button>
      </div>

      <button 
        onClick={clearCompleted}
        disabled={completedTasks === 0}>

          Clear Completed tasks

      </button>

      
      <ul>
        {filteredTodos.length === 0 ? (
          <li className="empty-state">
            {todos.length === 0
              ? "No tasks yet. Add your first task!"
              : `No ${filter.toLowerCase()} tasks found.`}
           </li>
        ) : (
          filteredTodos.map((todo) => (
            <li key={todo.id}>
              
              <input
                type="checkbox"
                checked={todo.completed}
                onChange={() => toggleTodo(todo.id)}
              />

             
              {editingId === todo.id ? (
                <input
                  type="text"
                  value={editInput}
                  onChange={(event) =>
                    setEditInput(event.target.value)
                  }
                />
              ) : (
                <span
                  style={{
                    textDecoration: todo.completed
                      ? "line-through"
                      : "none",
                  }}
                >
                  {todo.title}
                </span>
              )}

              
              {editingId === todo.id ? (
                <>
                  <button onClick={() => saveEdit(todo.id)}>
                    Save
                  </button>

                  <button onClick={cancelEdit}>
                    Cancel
                  </button>
                </>
              ) : (
                <button onClick={() => handleEditTodo(todo)}>
                  Edit
                </button>
              )}

              
              <button onClick={() => deleteTodo(todo.id)}>
                Delete
              </button>
            </li>
          ))
        )}
      </ul>
    </div>
  );
}

export default App;
