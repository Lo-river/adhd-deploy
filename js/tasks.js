document.addEventListener('DOMContentLoaded', function () {
  let tasks = JSON.parse(localStorage.getItem('tasks')) || {};
  let currentTaskId = null;
  let isEditing = false; // Track if the task is being edited
  let newTaskCreated = false; 
  setupFilterMenu();
  setupSorting();
  
  /* Hantera Popup */
  function openToDoModal(taskId, isEditingMode = false) {
      let todoNode = document.querySelector("#todo");
      if (!todoNode) return;
      
      todoNode.classList.add("todo-active");
      todoNode.style.display = 'block'; 
      currentTaskId = taskId;

      const title = todoNode.querySelector(".todo-title");
      const category = todoNode.querySelector(".category-title");
      const description = todoNode.querySelector(".todo-description");
      const saveBtn = document.querySelector(".save-btn");
      const editIcon = document.querySelector(".edit-btn");
      
    // Clear previous modal state
    todoNode.classList.remove("edit-task", "view-task");

    if (isEditingMode) {
        saveBtn.style.display = "block"; // visa save-knappen i redigeringsläge
        editIcon.style.display = "none"; // göm redigeringsikonen
        todoNode.classList.add("edit-task");
    } else {
        saveBtn.style.display = "none"; // göm save-knappen i view-läge
        editIcon.style.display = "block"; // visa redigeringsikonen
        todoNode.classList.add("view-task");
    }
    
    if (tasks[taskId]) {
        title.textContent = tasks[taskId].title;
        category.textContent = tasks[taskId].category;
        description.textContent = tasks[taskId].description;
    } else {
        title.textContent = "New Task";
        category.textContent = "No Category";
        description.textContent = "Enter task description...";
    }
      // Set contenteditable based on mode
      title.setAttribute("contenteditable", isEditingMode ? "true" : "false");
      category.setAttribute("contenteditable", isEditingMode ? "true" : "false");
      description.setAttribute("contenteditable", isEditingMode ? "true" : "false");
  } 
  // Close modal function
  function closeToDo() {
      let todoNode = document.querySelector("#todo");
      if (!todoNode) return;
      
      newTaskCreated = false;
      isEditing = false;
      todoNode.style.display = 'none'; 

      if (newTaskCreated && currentTaskId && !isEditing) { 
      delete tasks[currentTaskId]; 
      localStorage.setItem("tasks", JSON.stringify(tasks));
    }
  }

    // Event listeners
    document.getElementById("add-task-btn").addEventListener("click", function () {
      const taskId = "task" + Date.now() + Math.floor(Math.random() * 1000);
      tasks[taskId] = { title: "New Task", category: "No Category", description: "Enter task details...", checked: false };
      localStorage.setItem("tasks", JSON.stringify(tasks));
      newTaskCreated = true;
  

  // Enable editing when "pen icon" is clicked
  function enableEditing() {
    const todoNode = document.querySelector("#todo");
    const title = document.querySelector(".todo-title");
    const category = document.querySelector(".category-title");
    const description = document.querySelector(".todo-description");
    const saveBtn = document.querySelector(".save-btn");
    const editIcon = document.querySelector(".edit-btn");
    
    if (!isEditing) {
      // Switch to edit mode
      todoNode.classList.remove("view-task"); // Remove view mode class
      todoNode.classList.add("edit-task"); // Add edit mode class
      title.setAttribute("contenteditable", "true");
      category.setAttribute("contenteditable", "true");
      description.setAttribute("contenteditable", "true");  
        
      saveBtn.style.display = "block"; // Show save button
      editIcon.style.display = "none"; // Hide edit button
      isEditing = true; // Mark as editing
      }
  }

  // Save task function
  function saveTask() {
      if (currentTaskId) {
          const title = document.querySelector(".todo-title").textContent;
          const category = document.querySelector(".category-title").textContent;
          const description = document.querySelector(".todo-description").textContent;

          tasks[currentTaskId] = { title, category, description }; 
          localStorage.setItem("tasks", JSON.stringify(tasks));
         
          updateTaskList();
          closeToDo();
      }
  }
// Update the task list in the UI
  function updateTaskList() {
      console.log("Updating Task List", tasks);
      const taskList = document.getElementById("todo-list");
      taskList.innerHTML = "";
      Object.keys(tasks).forEach(taskId => {
          const task = tasks[taskId];
          const li = document.createElement("li");
          
          if (task.checked) {
          li.classList.add("completed"); 
          }

      const checkboxLabel = document.createElement("label");
      checkboxLabel.classList.add("custom-checkbox");
      const checkboxInput = document.createElement("input");
      checkboxInput.type = "checkbox";
      checkboxInput.classList.add("checkbox-input");
      checkboxInput.id = taskId;
      checkboxInput.checked = task.checked || false;
      const checkboxIcon = document.createElement("span");
      checkboxIcon.classList.add("checkbox-icon");
      
      const customIcon = document.createElement("img");
      customIcon.src = task.checked ? "/images/iconchecked.svg" : "/images/iconunchecked.svg";
      checkboxIcon.appendChild(customIcon);
      
      checkboxInput.style.display = "none";
      checkboxLabel.appendChild(checkboxInput);
      checkboxLabel.appendChild(checkboxIcon);
      
      checkboxInput.addEventListener("change", function() {
          task.checked = checkboxInput.checked; 
          localStorage.setItem("tasks", JSON.stringify(tasks)); 
          updateTaskList(); 

  // Confetti 
  if (checkboxInput.checked) {
    fire(0.25, {
      spread: 26,
      startVelocity: 55,
    });
    fire(0.2, {
      spread: 60,
    });
    fire(0.35, {
      spread: 100,
      decay: 0.91,
      scalar: 0.8,
    });
    fire(0.1, {
      spread: 120,
      startVelocity: 25,
      decay: 0.92,
      scalar: 1.2,
    });
    fire(0.1, {
      spread: 120,
      startVelocity: 45,
    });
  }
});

          const showTaskBtn = document.createElement("button");
          showTaskBtn.textContent = task.title;
          showTaskBtn.classList.add("show-task-btn");
          showTaskBtn.setAttribute("data-task", taskId);
          showTaskBtn.addEventListener("click", function () {
              openToDoModal(taskId, false); // Open modal in view mode (not editable)
          });

          if (task.checked) {
            showTaskBtn.classList.add("completed")
          }

          const deleteBtn = document.createElement("button");
          deleteBtn.classList.add("delete-btn");
          deleteBtn.setAttribute("data-task", taskId);
          deleteBtn.addEventListener("click", function () {
              deleteTask(taskId);
          });
    
          li.appendChild(checkboxLabel);
          // li.appendChild(taskTitle);
          li.appendChild(showTaskBtn);
          li.appendChild(deleteBtn);
          taskList.appendChild(li);
      });
  }

  // Add new task function
  function addNewTask() {
      const taskId = "task" + Date.now() + Math.floor(Math.random() * 1000);
      console.log("Current tasks in localStorage:", localStorage.getItem("tasks"));
       
      tasks[taskId] = { title: "New Task", category: "No Category", description: "Enter task details...", checked: false };
      localStorage.setItem("tasks", JSON.stringify(tasks));
      newTaskCreated = true;
  
      updateTaskList();

      currentTaskId = taskId;  
      openToDoModal(taskId, true); // Open in editing mode for a new task
      enableEditing();
  } 

  // Delete task function
  function deleteTask(taskId) {
      delete tasks[taskId];
      localStorage.setItem("tasks", JSON.stringify(tasks));
      updateTaskList();
  }

  
  // Event listeners  
  document.getElementById("add-task-btn").addEventListener("click", addNewTask);
  document.querySelector(".save-btn").addEventListener("click", saveTask);
  document.querySelector(".close-icon").addEventListener("click", closeToDo);
//   document.querySelector(".edit-icon").addEventListener("click", enableEditing);
  document.querySelector(".edit-btn").addEventListener("click", enableEditing);
  
// Fire confetti function
const count = 400,
defaults = {
    origin: { y: 0.91 },
};

function fire(particleRatio, opts) {
confetti(
    Object.assign({}, defaults, opts, {
        particleCount: Math.floor(count * particleRatio),
    })
);
}

updateTaskList(); 
});

// document.querySelector(".edit-icon").addEventListener("click", enableEditing);
document.querySelector(".edit-btn").addEventListener("click", enableEditing);})

// Funktionerna för filter-menyn
function setupFilterMenu() {
  const filterBtn = document.getElementById("filter-btn");
  const filterMenu = document.getElementById("filter-menu");
  const filterFinished = document.getElementById("filter-finished");
  const filterUpcoming = document.getElementById("filter-upcoming");
  // const upcomingSection = document.getElementById("upcoming-section");
  // const finishedSection = document.getElementById("finished-section");

  filterBtn.style.position = "relative";

  // Toggla filter-menyn
  filterBtn.addEventListener("click", (event) => {
      event.stopPropagation();
      filterMenu.classList.toggle("show");
      filterBtn.classList.toggle("active");
  });

    // Filter checkboxes
    filterFinished.addEventListener("change", updateTaskList);
    filterUpcoming.addEventListener("change", updateTaskList);
  
  document.addEventListener("click", (event) => {
      if (!filterMenu.contains(event.target) && !filterBtn.contains(event.target)) {
          filterMenu.classList.remove("show");
          filterBtn.classList.remove("active");
      }
  });

  if (filterFinished && filterUpcoming) {
      filterFinished.addEventListener("change", function () {
          finishedSection.style.display = this.checked ? "block" : "none";
      });

      filterUpcoming.addEventListener("change", function () {
          upcomingSection.style.display = this.checked ? "block" : "none";
      });
  }
}

// Funktion för att hantera sortering av events
function setupSorting() {
  const sortBtn = document.getElementById("sort-btn");
  const eventsContainer = document.getElementById("events-container");
  const upcomingSection = document.getElementById("upcoming-section");
  const finishedSection = document.getElementById("finished-section");

  let isSortedAscending = true;
  sortBtn.addEventListener("click", () => {
      if (isSortedAscending) {
          eventsContainer.insertBefore(finishedSection, upcomingSection);
      } else {
          eventsContainer.insertBefore(upcomingSection, finishedSection);
      }
      isSortedAscending = !isSortedAscending;
  });
}