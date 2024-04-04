export const filterActiveTasks = () => {
    const taskElements = document.querySelectorAll('.list__task')
    const isFilterActive = document.getElementById('filterActive').classList.contains('btn-focus') // Finds an element and checks whether it is active
    taskElements.forEach(task => {
        const checkbox = task.querySelector('.task__checkbox')
        if (isFilterActive && checkbox.checked) {
            task.style.display = 'none'
        } else {
            task.style.display = ''
        }
    });
}
