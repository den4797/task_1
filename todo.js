function TodoList() {
    const tasks = new Map();
    let current_id = 0;
    const addTask = function (task) {
        task.id = current_id
        tasks.set(current_id, task);
        current_id += 1;
        return task;
    }
    // JSON object
    addTask({ description: 'create todo list', completed: false});
    addTask({ description: 'add filtering by priority', completed: false});
    addTask({ description: 'use rest api backend', completed: false});

    return {
        complete_task: function (task_id) {
            const task = tasks.get(parseInt(task_id));
            task.completed = true;
        },
        uncomplete_task : function(task_id) {
            const task = tasks.get(parseInt(task_id));
            task.completed = false;
        },
        edit_task: function(task_id, description) {
            const task = tasks.get(parseInt(task_id));
            task.description = description;
        },
        get_task: function (task_id) {
            return tasks.get(task_id);
        },
        add_task: function (task) {
            return addTask(task);
        },
        remove_task: function (task_id) {
            return tasks.delete(parseInt(task_id));
        },
        all_tasks: function () {
            return tasks.values();
        },
    }
}
const todoList = new TodoList();
let activeFilterType = "all";

showTaskList();

function add() {
    const description = document.getElementById('task').value;

    todoList.add_task({'description': description, 'completed': false});
    showTaskList();
}

function changeLabel() {
    const id = this.getAttribute('id');

    $('label[id="' + id + '"]').hide();
    $('.edit-input[id="' + id + '"]').show().focus();
}

function labelChanged() {
    const id = this.getAttribute('id'),
        description = $('.edit-input[id=' + id + ']').val();

    todoList.edit_task(id, description);
    showTaskList();
}

function changeStatus(task_id) {
    const task = todoList.get_task(task_id);

    if (task.completed === true) {
        todoList.uncomplete_task(task_id)
    } else {
        todoList.complete_task(task_id)
    }
    showTaskList();
}

function isTaskCompleted(task_id) {
    const task = todoList.get_task(task_id);
    return task.completed;
}

function checkedProperty(task_id) {
    if (isTaskCompleted(task_id)) {
        return "checked=\"true\"";
    } else {
        return "";
    }
}

function remove() {
    const id = this.getAttribute('id');
    todoList.remove_task(id);
    showTaskList();
}

function taskList() {
    let html = '';
    for (let todo of todoList.all_tasks()) {
        const onclick ="onClick=\"changeStatus(" + todo.id + ")\"",
            checked = checkedProperty(todo.id);

        html += '<div class="input-group style"><span class="input-group"><input type="checkbox" id="' + todo.id + '" ' + onclick + ' ' + checked + '><label for="checkbox" id="' + todo.id + '" class="edit">' + todo.description + '</label><input class="edit-input" id="' + todo.id + '"/></span><span class="input-group-btn"><button aria-label="Close" class="close remove" id="' + todo.id + '"><span aria-hidden="true">&times;</span></button></span></div>';
    }

    document.getElementById('todos').innerHTML = html;

    const buttons = document.getElementsByClassName('remove'),
        edit = document.getElementsByClassName('edit'),
        edit_inputs = document.getElementsByClassName('edit-input');

    for (let i = 0; i < buttons.length; i++) {
        buttons[i].addEventListener('click', remove);
    }

    for (let i = 0; i < edit.length; i++) {
        edit[i].addEventListener('dblclick', changeLabel);
        edit[i].addEventListener('touchmove', changeLabel);
    }

    for (let i = 0; i < edit_inputs.length; i++) {
        edit_inputs[i].addEventListener('focusout', labelChanged);
    }
}

function calculateCounter() {
    const counter = $('#counter'),
        inputs = $("input[type=checkbox]"),
        inputsCh = inputs.filter(':checked'),
        tempArray = [inputsCh.length, inputs.length],
        informationText = tempArray[1]-tempArray[0];
    counter.html(informationText);
}

function filter(typeFilter) {
    activeFilterType = typeFilter;

    const inputs = $("div input[type=checkbox]"),
      inputsCh = inputs.filter(":checked"),
      inputsNotCh = inputs.filter(":not(:checked)"),
      parentInputs = inputsCh.parent().parent(),
      parentNotInputs = inputsNotCh.parent().parent(),
      allFilter = $('#allFilter'),
      completedFilter = $('#completedFilter'),
      activeFilter = $('#activeFilter');

    switch (typeFilter) {
        case "all":
            allFilter.addClass("active");
            completedFilter.removeClass("active");
            activeFilter.removeClass("active");
            return inputs.parents().show()
        case "active":
            allFilter.removeClass("active");
            completedFilter.removeClass("active");
            activeFilter.addClass("active");
            return (parentInputs.hide(), parentNotInputs.show(), inputsNotCh.show());
        case "completed":
            allFilter.removeClass("active");
            completedFilter.addClass("active");
            activeFilter.removeClass("active");
            return (parentNotInputs.hide(), inputsCh.parents().show());
    }
}

function showTaskList() {
    taskList();
    filter(activeFilterType);
    calculateCounter();
}

function selectAll() {
    const inputs = $("input[type=checkbox]");

    for (let i = 0; i < inputs.length; i++ ) {
        inputs[i].checked=true;
        todoList.complete_task(inputs[i].id);
    }
    showTaskList();
}

function deselectAll() {
    const inputs = $("input[type=checkbox]");

    for (let i = 0; i < inputs.length; i++ ) {
        if (inputs[i].checked) {
            todoList.uncomplete_task(inputs[i].id);
        }
    }
    showTaskList();
}

function completedRemove() {
    const inputs = $("input[type=checkbox]");

    for (let i = 0; i < inputs.length; i++ ) {
        if (inputs[i].checked) {
            todoList.remove_task(inputs[i].id)
        }
    }
    showTaskList();
}

document.querySelector("#allFilter").addEventListener('click', () => filter("all"));

document.querySelector("#activeFilter").addEventListener('click', () => filter("active"));

document.querySelector("#completedFilter").addEventListener('click', () => filter("completed"));

document.querySelector("#selectAll").addEventListener('click', selectAll);

document.querySelector("#deselectAll").addEventListener('click', deselectAll);

document.querySelector("#completedRemove").addEventListener('click', completedRemove);

document.getElementById('add').addEventListener('click', add);
