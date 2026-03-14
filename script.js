let tasks = [
  { id: 1, text: "Learn event delegation", column: "todo" },
  { id: 2, text: "Build Kanban Board", column: "inprogress" },
  { id: 3, text: "Deploy to Github Pages", column: "done" },
];

const taskInput = document.getElementById("taskInput");
const btnAddTask = document.getElementById("btnAddTask");
const lists = {
  todo: document.getElementById("list-todo"),
  inprogress: document.getElementById("list-inprogress"),
  done: document.getElementById("list-done"),
};

const counts = {
  todo: document.getElementById("count-todo"),
  inprogress: document.getElementById("count-inprogress"),
  done: document.getElementById("count-done"),
};

const moveButtons = {
  todo: `<button class="btn-move" data-direction="forward">→ In Progress</button>`,
  inprogress: `
    <button class="btn-move" data-direction="backward">← To Do</button>
    <button class="btn-move" data-direction="forward">→ Done</button>
  `,
  done: `<button class="btn-move" data-direction="backward">← In Progress</button>`,
};

function renderBoard() {
  lists.todo.innerHTML = "";
  lists.inprogress.innerHTML = "";
  lists.done.innerHTML = "";

  tasks.forEach((task) => {
    const cardHTML = `
    <div class="card" data-id="${task.id}" data-column="${task.column}">
      <p class="card-title">${task.text}</p>
      <div class="card-actions">
        <button class="btn-delete">🗑️ Delete</button>
        ${moveButtons[task.column]}
      </div>
    </div>
  `;

    lists[task.column].insertAdjacentHTML("beforeend", cardHTML);
  });

  if (lists.todo.innerHTML === "") {
    lists.todo.innerHTML = `<p class="empty-state">No tasks here</p>`;
  }
  if (lists.inprogress.innerHTML === "") {
    lists.inprogress.innerHTML = `<p class="empty-state">No tasks here</p>`;
  }
  if (lists.done.innerHTML === "") {
    lists.done.innerHTML = `<p class="empty-state">No tasks here</p>`;
  }

  counts.todo.textContent = tasks.filter(
    (task) => task.column === "todo",
  ).length;
  counts.inprogress.textContent = tasks.filter(
    (task) => task.column === "inprogress",
  ).length;
  counts.done.textContent = tasks.filter(
    (task) => task.column === "done",
  ).length;
}

renderBoard();

function addTask(text) {
  if (text === "") {
    alert("Please enter a task!");
    return;
  }

  const newTask = { id: Date.now(), text: text, column: "todo" };
  tasks.push(newTask);
  renderBoard();
  taskInput.value = "";
}

btnAddTask.addEventListener("click", () => {
  addTask(taskInput.value.trim());
});

taskInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    addTask(taskInput.value.trim());
  }
});

Object.values(lists).forEach((list) => {
  list.addEventListener("click", (e) => {
    if (e.target.classList.contains("btn-delete")) {
      const id = Number(e.target.closest(".card").dataset.id);
      tasks = tasks.filter((task) => task.id !== id);
      renderBoard();
    }

    if (e.target.classList.contains("btn-move")) {
      const id = Number(e.target.closest(".card").dataset.id);
      const currentColumn = e.target.closest(".card").dataset.column;
      const direction = e.target.dataset.direction;

      const columnOrder = ["todo", "inprogress", "done"];
      const currentIndex = columnOrder.indexOf(currentColumn);

      const newIndex =
        direction === "forward" ? currentIndex + 1 : currentIndex - 1;
      const newColumn = columnOrder[newIndex];

      tasks = tasks.map((task) =>
        task.id === id ? { ...task, column: newColumn } : task,
      );
      renderBoard();
    }
  });
});
