export const filterAllTasks = () => {
    const taskElements = document.querySelectorAll('.list__task')
    taskElements.forEach(task => {
        const checkbox = task.querySelector('.custom-checkbox-img--show');
        if (checkbox || !checkbox) {
            task.style.display = 'flex'
        }
    });
}