// Function to create a new task element
function createTaskElement(task) {
    const taskElement = document.createElement("div");
    taskElement.classList.add("task");
    taskElement.textContent = task.title;
    taskElement.dataset.taskId = task.id;

    const buttonsContainer = document.createElement("div");
    if (task.status === "todo") {
        const startButton = document.createElement("button");
        startButton.classList.add("start-button");
        startButton.textContent = "Start";
        startButton.addEventListener("click", () => {
            startTask(task.id);
        });

        buttonsContainer.appendChild(startButton);
    } else if (task.status === "doing" || task.status === "started") {
        if (task.status === "started") {
            const startButton = document.createElement("button");
            startButton.classList.add("start-button");
            startButton.textContent = "Start";
            startButton.addEventListener("click", () => {
                startTask(task.id);
            });

            buttonsContainer.appendChild(startButton);
        }

        const doneButton = document.createElement("button");
        doneButton.classList.add("done-button");
        doneButton.textContent = "Done";
        doneButton.addEventListener("click", () => {
            markTaskAsDone(task.id);
        });

        buttonsContainer.appendChild(doneButton);
    }

    const deleteButton = document.createElement("button");
    deleteButton.classList.add("delete-button");
    deleteButton.textContent = "Delete";
    deleteButton.dataset.taskId = task.id;
    deleteButton.addEventListener("click", (e) => {
        const taskId = parseInt(e.target.dataset.taskId);
        deleteTask(taskId);
    });

    buttonsContainer.appendChild(deleteButton);
    taskElement.appendChild(buttonsContainer);
    taskElement.addEventListener("dragstart", (e) => {
        e.dataTransfer.setData("text/plain", task.id);
    });
    return taskElement;
}



const tasks = [
    { id: 1, title: "Task 1", status: "todo" },
    { id: 2, title: "Task 2", status: "doing" },
    { id: 3, title: "Task 3", status: "done" },
];

const todoTasks = document.getElementById("todo-tasks");
const doingTasks = document.getElementById("doing-tasks");
const doneTasks = document.getElementById("done-tasks");

// Populate columns with tasks
tasks.forEach(task => {
    const taskElement = createTaskElement(task);
    if (task.status === "todo") {
        todoTasks.appendChild(taskElement);
    } else if (task.status === "doing") {
        doingTasks.appendChild(taskElement);
    } else if (task.status === "done") {
        doneTasks.appendChild(taskElement);
    }
});

// Function to delete a task
function deleteTask(taskId) {
    const taskIndex = tasks.findIndex(task => task.id === taskId);
    if (taskIndex !== -1) {
        tasks.splice(taskIndex, 1);
        const taskElement = document.querySelector(`[data-task-id="${taskId}"]`);
        taskElement.remove();
    }
}


const addTaskButton = document.getElementById("add-task-button");
const addTaskModal = document.getElementById("add-task-modal");
const closeAddTaskModal = document.getElementById("close-modal");
const taskTitleInput = document.getElementById("task-title-input");
const submitTaskButton = document.getElementById("submit-task-button");

addTaskButton.addEventListener("click", () => {
    addTaskModal.style.display = "block";
});

closeAddTaskModal.addEventListener("click", () => {
    addTaskModal.style.display = "none";
});

submitTaskButton.addEventListener("click", () => {
    const title = taskTitleInput.value;
    if (title) {
        const newTask = {
            id: tasks.length + 1,
            title: title,
            status: "todo"
        };

        tasks.push(newTask);

        const taskElement = createTaskElement(newTask);
        todoTasks.appendChild(taskElement);

        addTaskModal.style.display = "none";
        taskTitleInput.value = ""; // Clear input
    }
});


function startTask(taskId) {
    console.log("Start button clicked for task:", taskId);
    const task = tasks.find(task => task.id === taskId);
    if (task && task.status === "todo") {
        task.status = "started";

        const taskElement = document.querySelector(`[data-task-id="${taskId}"]`);
        const startButton = taskElement.querySelector(".start-button");
        startButton.remove();

        const doneButton = document.createElement("button");
        doneButton.classList.add("done-button");
        doneButton.textContent = "Done";
        doneButton.addEventListener("click", () => {
            markTaskAsDone(task.id);
        });

        const deleteButton = taskElement.querySelector(".delete-button");
        deleteButton.remove();

        const buttonsContainer = document.createElement("div");
        buttonsContainer.classList.add("button-container");
        buttonsContainer.appendChild(doneButton);
        buttonsContainer.appendChild(deleteButton);

        taskElement.appendChild(buttonsContainer);
        taskElement.classList.add("started-task");
        doingTasks.appendChild(taskElement);


        updateTaskStatus(taskId, "started");
        taskElement.querySelector(".done-button").addEventListener("click", () => {
            markTaskAsDone(task.id);
        });
    }
}


function markTaskAsDone(taskId) {
    const task = tasks.find(task => task.id === taskId);
    if (task && (task.status === "doing" || task.status === "started")) {
        task.status = "done";

        const taskElement = document.querySelector(`[data-task-id="${taskId}"]`);
        taskElement.querySelector(".done-button").remove();
        doneTasks.appendChild(taskElement);
        updateTaskStatus(taskId, "done");
    }
}