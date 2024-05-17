document.addEventListener('DOMContentLoaded', function () {
    const toggleFiltersBtn = document.getElementById('toggleFiltersBtn');
    const description = document.getElementById('plantDescription');

    toggleFiltersBtn.addEventListener('click', function (event) {
        event.preventDefault(); // Prevent the default form submission behavior
        if (description.style.display === 'none' || description.style.display === '') {
            description.style.display = 'inline';
            toggleFiltersBtn.textContent = 'Hide Description';
        } else {
            description.style.display = 'none';
            toggleFiltersBtn.textContent = 'Show Description';
        }
    });
});
