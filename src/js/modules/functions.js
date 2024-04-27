import { filteredTasksBtnAddClass } from './filteredTasksBtnAddClass.js'
import { filteredTasks } from './filteredTasks.js'


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

    const saveTasksToLocalStorage = (tasks) => {
        localStorage.setItem('tasks', JSON.stringify(tasks));
    };

    const loadTasksFromLocalStorage = () => {
        const storedTasks = localStorage.getItem('tasks');
        return storedTasks ? JSON.parse(storedTasks) : [];
    };

    const renderTasks = (tasks) => {
        const listTasks = document.getElementById('list')
        listTasks.innerHTML = ''
        tasks.forEach((task) => {
            listTasks.insertAdjacentHTML('afterbegin', getNoteTemplate(task))
        });

    };

    window.addEventListener('load', () => {
        renderTasks(state);
    });

    let state = loadTasksFromLocalStorage();

    const addNewTask = () => {
        const inputAddTask = document.getElementById('addTask')
        // Creating a new task
        const newTask = {
            id: state.length + new Date().getTime(),
            title: inputAddTask.value,
            isDone: false
        }
       // Checking the input for characters
        if (inputAddTask.value.trim() === '' || inputAddTask.value.length === 0) {
            inputAddTask.value = ''
            return
        }
        inputAddTask.value = ''  // Clearing the input
        state.push(newTask);
        countTasksContainer.innerHTML = countTasks()// Changing the value of the counter of left tasks
        buttonChangeAllTasksStatusStyle()
        deleteAllTasksCompleteBtn() // Displaying a button for deleting completed tasks
        saveTasksToLocalStorage(state);
        renderTasks(state)
        filteredTasksToActiveBtn()
        addStyleListTasks() // Adding List Styles
    }


    // Structure of the new task
    const getNoteTemplate = (newTask) => {
        const checkedClass = newTask.isDone ? 'task__title--checked' : '';
        const checkedCheckbox = newTask.isDone ? 'custom-checkbox-img--show' : '';
        return `
        <li class="list__task" id="list__task">
            <input class="task__checkbox" type="checkbox" id="${newTask.id}" >
            <label for="${newTask.id}" class="task__custom-checkbox">
                <svg class="custom-checkbox-img ${checkedCheckbox}" width="10" height="10" viewBox="0 0 13 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path fill-rule="evenodd" clip-rule="evenodd" d="M0.293044 4.53581C0.683569 4.14529 1.31673 4.14529 1.70726 4.53581L4.62161 7.45017L11.1574 0.914353C11.5479 0.523829 12.1811 0.523829 12.5716 0.914353C12.9622 1.30488 12.9622 1.93804 12.5716 2.32857L5.32872 9.57149C4.93819 9.96201 4.30503 9.96201 3.9145 9.57149L0.293044 5.95003C-0.09748 5.5595 -0.09748 4.92634 0.293044 4.53581Z" fill="#1B1F2B"/>
                </svg>
            </label>
            <label class="task__title ${checkedClass}" id="task-${newTask.id}">${newTask.title}</label>
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
        saveTasksToLocalStorage(state);
        renderTasks(state)
    }

    // Displaying a button for deleting completed tasks
    const deleteAllTasksCompleteBtn = () => {
        if (state.length > 0) {
            state.some(t => t.isDone === true) ? document.querySelector('.clear-btn').classList.remove('clear-btn--hide')
                : document.querySelector('.clear-btn').classList.add('clear-btn--hide')
        }
    }
    deleteAllTasksCompleteBtn()

    // countTasks--------------------------
    const countTasksContainer = document.getElementById('count')
    // Displaying the counter of left tasks
    let count = () => {
        return state.filter(el => el.isDone === false).length
    }
    const countTasks = () => {
        return `<span class="count">${count()} item left</span>`
    }

    const addStyleListTasks = () => {
        if (state.length > 0) {
            document.querySelector('.add-task').style.gap = '18px'
            document.querySelector('.down-menu').style.display = 'flex'
            countTasksContainer.innerHTML = countTasks() // Changing the value of the counter of left tasks
        }
    }
    addStyleListTasks()

    // deleteTask--------------------------
    const deleteTask = (taskId) => {
        const thisTaskIndex = state.findIndex(el => el.id == parseInt(taskId))
        thisTaskIndex !== -1 && state.splice(thisTaskIndex, 1)
        removeStylesIfNotTasks()
        countTasksContainer.innerHTML = countTasks() // Changing the value of the counter of left tasks
        saveTasksToLocalStorage(state);
        renderTasks(state)
    }
    const removeStylesIfNotTasks = () => {
        if (state.length === 0) {
            document.querySelector('.add-task').style.gap = '0px'
            document.querySelector('.down-menu').style.display = 'none'
        }
    }

    // changeTaskStatus--------------------
    const changeTaskStatus = (taskId) => {
        const currentTaskIndex = state.findIndex(t => t.id == taskId) // Finding a specific task by index
        state[currentTaskIndex].isDone = !state[currentTaskIndex].isDone // Changing the isDone values
        countTasksContainer.innerHTML = countTasks() // Changing the value of the counter of left tasks
        deleteAllTasksCompleteBtn() // Displaying a button for deleting completed tasks
        buttonChangeAllTasksStatusStyle()
        saveTasksToLocalStorage(state);
        renderTasks(state)
        filteredTasksToActiveBtn()
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
            inputTitleElement.value = inputTitleElement.value.trim()
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
        const currentTaskIndex = state.findIndex(t => t.id == taskId) // Finding the index of a specific task
        state[currentTaskIndex].title = inputTitleElement.value.trim() // Set the value of the input to the title state object
        taskTarget.querySelector('.task__title').textContent = inputTitleElement.value.trim() // Changing the title value from the input
        taskTarget.querySelector('.task__custom-checkbox').classList.remove('task__custom-checkbox--hide') // Returning the task status change button
        taskTarget.querySelector('.task__del-btn').style.display = 'block' // Restoring the display of the task delete button
        // Remove tasks if title is empty
        if (state[currentTaskIndex].title.trim() === '' || state[currentTaskIndex].title === '') {
            taskTarget.remove()
            deleteTask(taskId)
            buttonChangeAllTasksStatusStyle()
        }
        saveTasksToLocalStorage(state);
        renderTasks(state)
    }
    const cancelChangeTaskTitle = (taskId, target) => {
        const taskTarget = target.closest('.list__task');
        const inputTitleElement = taskTarget.querySelector('.input-value');
        taskTarget.querySelector('.task__title').style.display = 'block'; // Returning the title display
        inputTitleElement.style.display = 'none'; // Hide the input display for a specific task that was clicked
        const currentTaskIndex = state.findIndex(t => t.id == taskId); // Finding the index of a specific task
        state[currentTaskIndex].title = state[currentTaskIndex].title // Set the value of the input to the title state object
        inputTitleElement.value = state[currentTaskIndex].title
        taskTarget.querySelector('.task__title').textContent = state[currentTaskIndex].title; // Changing the title value from the input
        taskTarget.querySelector('.task__del-btn').style.display = 'block'; // Restoring the display of the task delete button
    }


    // changeAllTasksStatus-----------------
    const changeAllTasksStatus = () => {
        const taskTitle = document.querySelectorAll('.task__title')
        const checkbox = document.querySelectorAll('.task__checkbox')
        const findTaskNotIsDone = state.some(t => !t.isDone) // Find that at least one task is not done
        state.forEach(t => t.isDone = findTaskNotIsDone)
        checkbox.forEach(el => el.checked = findTaskNotIsDone)
        taskTitle.forEach(title => title.classList.toggle('task__title--checked', findTaskNotIsDone));
        countTasksContainer.innerHTML = countTasks() // Changing the value of the counter of left tasks
        buttonChangeAllTasksStatusStyle()
        deleteAllTasksCompleteBtn() // Displaying a button for deleting completed tasks
        saveTasksToLocalStorage(state);
        renderTasks(state)
        filteredTasksToActiveBtn()
    }
    const buttonChangeAllTasksStatusStyle = () => {
        const customCheckboxCheckedAllImg = document.getElementById('img')
        customCheckboxCheckedAllImg.classList.toggle('custom-checkbox-checked-all-task-img--hide', state.length === 0)
        customCheckboxCheckedAllImg.classList.toggle('custom-checkbox-checked-all-task-img--show', state.some(el => !el.isDone))
        customCheckboxCheckedAllImg.classList.toggle('custom-checkbox-checked-all-task-img--change-color', state.every(el => el.isDone))
    }
    buttonChangeAllTasksStatusStyle()

    const filterTasksType = ['filterAll', 'filterActive', 'filterComplete']

    const filteredTasksToActiveBtn = () => {
        filterTasksType.forEach(filter => {
            if (document.getElementById(filter).classList.contains('btn-focus')) {
                filteredTasks(filter)
            }
        })
    }

    document.addEventListener('focusout', function (event) {
        if (event.target && event.target.classList.contains('input-value')) {
            changeTaskTitleOnInputValue(event.target.id, event.target)
        }
        if (event.target && event.target.classList.contains('add-task__input')) {
            addNewTask()
        }
    })

    document.addEventListener('keydown', function (event) {
        if (event.target && event.target.classList.contains('input-value')) {
            if (event.key === 'Escape') {
                cancelChangeTaskTitle(event.target.id, event.target)
            } else if (event.key === 'Enter') {
                changeTaskTitleOnInputValue(event.target.id, event.target)
            }
        }
        if (event.target && event.target.classList.contains('add-task__input')) {
            event.key === 'Enter' && addNewTask()
        }
    })


    document.addEventListener('click', function (event) {
        if (event.target && event.target.id === 'btn-addTask') {
            addNewTask()
        }
        if (event.target && filterTasksType.includes(event.target.id)) {
            filteredTasksToActiveBtn()
        }
        if (event.target && event.target.classList.contains('custom-checkbox-checked-all-task-img')) {
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
