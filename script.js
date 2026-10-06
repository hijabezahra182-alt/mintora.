/* ================================
   MINTORA — TASK MANAGER
   ================================ */

const taskInput = document.getElementById("taskInput");
const addTaskBtn = document.getElementById("addTaskBtn");
const taskList = document.getElementById("taskList");
const emptyState = document.getElementById("emptyState");

const totalCount = document.getElementById("totalCount");
const completedCount = document.getElementById("completedCount");
const remainingCount = document.getElementById("remainingCount");

const clearCompletedBtn = document.getElementById("clearCompleted");
const filterButtons = document.querySelectorAll(".filter-btn");
const todayDate = document.getElementById("todayDate");


/* ================================
   STATE
   ================================ */

let tasks = JSON.parse(localStorage.getItem("mintoraTasks")) || [];

let currentFilter = "all";


/* ================================
   DATE
   ================================ */

function displayTodayDate() {

  const date = new Date();

  const options = {
    weekday: "short",
    month: "short",
    day: "numeric"
  };

  todayDate.textContent = date.toLocaleDateString(
    "en-US",
    options
  );
}


/* ================================
   SAVE TASKS
   ================================ */

function saveTasks() {

  localStorage.setItem(
    "mintoraTasks",
    JSON.stringify(tasks)
  );
}


/* ================================
   ADD TASK
   ================================ */

function addTask() {

  const text = taskInput.value.trim();

  if (text === "") {
    taskInput.focus();
    return;
  }

  const newTask = {
    id: Date.now(),
    text: text,
    completed: false
  };

  tasks.unshift(newTask);

  saveTasks();

  taskInput.value = "";

  renderTasks();

  taskInput.focus();
}


/* ================================
   DELETE TASK
   ================================ */

function deleteTask(id) {

  tasks = tasks.filter(function(task) {
    return task.id !== id;
  });

  saveTasks();

  renderTasks();
}


/* ================================
   TOGGLE TASK
   ================================ */

function toggleTask(id) {

  tasks = tasks.map(function(task) {

    if (task.id === id) {
      return {
        ...task,
        completed: !task.completed
      };
    }

    return task;
  });

  saveTasks();

  renderTasks();
}


/* ================================
   CLEAR COMPLETED
   ================================ */

function clearCompleted() {

  tasks = tasks.filter(function(task) {
    return !task.completed;
  });

  saveTasks();

  renderTasks();
}


/* ================================
   FILTER TASKS
   ================================ */

function getFilteredTasks() {

  if (currentFilter === "active") {

    return tasks.filter(function(task) {
      return !task.completed;
    });

  }

  if (currentFilter === "completed") {

    return tasks.filter(function(task) {
      return task.completed;
    });

  }

  return tasks;
}


/* ================================
   ESCAPE HTML
   ================================ */

function escapeHTML(text) {

  const div = document.createElement("div");

  div.textContent = text;

  return div.innerHTML;
}


/* ================================
   RENDER TASKS
   ================================ */

function renderTasks() {

  const filteredTasks = getFilteredTasks();

  taskList.innerHTML = "";

  filteredTasks.forEach(function(task) {

    const taskItem = document.createElement("div");

    taskItem.className = "task-item";

    if (task.completed) {
      taskItem.classList.add("completed");
    }

    taskItem.innerHTML = `
      <button
        class="check-btn"
        aria-label="Toggle task completion"
        data-action="toggle"
        data-id="${task.id}"
      >
        ${task.completed ? "✓" : ""}
      </button>

      <span class="task-text">
        ${escapeHTML(task.text)}
      </span>

      <button
        class="delete-btn"
        aria-label="Delete task"
        data-action="delete"
        data-id="${task.id}"
      >
        ×
      </button>
    `;

    taskList.appendChild(taskItem);
  });

  updateEmptyState(filteredTasks);

  updateStats();
}


/* ================================
   EMPTY STATE
   ================================ */

function updateEmptyState(filteredTasks) {

  if (filteredTasks.length === 0) {
    emptyState.style.display = "block";
  } else {
    emptyState.style.display = "none";
  }
}


/* ================================
   UPDATE STATS
   ================================ */

function updateStats() {

  const total = tasks.length;

  const completed = tasks.filter(function(task) {
    return task.completed;
  }).length;

  const remaining = total - completed;

  totalCount.textContent = total;

  completedCount.textContent = completed;

  remainingCount.textContent = remaining;
}


/* ================================
   FILTER BUTTONS
   ================================ */

filterButtons.forEach(function(button) {

  button.addEventListener("click", function() {

    filterButtons.forEach(function(btn) {
      btn.classList.remove("active");
    });

    button.classList.add("active");

    currentFilter = button.dataset.filter;

    renderTasks();
  });

});


/* ================================
   TASK LIST EVENTS
   ================================ */

taskList.addEventListener("click", function(event) {

  const button = event.target.closest("button");

  if (!button) {
    return;
  }

  const id = Number(button.dataset.id);

  const action = button.dataset.action;

  if (action === "toggle") {
    toggleTask(id);
  }

  if (action === "delete") {
    deleteTask(id);
  }

});


/* ================================
   ADD BUTTON
   ================================ */

addTaskBtn.addEventListener("click", addTask);


/* ================================
   ENTER KEY
   ================================ */

taskInput.addEventListener("keydown", function(event) {

  if (event.key === "Enter") {
    addTask();
  }

});


/* ================================
   CLEAR COMPLETED BUTTON
   ================================ */

clearCompletedBtn.addEventListener(
  "click",
  clearCompleted
);


/* ================================
   INITIALIZE
   ================================ */

displayTodayDate();

renderTasks();