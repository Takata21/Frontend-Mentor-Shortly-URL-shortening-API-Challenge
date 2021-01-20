const link_input = document.getElementById("link");
const link_btn = document.getElementById("link-btn");
const errorMsg_small = document.getElementById("error-message");
const shortLinks_div = document.getElementById("shortlinks");
let error = false;
let links = [];

// EVENT LISTENER
window.addEventListener("DOMContentLoaded", renderLinks);
link_btn.addEventListener("click", async(e) => {
    e.preventDefault();
    if (link_input.value) {
        const link = link_input.value;
        const response = await fetchLink(link);
        if (response.ok) {
            const { code, full_short_link, original_link } = response.result;
            showNewLink(code, full_short_link, original_link);
            setLocalStorage(response);
        }
    } else {
        error = true;
        showError(error);
    }
});

// ****************************************FUNCTIONS****************************************
// ********************************************************************************

// get shortLinks

async function fetchLink(link) {
    const URL = `https://api.shrtco.de/v2/shorten?url=${link}`;
    const response = await fetch(URL);
    data = await response.json();
    return data;
}

// show error message
function showError(error) {
    link_input.classList.add("error");
    errorMsg_small.classList.add("active");
    setTimeout(() => {
        link_input.classList.remove("error");
        errorMsg_small.classList.remove("active");
        resetToDefault();
    }, 2000);
}

// reset to default
function resetToDefault() {
    error = false;
    link_input.value = "";
}
// render new url

function renderLinks() {
    const data = getLocalStorage();
    if (data.length > 0) {
        data.forEach((link) => {
            showNewLink(link.code, link.full_short_link, link.original_link);
        });
        console.log(data);
    }
}

function showNewLink(code, full_short_link, original_link) {
    element = document.createElement("div");
    element.classList.add("newlink");
    const newLink = `
    <a class="newlink-original" href="${original_link}">${original_link}</a>
    <div class="newlink-action">
    <a class="newlink-short" href="${full_short_link}" data-linkid="${code}">${full_short_link}</a>
    <button class="newlink-btn" data-code="${code}">Copy</button>
    </div>`;
    element.innerHTML = newLink;
    const copyBtn = element.querySelector(".newlink-btn");
    copyBtn.addEventListener("click", copyLink);
    shortLinks_div.appendChild(element);
    resetToDefault();
}

// copy url to Clipboard

function copyLink(e) {
    const id = e.target.dataset.code;
    const copyText = shortLinks_div.querySelector(`[data-linkid='${id}']`)
        .textContent;
    const tempInput = document.createElement("input");
    shortLinks_div.appendChild(tempInput);
    tempInput.setAttribute("value", copyText);
    tempInput.select();
    document.execCommand("copy");
    shortLinks_div.removeChild(tempInput);
    e.target.textContent = "Copied!";
    e.target.classList.add("copied");
    setTimeout(() => {
        e.target.textContent = "Copy";
        e.target.classList.remove("copied");
    }, 1000);
}

function getLocalStorage() {
    return localStorage.getItem("links") ?
        JSON.parse(localStorage.getItem("links")) :
        [];
}

function setLocalStorage(data) {
    const { code, full_short_link, original_link } = data.result;
    const link = { code, full_short_link, original_link };
    links.push(link);
    console.log(links);
    localStorage.setItem("links", JSON.stringify(links));
}