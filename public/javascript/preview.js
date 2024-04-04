const nameInput = document.getElementById('name');
const locationInput = document.getElementById('location');
const imageInput = document.getElementById('image');
const previewImage = document.getElementById('previewImage');
const previewName = document.getElementById('previewName');
const previewLocation = document.getElementById('previewLocation');

nameInput.addEventListener('input', updatePreview);
locationInput.addEventListener('input', updatePreview);
imageInput.addEventListener('change', updateImagePreview);

function updatePreview() {
    previewName.textContent = nameInput.value;
    previewLocation.textContent = locationInput.value;
}

function updateImagePreview(event) {
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onload = function(e) {
        previewImage.src = e.target.result;
    }

    reader.readAsDataURL(file);
}