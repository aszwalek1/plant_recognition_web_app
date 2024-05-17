document.addEventListener('DOMContentLoaded', function () {
    const toggleFiltersBtn = document.getElementById('toggleFiltersBtn');
    const filters2 = document.getElementById('filters2');
    const whole = document.getElementById('filters');

    toggleFiltersBtn.addEventListener('click', function (event) {
        event.preventDefault(); // Prevent the default form submission behavior
        if (filters2.style.display === 'none' || filters2.style.display === '') {
            whole.style.display = 'inline';
            filters2.style.display = 'block';
            toggleFiltersBtn.textContent = 'Hide Filters';
        } else {
            filters2.style.display = 'none';
            toggleFiltersBtn.textContent = 'Show Filters';
        }
    });
});