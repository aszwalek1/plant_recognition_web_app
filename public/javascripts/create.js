const form = document.getElementById("form");
const nameInput = document.getElementById('name');
const locationInput = document.getElementById('location');
const imageInput = document.getElementById('image');
const previewImage = document.getElementById('previewImage');
const previewName = document.getElementById('previewName');
const previewLocation = document.getElementById('previewLocation');

form.addEventListener('submit', submitForm);
nameInput.addEventListener('input', updatePreview);
locationInput.addEventListener('input', updatePreview);
imageInput.addEventListener('change', updateImagePreview);

function submitForm(event) {
    event.preventDefault();
    const formData = new FormData(event.target);

    postCreatePostForm(formData)
    .then(response => {
        console.log(response)
    })
    .catch(err => {
        openSyncPostsIDB().then(idb => {
            addSyncPost(idb, formData);
        })
    })
}

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
