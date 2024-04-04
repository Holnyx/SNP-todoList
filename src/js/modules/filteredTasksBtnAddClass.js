export const filteredTasksBtnAddClass = () => {
    const filteredBtn = document.querySelectorAll('.filter-btn')
    const handleFilteredBtn = (event) => {
        filteredBtn.forEach(el => el.classList.remove('btn-focus'))
        event.target.classList.add('btn-focus')
    }
    filteredBtn.forEach(el => el.addEventListener('click', handleFilteredBtn))

    // When the page loads, the All button is active 
    document.addEventListener('DOMContentLoaded', function () {
        document.getElementById('filterAll').classList.add('btn-focus')
    });
}