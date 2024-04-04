import { filteredTasksBtnAddClass } from './filteredTasksBtnAddClass.js'
import { filterActiveTasks } from './filterActiveTasks.js'
import { filterAllTasks } from './filterAllTasks.js'
import { filterCompleteTasks } from './filterCompleteTasks.js'


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

    const addNewTask = () => {
        const inputAddTask = document.getElementById('addTask')
        const listTasks = document.getElementById('list')
        // Creating a new task
        const newTask = {
            id: state.length + new Date().getTime(),
            title: inputAddTask.value,
            isDone: false
        }

        if (inputAddTask.value.length === 0) { return }  // Checking the input for characters
        inputAddTask.value = ''  // Clearing the input
        state.push(newTask) // Adding a new task to the state
        listTasks.insertAdjacentHTML('afterbegin', getNoteTemplate(newTask))
        countTasksContainer.innerHTML = countTasks() // Changing the value of the counter of left tasks
        // Adding List Styles
        document.querySelector('.add-task').style.gap = '18px'
        document.querySelector('.down-menu').style.display = 'flex'
        filteredTasksToActiveBtn()
        buttonChangeAllTasksStatusStyle()
        deleteAllTasksCompleteBtn() // Displaying a button for deleting completed tasks
    }
    // Structure of the new task
    const getNoteTemplate = (newTask) => {
        return `
        <li class="list__task" id="list__task">
            <input class="task__checkbox" type="checkbox" id="${newTask.id}">
            <label for="${newTask.id}" class="task__custom-checkbox"></label>
            <label class="task__title" id="task-${newTask.id}">${newTask.title}</label>
            <input class="input-value" id="${newTask.id}" value="${newTask.title}" style="display: none;">
            <button id="${newTask.id}" class="task__del-btn">×</button>
        </li>`
    }

    filteredTasksBtnAddClass()

    // deleteAllTasksComplete----------------
    const deleteAllTasksComplete = () => {
        const taskElements = document.querySelectorAll('.list__task')
        taskElements.forEach(task => {
            const checkbox = task.querySelector('.task__checkbox')
            if (checkbox.checked) {
                task.remove()
            }
        })
        state.filter(t => t.isDone === true)
            .forEach(t => {
                state.indexOf(t) !== -1 && state.splice(state.indexOf(t), 1)
            })
        removeStylesIfNotTasks()
    }
    // Displaying a button for deleting completed tasks
    const deleteAllTasksCompleteBtn = () => {
        state.some(t => t.isDone === true) ? document.querySelector('.clear-btn').classList.remove('clear-btn--hide')
            : document.querySelector('.clear-btn').classList.add('clear-btn--hide')
    }


    // countTasks--------------------------
    const countTasksContainer = document.getElementById('count')
    const countTasks = () => {
        return `<span class="count">${count()} item left</span>`
    }
    // Displaying the counter of left tasks
    let count = () => {
        return state.filter(el => el.isDone === false).length
    }

    // deleteTask--------------------------
    const deleteTask = (taskId) => {
        const thisTaskIndex = state.findIndex(el => el.id == parseInt(taskId))
        if (thisTaskIndex !== -1) {
            state.splice(thisTaskIndex, 1)
        }
        removeStylesIfNotTasks()
        countTasksContainer.innerHTML = countTasks() // Changing the value of the counter of left tasks
    }
    const removeStylesIfNotTasks = () => {
        state.length === 0 ? document.querySelector('.add-task').style.gap = '0px' : ''
        state.length === 0 ? document.querySelector('.down-menu').style.display = 'none' : ''
    }

    // changeTaskStatus--------------------
    const changeTaskStatus = (taskId) => {
        const thisTask = state.findIndex(t => t.id == taskId) // Finding a specific task by index
        state[thisTask].isDone = !state[thisTask].isDone // Changing the isDone values
        const taskTitle = document.getElementById(`task-${taskId}`) // Title of a specific task
        state[thisTask].isDone ? taskTitle.classList.add('task__title--checked') : taskTitle.classList.remove('task__title--checked') // Changing the title style
        countTasksContainer.innerHTML = countTasks() // Changing the value of the counter of left tasks
        // Adding or removing a button style perform all tasks if there is at least one completed
        const findAllTasksIsDone = state.every(t => t.isDone)
        if (findAllTasksIsDone) {
            document.querySelector('.custom-checkbox-checked-all-task').style.filter = 'none'
        } else {
            document.querySelector('.custom-checkbox-checked-all-task').style.filter = ''
        }
        filteredTasksToActiveBtn()
        deleteAllTasksCompleteBtn() // Displaying a button for deleting completed tasks
    }
    document.addEventListener('change', function (event) {
        if (event.target && event.target.classList.contains('task__checkbox')) {
            changeTaskStatus(event.target.id)
        }
    })

    // changeTaskTitle--------------------
    document.addEventListener('dblclick', function (event) {
        if (event.target && event.target.classList.contains('list__task') || event.target.classList.contains('task__title')) {
            const taskTarget = event.target.closest('.list__task')
            const inputTitleElement = taskTarget.querySelector('.input-value')
            taskTarget.querySelector('.task__title').style.display = 'none' // Hide the title display for a specific task that was clicked on
            inputTitleElement.style.display = 'flex' // Enable input display
            inputTitleElement.focus() // Autofocus
            inputTitleElement.setSelectionRange(inputTitleElement.value.length, inputTitleElement.value.length) // Position of selected text
            taskTarget.querySelector('.task__custom-checkbox').classList.add('task__custom-checkbox--hide') // Hiding the task status change button
            taskTarget.querySelector('.task__del-btn').style.display = 'none' // Hiding the task delete button
        }
    })
    const changeTaskTitleOnInputValue = (taskId, target) => {
        const taskTarget = target.closest('.list__task')
        const inputTitleElement = taskTarget.querySelector('.input-value')
        taskTarget.querySelector('.task__title').style.display = 'block'  // Returning the title display
        taskTarget.querySelector('.input-value').style.display = 'none' // Hide the input display for a specific task that was clicked
        const thisTask = state.findIndex(t => t.id == taskId) // Finding the index of a specific task
        state[thisTask].title = inputTitleElement.value // Set the value of the input to the title state object
        taskTarget.querySelector('.task__title').textContent = inputTitleElement.value // Changing the title value from the input
        taskTarget.querySelector('.task__custom-checkbox').classList.remove('task__custom-checkbox--hide') // Returning the task status change button
        taskTarget.querySelector('.task__del-btn').style.display = 'block' // Restoring the display of the task delete button
    }

    // changeAllTasksStatus-----------------
    let isClicked = true // Variable for button click
    const changeAllTasksStatus = () => {
        const taskTitle = document.querySelectorAll('.task__title')
        const checkbox = document.querySelectorAll('.task__checkbox')
        const findTaskNotIsDone = state.some(t => !t.isDone) // Find that at least one task is not done
        // Change the value of the variable depending on the fulfilled condition
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
            document.querySelector('.custom-checkbox-checked-all-task').style.filter = 'none'  // Changing the button style
        } else {
            state.forEach(t => t.isDone = false)
            taskTitle.forEach(el => el.classList.remove('task__title--checked'))
            checkbox.forEach(el => el.checked = false)
            document.querySelector('.custom-checkbox-checked-all-task').style.filter = '' // Changing the button style
        }
        filteredTasksToActiveBtn()
        deleteAllTasksCompleteBtn() // Displaying a button for deleting completed tasks
        countTasksContainer.innerHTML = countTasks() // Changing the value of the counter of left tasks
    }
    const buttonChangeAllTasksStatusStyle = () => {
        state.length !== 0 ? document.querySelector('.custom-checkbox-checked-all-task').style.display = 'block'
            : document.querySelector('.custom-checkbox-checked-all-task').style.display = 'none'
    }
    buttonChangeAllTasksStatusStyle()


    const filteredTasksToActiveBtn = () => {
        if (document.getElementById('filterComplete').classList.contains('btn-focus')) {
            filterCompleteTasks()
        }
        if (document.getElementById('filterActive').classList.contains('btn-focus')) {
            filterActiveTasks()
        }
        if (document.getElementById('filterAll').classList.contains('btn-focus')) {
            filterAllTasks()
        }
    }

    document.addEventListener('focusout', function (event) {
        if (event.target && event.target.classList.contains('input-value')) {
            changeTaskTitleOnInputValue(event.target.id, event.target)
        }
        if (event.target && event.target.classList.contains('add-task__input')) {
            addNewTask()
        }
    })

    document.addEventListener('keypress', function (event) {
        if (event.target && event.target.classList.contains('input-value')) {
            event.key === 'Enter' && changeTaskTitleOnInputValue(event.target.id, event.target)
        }
        if (event.target && event.target.classList.contains('add-task__input')) {
            event.key === 'Enter' && addNewTask()
        }
    })

    document.addEventListener('click', function (event) {
        if (event.target && event.target.id === 'btn-addTask') {
            addNewTask()
        }
        if (event.target && event.target.id === 'filterAll') {
            filterAllTasks()
        }
        if (event.target && event.target.id === 'filterActive') {
            filterActiveTasks()
        }
        if (event.target && event.target.id === 'filterComplete') {
            filterCompleteTasks()
        }
        if (event.target && event.target.classList.contains('custom-checkbox-checked-all-task')) {
            changeAllTasksStatus()
        }
        // deleteTask--------------------------
        if (event.target && event.target.classList.contains('task__del-btn')) {
            deleteTask(event.target.id)
            event.target.closest('.list__task').remove()
            deleteAllTasksCompleteBtn() // Displaying a button for deleting completed tasks
            buttonChangeAllTasksStatusStyle()
        }
        // deleteAllTasksComplete--------------
        if (event.target && event.target.classList.contains('clear-btn')) {
            deleteAllTasksComplete()
            deleteAllTasksCompleteBtn() // Displaying a button for deleting completed tasks
            buttonChangeAllTasksStatusStyle()
        }

    })
};
