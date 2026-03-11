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
