
export const isWebp = () => {
    function testWebP(callback) {
        let webP = new Image();
        webP.onload = webP.onerror = function () {
            callback(webP.height === 2);
        };
        webP.src = "data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA";
    }

    testWebP(function (support) {
        const className = support === true ? 'webp' : 'no-webp';
        document.documentElement.classList.add(className);
    })

    const state = []
    const inputAddTask = document.getElementById('addTask')
    const addTaskBtn = document.getElementById('btn-addTask')
    const countTasksContainer = document.getElementById('count')

    const addNewTask = () => {
        const listTasks = document.getElementById('list')
        // Creating a new task
        const newTask = {
            id: state.length + new Date().getTime(),
            title: inputAddTask.value,
            isDone: false
        }
        // Checking the input for characters
        if (inputAddTask.value.length === 0) { return }
        // Clearing the input
        inputAddTask.value = ''
        // Adding a new task to the state
        state.push(newTask)
        listTasks.insertAdjacentHTML('afterbegin', getNoteTemplate(newTask))
        // Changing the value of the counter of left tasks
        countTasksContainer.innerHTML = countTasks()
        // Adding List Styles
        document.querySelector('.add-task').style.gap = '18px'
        document.querySelector('.down-menu').style.display = 'flex'
        // Displaying tasks depending on the selected filter
        if (document.getElementById('filterComplete').classList.contains('btn-focus')) {
            filterCompleteTasks()
        }
        if (document.getElementById('filterActive').classList.contains('btn-focus')) {
            filterActiveTasks()
        }
        if (document.getElementById('filterAll').classList.contains('btn-focus')) {
            filterAllTasks()
        }
        // Changing the button display
        buttonChangeAllTasksStatus()
        // Displaying a button for deleting completed tasks
        deleteAllTasksCompleteBtn()
    }
    // Structure of the new task
    const getNoteTemplate = (newTask) => {
        return `
        <li class="list__task" id="list__task">
            <input class="task__checkbox" type="checkbox" id="${newTask.id}">
            <label for="${newTask.id}" class="task__custom-checkbox"></label>
            <label class="task__title" id="task${newTask.id}">${newTask.title}</label>
            <input class="input-value" id="${newTask.id}" value="${newTask.title}" style="display: none;">
            <button id="${newTask.id}" class="task__del-btn">×</button>
        </li>`
    }

    // Adding a new task when the input is not in focus
    inputAddTask.addEventListener('focusout', addNewTask)
    // Adding a new task by pressing a key Enter
    const addNewTaskOnKeyDown = (e) => {
        e.key === 'Enter' && addNewTask()
    }
    inputAddTask.addEventListener('keypress', addNewTaskOnKeyDown)
    // Adding a new task at the click of a button
    addTaskBtn.onclick = addNewTask

    // filteredTasksBtnAddClass--------------
    const filteredBtn = document.querySelectorAll('.filter-btn')
    const handleFilteredBtn = (event) => {
        filteredBtn.forEach(el => el.classList.remove('btn-focus'))
        event.target.classList.add('btn-focus')
    }
    filteredBtn.forEach(el => el.addEventListener('click', handleFilteredBtn))

    // When the page loads, the All button is active 
    document.addEventListener('DOMContentLoaded', function () {
        document.getElementById('filterAll').classList.add('btn-focus');
    });

    // filterActiveTasks---------------------
    const filterActiveTasks = () => {
        const taskElements = document.querySelectorAll('.list__task')
        // Finds an element and checks whether it is active
        const isFilterActive = document.getElementById('filterActive').classList.contains('btn-focus');
        taskElements.forEach(task => {
            const checkbox = task.querySelector('.task__checkbox');
            if (isFilterActive && checkbox.checked) {
                task.style.display = 'none'
            } else {
                task.style.display = ''
            }
        });
    }

    // filterAllTasks------------------------
    const filterAllTasks = () => {
        const taskElements = document.querySelectorAll('.list__task')
        taskElements.forEach(task => {
            const checkbox = task.querySelector('.task__checkbox');
            if (checkbox.checked || !checkbox.checked) {
                task.style.display = 'flex'
            }
        });
    }

    // filterCompleteTasks-------------------
    const filterCompleteTasks = () => {
        const taskElements = document.querySelectorAll('.list__task')
        // Finds an element and checks whether it is complete
        const isFilterActive = document.getElementById('filterComplete').classList.contains('btn-focus');
        taskElements.forEach(task => {
            const checkbox = task.querySelector('.task__checkbox');
            if (isFilterActive && !checkbox.checked) {
                task.style.display = 'none'
            } else {
                task.style.display = ''
            }
        });
    }

    // deleteAllTasksComplete----------------
    const deleteAllTasksComplete = () => {
        const taskElements = document.querySelectorAll('.list__task')
        taskElements.forEach(task => {
            const checkbox = task.querySelector('.task__checkbox');
            if (checkbox.checked) {
                task.remove()
            }
        });
        state.filter(t => t.isDone === true)
            .forEach(t => {
                state.indexOf(t) !== -1 && state.splice(state.indexOf(t), 1);
            })
        // Removing styles if there are no tasks
        removeStyles()
    }
    // Displaying a button for deleting completed tasks
    const deleteAllTasksCompleteBtn = () => {
        state.some(t => t.isDone === true) ? document.querySelector('.clear-btn').classList.remove('clear-btn--hide')
            : document.querySelector('.clear-btn').classList.add('clear-btn--hide')
    }


    // countTasks--------------------------
    const countTasks = () => {
        return `
    <span class="count">${count()} item left</span>
    `
    }
    // Displaying the counter of left tasks
    let count = () => {
        return state.filter(el => el.isDone === false).length
    }

    // deleteTask--------------------------
    const deleteTask = (taskId) => {
        const thisTaskIndex = state.findIndex(el => el.id == parseInt(taskId));
        if (thisTaskIndex !== -1) {
            state.splice(thisTaskIndex, 1)
        }
        // Removing styles if there are no tasks
        removeStyles()
        // Changing the value of the counter of left tasks
        countTasksContainer.innerHTML = countTasks()
    }
    // Removing styles if there are no tasks
    const removeStyles = () => {
        state.length === 0 ? document.querySelector('.add-task').style.gap = '0px' : ''
        state.length === 0 ? document.querySelector('.down-menu').style.display = 'none' : ''
    }

    // changeTaskStatus--------------------
    const changeTaskStatus = (taskId) => {
        // Finding a specific task by index
        const thisTask = state.findIndex(t => t.id == taskId)
        // Changing the isDone values
        state[thisTask].isDone = !state[thisTask].isDone
        // Title of a specific task
        const taskTitle = document.getElementById(`task${taskId}`)
        // Changing the title style
        state[thisTask].isDone ? taskTitle.classList.add('task__title--checked') : taskTitle.classList.remove('task__title--checked')
        // Changing the value of the counter of left tasks
        countTasksContainer.innerHTML = countTasks()
        // Adding or removing a button style perform all tasks if there is at least one completed
        const findAllTasksIsDone = state.every(t => t.isDone)
        if (findAllTasksIsDone) {
            document.querySelector('.custom-checkbox-checked-all-task').style.filter = 'none';
        } else {
            document.querySelector('.custom-checkbox-checked-all-task').style.filter = '';
        }
        // Displaying tasks depending on the selected filter
        if (document.getElementById('filterComplete').classList.contains('btn-focus')) {
            filterCompleteTasks()
        }
        if (document.getElementById('filterActive').classList.contains('btn-focus')) {
            filterActiveTasks()
        }
        if (document.getElementById('filterAll').classList.contains('btn-focus')) {
            filterAllTasks()
        }
        // Displaying a button for deleting completed tasks
        deleteAllTasksCompleteBtn()
    }
    document.addEventListener('change', function (event) {
        if (event.target && event.target.classList.contains('task__checkbox')) {
            changeTaskStatus(event.target.id)
        }
    })

    // changeTaskTitle--------------------
    document.addEventListener('dblclick', function (event) {
        if (event.target && event.target.classList.contains('list__task') || event.target.classList.contains('task__title')) {
            const taskTarget = event.target.closest('.list__task');
            const inputTitleElement = taskTarget.querySelector('.input-value')
            // We hide the title display for a specific task that was clicked on
            taskTarget.querySelector('.task__title').style.display = 'none'
            // Enable input display
            inputTitleElement.style.display = 'flex'
            // Autofocus
            inputTitleElement.focus()
            // Position of selected text
            inputTitleElement.setSelectionRange(inputTitleElement.value.length, inputTitleElement.value.length)
            // Hiding the task status change button
            taskTarget.querySelector('.task__custom-checkbox').classList.add('task__custom-checkbox--hide')
            // Hiding the task delete button
            taskTarget.querySelector('.task__del-btn').style.display = 'none'
        }
    })
    const changeTaskTitleOnInputValue = (taskId, target) => {
        const taskTarget = target.closest('.list__task');
        const inputTitleElement = taskTarget.querySelector('.input-value')
        // Returning the title display
        taskTarget.querySelector('.task__title').style.display = 'block'
        // We hide the input display for a specific task that was clicked
        taskTarget.querySelector('.input-value').style.display = 'none'
        // Finding the index of a specific task
        const thisTask = state.findIndex(t => t.id == taskId)
        // Set the value of the input to the title state object
        state[thisTask].title = inputTitleElement.value
        // Changing the title value from the input
        taskTarget.querySelector('.task__title').textContent = inputTitleElement.value
        // Returning the task status change button
        taskTarget.querySelector('.task__custom-checkbox').classList.remove('task__custom-checkbox--hide')
        // Restoring the display of the task delete button
        taskTarget.querySelector('.task__del-btn').style.display = 'block'
    }
    document.addEventListener('focusout', function (event) {
        if (event.target && event.target.classList.contains('input-value') || event.target.classList.contains('task__title')) {
            changeTaskTitleOnInputValue(event.target.id, event.target)
        }
    })
    const changeTakTitleOnInput = (event) => {
        if (event.target && event.target.classList.contains('input-value') || event.target.classList.contains('task__title')) {
            event.key === 'Enter' && changeTaskTitleOnInputValue(event.target.id, event.target)
        }
    }
    document.addEventListener('keypress', changeTakTitleOnInput)

    // changeAllTasksStatus-----------------
    
    let isClicked = true // Variable for button click
    const changeAllTasksStatus = () => {
        const taskTitle = document.querySelectorAll('.task__title');
        const checkbox = document.querySelectorAll('.task__checkbox');
        // We find that at least one task is not done
        const findTaskNotIsDone = state.some(t => !t.isDone)
        // We change the value of the variable depending on the fulfilled condition
        switch (findTaskNotIsDone) {
            case true:
                isClicked = true
                break;
            case false:
                isClicked = false
                break;
            default:
                break;
        }
        // Changing the task status value
        if (isClicked) {
            state.forEach(t => t.isDone = true)
            taskTitle.forEach(el => el.classList.add('task__title--checked'))
            checkbox.forEach(el => el.checked = true)
            // Changing the button style
            document.querySelector('.custom-checkbox-checked-all-task').style.filter = 'none';
        } else {
            state.forEach(t => t.isDone = false)
            taskTitle.forEach(el => el.classList.remove('task__title--checked'))
            checkbox.forEach(el => el.checked = false)
            // Changing the button style
            document.querySelector('.custom-checkbox-checked-all-task').style.filter = '';
        }
        // Displaying tasks depending on the selected filter
        if (document.getElementById('filterComplete').classList.contains('btn-focus')) {
            filterCompleteTasks()
        }
        if (document.getElementById('filterActive').classList.contains('btn-focus')) {
            filterActiveTasks()
        }
        if (document.getElementById('filterAll').classList.contains('btn-focus')) {
            filterAllTasks()
        }
        // Displaying a button for deleting completed tasks
        deleteAllTasksCompleteBtn()
        // Changing the value of the counter of left tasks
        countTasksContainer.innerHTML = countTasks()
    }
    // Changing the button display
    const buttonChangeAllTasksStatus = () => {
        state.length !== 0 ? document.querySelector('.custom-checkbox-checked-all-task').style.display = 'block'
            : document.querySelector('.custom-checkbox-checked-all-task').style.display = 'none'
    }
        buttonChangeAllTasksStatus()

    document.addEventListener('click', function (event) {
        // filterAllTasks----------------------
        if (event.target && event.target.id === 'filterAll') {
            filterAllTasks()
        }
        // filterActiveTasks-------------------
        if (event.target && event.target.id === 'filterActive') {
            filterActiveTasks()
        }
        // filterCompleteTasks-----------------
        if (event.target && event.target.id === 'filterComplete') {
            filterCompleteTasks()
        }
        // changeAllTasksStatus---------------
        if (event.target && event.target.classList.contains('custom-checkbox-checked-all-task')) {
            changeAllTasksStatus()
        }
        // deleteTask--------------------------
        if (event.target && event.target.classList.contains('task__del-btn')) {
            deleteTask(event.target.id)
            event.target.closest('.list__task').remove()
            // Displaying a button for deleting completed tasks
            deleteAllTasksCompleteBtn()
            // Changing the button display
            buttonChangeAllTasksStatus()
        }
        // deleteAllTasksComplete--------------
        if (event.target && event.target.classList.contains('clear-btn')) {
            deleteAllTasksComplete()
            // Displaying a button for deleting completed tasks
            deleteAllTasksCompleteBtn()
            // Changing the button display
            buttonChangeAllTasksStatus()
        }

    })
};
