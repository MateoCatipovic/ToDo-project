import { useState } from "react";
import { SingleToDoProps } from "../../types/todo";

const SingleToDo: React.FC<SingleToDoProps> = (props) => {
  const [singleToDo, setSingleToDo] = useState("");

  const handleGetSingleToDo = () => {
    props.fetchSingleTodo(singleToDo);
    setSingleToDo("");
  };

  return (
    <>
      <div>
        <input
          className="input-single"
          value={singleToDo}
          onChange={(e) => setSingleToDo(e.target.value)}
          type="text"
          placeholder="Fetch todo by id"
        />
        <button
          style={{ backgroundColor: "green" }}
          onClick={handleGetSingleToDo}
        >
          Get Todo
        </button>
      </div>
    </>
  );
};

export default SingleToDo;
