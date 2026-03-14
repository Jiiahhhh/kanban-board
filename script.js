let tasks = loadTasks();
let searchKeyword = "";

const searchInput = document.getElementById("searchInput");
const taskInput = document.getElementById("taskInput");
const priorityInput = document.getElementById("priorityInput");
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

  const keyword = searchKeyword.toLowerCase();

  const filteredTasks = tasks.filter((task) =>
    task.text.toLowerCase().includes(keyword),
  );

  filteredTasks.forEach((task) => {
    const cardHTML = `
    <div class="card" data-id="${task.id}" data-column="${task.column}">
      <p class="card-title">
        ${task.text}
        <span class="priority-badge priority-${task.priority || "medium"}">
            ${task.priority || "medium"}
        </span>
      </p>
      <div class="card-actions">
        <button class="btn-edit">✏️ Edit</button>
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

  counts.todo.textContent = filteredTasks.filter(
    (task) => task.column === "todo",
  ).length;
  counts.inprogress.textContent = filteredTasks.filter(
    (task) => task.column === "inprogress",
  ).length;
  counts.done.textContent = filteredTasks.filter(
    (task) => task.column === "done",
  ).length;
}

renderBoard();

function addTask(text) {
  if (text === "") {
    alert("Please enter a task!");
    return;
  }

  const validPriorities = ["low", "medium", "high"];
  let priority = priorityInput.value;

  if (!validPriorities.includes(priority)) {
    priority = "medium";
  }
  const newTask = {
    id: Date.now(),
    text: text,
    column: "todo",
    priority: priority,
  };
  tasks.push(newTask);
  saveTasks();
  searchKeyword = "";
  searchInput.value = "";
  renderBoard();
  taskInput.value = "";
  priorityInput.value = "medium";
}

btnAddTask.addEventListener("click", () => {
  addTask(taskInput.value.trim());
});

taskInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    addTask(taskInput.value.trim());
  }
});

searchInput.addEventListener("input", (e) => {
  searchKeyword = e.target.value;
  renderBoard();
});

Object.values(lists).forEach((list) => {
  list.addEventListener("click", (e) => {
    if (e.target.classList.contains("btn-edit")) {
      const id = Number(e.target.closest(".card").dataset.id);
      const task = tasks.find((task) => task.id === id);
      const newText = prompt("Edit task:", task.text);
      if (newText !== null && newText.trim() !== "") {
        tasks = tasks.map((task) =>
          task.id === id ? { ...task, text: newText.trim() } : task,
        );
        saveTasks();
        renderBoard();
      }
    }

    if (e.target.classList.contains("btn-delete")) {
      const id = Number(e.target.closest(".card").dataset.id);
      tasks = tasks.filter((task) => task.id !== id);
      saveTasks();
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
      saveTasks();
      renderBoard();
    }
  });
});

function saveTasks() {
  localStorage.setItem("kanban-tasks", JSON.stringify(tasks));
}

function loadTasks() {
  const saved = localStorage.getItem("kanban-tasks");
  return saved
    ? JSON.parse(saved)
    : [
        {
          id: 1,
          text: "Learn event delegation",
          column: "todo",
          priority: "medium",
        },
        {
          id: 2,
          text: "Build Kanban Board",
          column: "inprogress",
          priority: "high",
        },
        {
          id: 3,
          text: "Deploy to Github Pages",
          column: "done",
          priority: "low",
        },
      ];
}
