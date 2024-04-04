export const filterCompleteTasks = () => {
    const taskElements = document.querySelectorAll('.list__task')
    const isFilterActive = document.getElementById('filterComplete').classList.contains('btn-focus'); // Finds an element and checks whether it is complete
    taskElements.forEach(task => {
        const checkbox = task.querySelector('.task__checkbox');
        if (isFilterActive && !checkbox.checked) {
            task.style.display = 'none'
        } else {
            task.style.display = ''
        }
    });
}