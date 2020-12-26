const btnLink = document.getElementById('link-btn')

btnLink.addEventListener('click', function(e) {
    e.preventDefault()
    const originalLink = document.getElementById('link').value
    console.log("Link origina" + originalLink)
    const newLink = setLink(originalLink)


})

function setLink(originalLink) {
    const URL = `https://api.shrtco.de/v2/shorten?url=${originalLink}`
    console.log(URL)
    fetch(URL)
        .then(response => response.json())
        .then(data => console.log(data))

}