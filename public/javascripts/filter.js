function resetForm() {
    var radioButtons = document.querySelectorAll('input[type="radio"]');
    radioButtons.forEach(function(button) {
        button.checked = false;
    });
}

