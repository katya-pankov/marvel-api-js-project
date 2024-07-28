const publicKey = '239b3327babdd8fb56635b8da576a207';
const privateKey = '3b1daa82123036e8db54d4834f3f966fc5511037';

let currentPage = 0;
let currentComicsPage = 0;
const limit = 20;

// Function to show the spinner
function showSpinner() {
    const spinner = document.getElementById('spinner');
    const header = document.querySelector('header');
    const footer = document.querySelector('footer');
    const resultsWrapper = document.getElementById('results-wrapper');

    if (spinner && header && footer && resultsWrapper) {
        spinner.style.display = 'flex';
        header.style.display = 'none';
        footer.style.display = 'none';
    }
}

// Function to hide the spinner
function hideSpinner() {
    const spinner = document.getElementById('spinner');
    const header = document.querySelector('header');
    const footer = document.querySelector('footer');
    const resultsWrapper = document.getElementById('results-wrapper');

    if (spinner && header && footer && resultsWrapper) {
        spinner.style.display = 'none';
        header.style.display = 'flex';
        footer.style.display = 'flex';
    }
}

// Function to create a hash for the API request
function createHash(ts, privateKey, publicKey) {
    return CryptoJS.MD5(ts + privateKey + publicKey).toString();
}

// Function to fetch Marvel characters
async function fetchMarvelCharacters(page) {
    showSpinner();
    hideError();
    const ts = new Date().getTime();
    const hash = createHash(ts, privateKey, publicKey);
    const offset = page * limit;
    const url = `https://gateway.marvel.com/v1/public/characters?ts=${ts}&apikey=${publicKey}&hash=${hash}&offset=${offset}&limit=${limit}`;

    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        displayCharacters(data.data.results);
        console.log(data.data.results);
    } catch (error) {
        console.error('Error fetching data from Marvel API:', error);
        showError('Oops, something went wrong. Please try again later.');
    } finally {
        hideSpinner();
        
    }
}

// Function to fetch Marvel comics
async function fetchMarvelComics(page) {
    showSpinner();
    hideError();
    const ts = new Date().getTime();
    const hash = createHash(ts, privateKey, publicKey);
    const offset = page * limit;
    const url = `https://gateway.marvel.com/v1/public/comics?ts=${ts}&apikey=${publicKey}&hash=${hash}&offset=${offset}&limit=${limit}`;

    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        console.log('Comics data:', data.data.results);
        displayComics(data.data.results);
    } catch (error) {
        console.error('Error fetching data from Marvel API:', error);
        showError('Oops, something went wrong. Please try again later.');
    } finally {
        hideSpinner(); 
    }
}

// Function to display characters in the DOM
function displayCharacters(characters) {
    const charactersContainer = document.getElementById('characters');

    charactersContainer.innerHTML = '';

    characters.forEach(character => {
        const characterDiv = document.createElement('div');
        characterDiv.classList.add('card');
        const characterImage = document.createElement('img');
        characterImage.src = `${character.thumbnail.path}.${character.thumbnail.extension}`;
        characterImage.alt = character.name;
        const characterInfo = document.createElement('div');
        characterInfo.innerHTML = `<h2>${character.name}</h2>`;
        characterDiv.appendChild(characterImage);
        characterDiv.appendChild(characterInfo);
        charactersContainer.appendChild(characterDiv);
    });
}

// Function to display comics in the DOM
function displayComics(comics) {
    const comicsContainer = document.getElementById('comics');
    comicsContainer.innerHTML = '';

    comics.forEach(comic => {
        const comicDiv = document.createElement('div');
        comicDiv.classList.add('card');
        const comicImage = document.createElement('img');
        comicImage.src = `${comic.thumbnail.path}.${comic.thumbnail.extension}`;
        comicImage.alt = comic.title;
        const comicInfo = document.createElement('div');
        comicInfo.innerHTML = `<h2>${comic.title}</h2>`;
        comicDiv.appendChild(comicImage);
        comicDiv.appendChild(comicInfo);
        comicsContainer.appendChild(comicDiv);
    });
}

// Function to handle pagination for characters
function changePage(increment) {
    currentPage += increment;
    if (currentPage < 0) {
        currentPage = 0;
    }
    fetchMarvelCharacters(currentPage);
}

// Function to handle pagination for comics
function changeComicsPage(increment) {
    currentComicsPage += increment;
    if (currentComicsPage < 0) {
        currentComicsPage = 0;
    }
    fetchMarvelComics(currentComicsPage);
}

// Function to highlight the active link in the navigation
function highlightActiveLink() {
    // Get the current page path
    const path = window.location.pathname;
    // Select all navigation links
    const navLinks = document.querySelectorAll('.nav-link');
    // Remove 'active' class from all links
    navLinks.forEach(link => link.classList.remove('active'));
    // Add 'active' class to the link that matches the current page
    navLinks.forEach(link => {
        if (link.getAttribute('href') === path || (path === '/' && link.getAttribute('href') === 'index.html')) {
            link.classList.add('active');
        }
    });
}

// Function to show the error message
function showError(message) {
    const errorMessage = document.getElementById('error-message');
    if (errorMessage) {
        errorMessage.innerHTML = `<p>${message}</p>`;
        errorMessage.style.display = 'block';
    }
}

// Function to hide the error message
function hideError() {
    const errorMessage = document.getElementById('error-message');
    if (errorMessage) {
        errorMessage.style.display = 'none';
    }
}



// Initialize the page content and highlight the active link
function init() {
    showSpinner();
    const path = window.location.pathname;

    if (path === '/' || path === '/index.html') {
        fetchMarvelCharacters(currentPage);
    } else if (path === '/comics.html') {
        fetchMarvelComics(currentComicsPage);
    }
    highlightActiveLink();
}

// Add event listeners for pagination buttons
document.addEventListener('DOMContentLoaded', () => {
    init();
    if (window.location.pathname === '/' || window.location.pathname === '/index.html') {
        document.getElementById('prev-page').addEventListener('click', () => changePage(-1));
        document.getElementById('next-page').addEventListener('click', () => changePage(1));
    }

    if (window.location.pathname === '/comics.html') {
        document.getElementById('prev-comics-page').addEventListener('click', () => changeComicsPage(-1));
        document.getElementById('next-comics-page').addEventListener('click', () => changeComicsPage(1));
    }
});
