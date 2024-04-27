export const filteredTasks = (filterType) => {
    const taskElements = document.querySelectorAll('.list__task')
    taskElements.forEach(task => {
        const checkbox = task.querySelector('.custom-checkbox-img--show');
        switch (filterType) {
            case 'filterComplete':
                !checkbox ? task.style.display = 'none' : task.style.display = ''
                break;
            case 'filterActive':
                checkbox ? task.style.display = 'none' : task.style.display = ''
                break;
            case 'filterAll':
                task.style.display = 'flex'
                break;
            default:
                task.style.display = 'flex'
                break;
        }
    });
}