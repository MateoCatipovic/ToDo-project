import React, { useState } from "react";
import { ToDo, TodoTableProps } from "../../types/todo";
import { GoTrash } from "react-icons/go";
import { CiEdit } from "react-icons/ci";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import "bootstrap/dist/css/bootstrap.min.css";

const TodoTable: React.FC<TodoTableProps> = (props) => {
  const [show, setShow] = useState(false);
  const [editedTodoText, setEditedTodoText] = useState("");
  const [editedTodoId, setEditedTodoId] = useState("");

  const handleClose = () => {
    setShow(false);
    setEditedTodoText("");
    setEditedTodoId("");
  };

  const handleShow = (todo: ToDo) => {
    setShow(true);
    setEditedTodoText(todo.text);
    setEditedTodoId(todo.id);
  };

  const handleSaveChanges = () => {
    // Call a function to update the text of the todo item with editedTodoId
    // Pass editedTodoText as the updated text
    // Reset state after saving changes
    props.editTodo(editedTodoId, editedTodoText);
    handleClose();
  };

  return (
    <table>
      <thead>
        <tr>
          <th></th>
          <th>Text</th>
          <th>Status</th>
          <th>Created at</th>
          <th>Updated at</th>
          <th>Action</th>
        </tr>
      </thead>
      <tbody>
        {Array.isArray(props.todos) ? (
          props.todos.map((todo: ToDo) => (
            <tr key={todo.id}>
              <td>
                <input
                  className="checkbox"
                  defaultChecked={todo.done}
                  type="checkbox"
                  onClick={() => props.toggleTodo(todo.id, todo.done)}
                />
              </td>
              <td
                style={{ textDecoration: todo.done ? "line-through" : "none" }}
              >
                {todo.text}
              </td>
              <td>{todo.done ? "Done" : "Pending"}</td>
              <td>
                {new Date(todo.createdAt).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                  hour: "numeric",
                  minute: "numeric",
                  second: "numeric",
                })}
              </td>
              <td>
                {new Date(todo.updatedAt).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                  hour: "numeric",
                  minute: "numeric",
                  second: "numeric",
                })}
              </td>

              <td>
                <CiEdit
                  style={{
                    color: "blue",
                    padding: "8px",
                    border: "none",
                    cursor: "pointer",
                  }}
                  onClick={() => handleShow(todo)}
                  cursor="pointer"
                  size={40}
                />

                <Modal show={show} onHide={handleClose}>
                  <Modal.Header closeButton>
                    <Modal.Title>Edit todo</Modal.Title>
                  </Modal.Header>
                  <Modal.Body>
                    <input
                    style={{borderRadius: '8px', paddingLeft: '5px'}}
                      value={editedTodoText}
                      onChange={(e) => setEditedTodoText(e.target.value)}
                      type="text"
                      placeholder="Type here"
                    />
                  </Modal.Body>
                  <Modal.Footer>
                    <Button  variant="secondary" onClick={handleClose}>
                      Close
                    </Button>
                    <Button variant="primary" onClick={handleSaveChanges}>
                      Save Changes
                    </Button>
                  </Modal.Footer>
                </Modal>

                <GoTrash
                  style={{
                    color: "red",
                    padding: "8px",
                    border: "none",
                    cursor: "pointer",
                  }}
                  //onClick={() => setopenModalDelete(true)}
                  onClick={() => {
                    props.deleteTodo(todo.id);
                  }}
                  cursor="pointer"
                  size={40}
                />
              </td>
            </tr>
          ))
        ) : (
          <tr>
            <td>
              <input
                className="checkbox"
                defaultChecked={(props.todos as ToDo).done}
                type="checkbox"
                onClick={() =>
                  props.toggleTodo(
                    (props.todos as ToDo).id,
                    (props.todos as ToDo).done
                  )
                }
              />
            </td>
            <td
              style={{
                textDecoration: (props.todos as ToDo).done
                  ? "line-through"
                  : "none",
              }}
            >
              {(props.todos as ToDo).text}
            </td>
            <td>{(props.todos as ToDo).done ? "Done" : "Pending"}</td>
            <td>
              {new Date((props.todos as ToDo).createdAt).toLocaleDateString(
                "en-US",
                {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                  hour: "numeric",
                  minute: "numeric",
                  second: "numeric",
                }
              )}
            </td>
            <td>
              {new Date((props.todos as ToDo).updatedAt).toLocaleDateString(
                "en-US",
                {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                  hour: "numeric",
                  minute: "numeric",
                  second: "numeric",
                }
              )}
            </td>

            <td>
              <CiEdit
                style={{
                  color: "blue",
                  padding: "8px",
                  border: "none",
                  cursor: "pointer",
                }}
                onClick={() => handleShow(props.todos as ToDo)}
                cursor="pointer"
                size={40}
              />

              <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                  <Modal.Title>Edit todo</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                  <input
                    value={editedTodoText}
                    onChange={(e) => setEditedTodoText(e.target.value)}
                    type="text"
                    placeholder="Type here"
                  />
                </Modal.Body>
                <Modal.Footer>
                  <Button variant="secondary" onClick={handleClose}>
                    Close
                  </Button>
                  <Button variant="primary" onClick={handleSaveChanges}>
                    Save Changes
                  </Button>
                </Modal.Footer>
              </Modal>

              <GoTrash
                style={{
                  color: "red",
                  padding: "8px",
                  border: "none",
                  cursor: "pointer",
                }}
                //onClick={() => setopenModalDelete(true)}
                onClick={() => {
                  props.deleteTodo((props.todos as ToDo).id);
                }}
                cursor="pointer"
                size={40}
              />
            </td>
          </tr>
        )}
      </tbody>
    </table>
  );
};

export default TodoTable;
