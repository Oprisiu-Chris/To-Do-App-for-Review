const todoListElement = document.querySelector(".todo-list");
const newTodoForm = document.querySelector("#new-todo-form");
const newTodo = document.querySelector("#new-todo");
const deleteBtn = document.querySelector("#btn-delete");
let stateArr = [];

function loadTodos() {
  fetch("http://localhost:4730/todos")
    .then((response) => response.json())
    .then((data) => {
      stateArr = data;
      render();
    });
}

function render() {
  todoListElement.innerHTML = "";
  stateArr.forEach((todo) => {
    const newLi = document.createElement("li");
    const text = document.createTextNode(todo.description);
    const check = document.createElement("input");
    check.type = "checkbox";
    check.checked = todo.done;
    check.addEventListener("change", () => updateTodo(todo));

    newLi.append(check, text);

    todoListElement.appendChild(newLi);
  });
}

function updateTodo(todo) {
  console.log(todo);
  const updateTodo = {
    id: todo.id,
    description: todo.description,
    done: !todo.done,
  };
  fetch("http://localhost:4730/todos/" + todo.id, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(updateTodo),
  })
    .then((response) => response.json())
    .then((updateTodoFromApi) => {
      const index = stateArr.findIndex((item) => item.id === todo.id);
      console.log(stateArr);
      stateArr.splice(index, 1, updateTodoFromApi);
      console.log(stateArr);
      render();
    });
}

loadTodos();

function addToDo(event) {
  event.preventDefault();

  const newToDo = {
    description: newTodo.value,
    done: false,
  };

  fetch("http://localhost:4730/todos", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(newToDo),
  })
    .then((response) => response.json())
    .then((newTodoFromApi) => {
      stateArr.push(newToDo);
      render();
    });
}
newTodoForm.addEventListener("submit", addToDo);

function deleteAllComplete() {
  const doneTodos = stateArr.filter((todos) => todos.done === true);

  const deleteFetches = [];
  doneTodos.forEach((item) => {
    deleteFetches.push(
      fetch("http://localhost:4730/todos/" + item.id, {
        method: "DELETE",
      })
    );
  });

  Promise.all(deleteFetches).then(() => {
    console.log("All done todos deleted");
    loadTodos();
  });
}
deleteBtn.addEventListener("click", deleteAllComplete);
