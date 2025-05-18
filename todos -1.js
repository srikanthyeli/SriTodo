let todoItemsContainer = document.getElementById("todoItemsContainer");
let addTodoButton = document.getElementById("addTodoButton");
let saveTodoButton = document.getElementById("saveTodoButton");

function getTodoListFromLocalStorage() {
    let stringifiedTodoList = localStorage.getItem("todoList");
    let parsedTodoList = JSON.parse(stringifiedTodoList);
    if (parsedTodoList === null) {
        return [];
    } else {
        return parsedTodoList;
    }
}

let todoList = getTodoListFromLocalStorage();
let todosCount = todoList.length;

saveTodoButton.onclick = function() {
    localStorage.setItem("todoList", JSON.stringify(todoList));
};

function onAddTodo() {
    let userInputElement = document.getElementById("todoUserInput");
    let deadLineElement = document.getElementById("deadline");
    let userInputValue = userInputElement.value;
    let priorityElement = document.getElementById("priority")
    let deadLine = deadLineElement.value
    let priority = priorityElement.value

    if (userInputValue === "") {
        alert("Enter Valid Text");
        return;
    }

    todosCount = todosCount + 1;

    let newTodo = {
        text: userInputValue,
        uniqueNo: todosCount,
        isChecked: false,
        priority: priority,
        deadLine: deadLine

    };
    todoList.push(newTodo);
    createAndAppendTodo(newTodo);
    userInputElement.value = "";
}

addTodoButton.onclick = function() {
    onAddTodo();
};

function onTodoStatusChange(checkboxId, labelId, todoId) {
    let checkboxElement = document.getElementById(checkboxId);
    let labelElement = document.getElementById(labelId);
    labelElement.classList.toggle("checked");

    let todoObjectIndex = todoList.findIndex(function(eachTodo) {
        let eachTodoId = "todo" + eachTodo.uniqueNo;

        if (eachTodoId === todoId) {
            return true;
        } else {
            return false;
        }
    });

    let todoObject = todoList[todoObjectIndex];

    if (todoObject.isChecked === true) {
        todoObject.isChecked = false;
    } else {
        todoObject.isChecked = true;
    }

}

function onDeleteTodo(todoId) {
    let todoElement = document.getElementById(todoId);
    todoItemsContainer.removeChild(todoElement);

    let deleteElementIndex = todoList.findIndex(function(eachTodo) {
        let eachTodoId = "todo" + eachTodo.uniqueNo;
        if (eachTodoId === todoId) {
            return true;
        } else {
            return false;
        }
    });

    todoList.splice(deleteElementIndex, 1);
}

function createAndAppendTodo(todo) {
    let todoId = "todo" + todo.uniqueNo;
    let checkboxId = "checkbox" + todo.uniqueNo;
    let labelId = "label" + todo.uniqueNo;

    let todoElement = document.createElement("li");
    todoElement.classList.add("todo-item-container", "d-flex", "flex-row");
    todoElement.id = todoId;
    todoItemsContainer.appendChild(todoElement);

    let inputElement = document.createElement("input");
    inputElement.type = "checkbox";
    inputElement.id = checkboxId;
    inputElement.checked = todo.isChecked;

    inputElement.onclick = function() {
        onTodoStatusChange(checkboxId, labelId, todoId);
    };

    inputElement.classList.add("checkbox-input");
    todoElement.appendChild(inputElement);

    let labelContainer = document.createElement("div");
    labelContainer.classList.add("label-container", "d-flex", "flex-row");
    todoElement.appendChild(labelContainer);

    let labelElement = document.createElement("label");
    labelElement.setAttribute("for", checkboxId);
    labelElement.id = labelId;
    labelElement.classList.add("checkbox-label");
    labelElement.textContent = todo.text;
    if (todo.isChecked === true) {
        labelElement.classList.add("checked");
    }

    labelContainer.appendChild(labelElement);
    let prioritycon = document.createElement("div");
    prioritycon.classList.add("priority-container,d-flex,flex-row")
    labelContainer.appendChild(prioritycon)

    // --- Edit Icon Container ---
    let editIconContainer = document.createElement("div");
    editIconContainer.classList.add("edit-icon-container");
    labelContainer.appendChild(editIconContainer);

    let editIcon = document.createElement("i");
    editIcon.classList.add("fas", "fa-edit", "edit-icon");

    editIcon.onclick = function() {
        onEditTodo(todoId);
    };

    editIconContainer.appendChild(editIcon);

    let priorityEle = document.createElement("p");
    priorityEle.classList.add("priority-icon");
    priorityEle.textContent = todo.priority;
    prioritycon.appendChild(priorityEle)

    let statusEle = document.createElement("p")
    const today = new Date()
    let givenDeadLine = todo.deadLine
    let updateDealine = new Date(givenDeadLine)
    console.log(givenDeadLine)
    updateDealine.setHours(0, 0, 0, 0)
    today.setHours(0, 0, 0, 0)
    if (today > updateDealine) {
        statusEle.textContent = "Overdue";
        statusEle.classList.add("overdue")
    } else {
        const diff = updateDealine - today
        const diffDays = Math.ceil(diff / (1000 * 60 * 60 * 24));
        statusEle.textContent = diffDays
        statusEle.classList.add("due")
    }

    prioritycon.appendChild(statusEle)

    let date = document.createElement("p")
    date.textContent = todo.deadLine
    date.classList.add("date-icon")
    prioritycon.appendChild(date)



    let deleteIconContainer = document.createElement("div");
    deleteIconContainer.classList.add("delete-icon-container");
    labelContainer.appendChild(deleteIconContainer);

    let deleteIcon = document.createElement("i");
    deleteIcon.classList.add("far", "fa-trash-alt", "delete-icon");

    deleteIcon.onclick = function() {
        onDeleteTodo(todoId);
    };

    deleteIconContainer.appendChild(deleteIcon);
}

for (let todo of todoList) {
    createAndAppendTodo(todo);
}