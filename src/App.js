import './App.css';
import { Navbar } from './components/Navbar';
import { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { FaEdit } from "react-icons/fa";
import { AiFillDelete } from "react-icons/ai";

function App() {
  const [todo, settodo] = useState("")
  const [todos, settodos] = useState([])
  const [showFinished, setshowFinished] = useState(true)

  const gettodos = () => {
    return localStorage.getItem("todos");
  }

  // Load todos from localStorage when the component mounts
  useEffect(() => {
    let todoString = gettodos();
    if (todoString) {
      let todos = JSON.parse(todoString);
      settodos(todos);
    }
  }, []);

  // Save todos to localStorage whenever the todos state changes
  useEffect(() => {
    if (todos.length > 0 ) {
      localStorage.setItem("todos", JSON.stringify(todos));
    }
  }, [todos]);

  const toggledFinished = () => {
    setshowFinished(!showFinished);
  }

  const handleEdit = (e, id) => {
    let t = todos.filter(item => {
      return item.id === id;
    });

    settodo(t[0].todo);
    let newTodos = todos.filter(item => {
      return item.id !== id;
    });
    settodos(newTodos);
  }

  const handleDelete = (e, id) => {
    let newTodos = todos.filter(item => {
      return item.id !== id;
    });
    settodos(newTodos);
  }

  const handleAdd = () => {
    settodos([...todos, { id: uuidv4(), todo, isCompleted: false }]);
    settodo("");
  }

  const handleChange = (e) => {
    settodo(e.target.value);
  };

  const handleCheckbox = (e) => {
    let id = e.target.name;
    let index = todos.findIndex(item => {
      return item.id === id;
    });
    let newTodos = [...todos];
    newTodos[index].isCompleted = !newTodos[index].isCompleted;
    settodos(newTodos);
  };

  const checkBox = {
    height: 15,
    width: 15,
    border: "none",
    borderRadius: 4, /* Rounded corners */
    outline: "none", /* Remove outline */
    cursor: "pointer", /* Change cursor to pointer */
    margin: 5,
  }

  return (
    <>
      <Navbar />
      <div className="container">
        <h1 className='heading'>TaskTracker - Manage Your Todos At One Place </h1>
        <div className="addtodo">
          <h1 className='add'>Add a todo</h1>
          <input onChange={handleChange} value={todo} type="text" placeholder='Add Here...' />
          <button onClick={handleAdd} disabled={todo.trim().length < 1}>Save</button>
        </div>
        <div className='finished'>
          <input type="checkbox" style={checkBox} onChange={toggledFinished} checked={showFinished} />
          <h3> Show Finished</h3>
        </div>
        <h2>Your ToDos</h2>
        {todos.length === 0 && <div style={{ fontSize: 20 }}>No Todos to display</div>}
        {todos.map(item => {
          return (
            (showFinished || !item.isCompleted) && <div key={item.id} >
              <div className="todo">
                <div className='checkbox'>
                  <input onClick={handleCheckbox} type="checkbox" style={checkBox} checked={item.isCompleted} name={item.id} />
                  <p className={item.isCompleted ? "text line" : "text "}>{item.todo}</p>
                </div>
                <div className="button">
                  <button onClick={(e) => { handleEdit(e, item.id) }}><FaEdit /></button>
                  <button onClick={(e) => { handleDelete(e, item.id) }}><AiFillDelete /></button>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </>
  );
}

export default App;
