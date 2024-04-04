export const filterAllTasks = () => {
    const taskElements = document.querySelectorAll('.list__task')
    taskElements.forEach(task => {
        const checkbox = task.querySelector('.task__checkbox');
        if (checkbox.checked || !checkbox.checked) {
            task.style.display = 'flex'
        }
    });
}
