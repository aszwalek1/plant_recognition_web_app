/**
 * Makes a POST request to '/create' with some post form data.
 * @param formData the formData
 * @return Promise<Response>
 */
async function postCreatePostForm(formData) {
    return fetch("http://localhost:3000/create/", {method: 'POST', body: formData})
        .then(response => {
            if (!response.ok) {
                throw new Error(response.statusText)
            }
        })
}
