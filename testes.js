const obj = {
    body: 'corpo do post',
    userId: 1
}

fetch('https://jsonplaceholder.typicode.com/posts/1',{
    method: 'PUT',
    headers: {
        'Content-Type': 'application/json',
    },
    body: JSON.stringify(obj),
})
    .then(response => response.json())
        .then(json => console.log(json))
    .catch(error => console.error('Error:', error))