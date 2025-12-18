// API endpoints
const START_URL = "http://localhost:8080/start";
const HINT_URL = "http://localhost:8080/";

// Elements
const startBtn = document.getElementById("startBtn");
const movieBox = document.getElementById("movieBox");
const movieTitle = document.getElementById("movieTitle");
const hintBtn = document.getElementById("hintBtn");
const hintText = document.getElementById("hintText");

let currentMovieId = null;

// Start Game
startBtn.addEventListener("click", () => {
    fetch(START_URL)
    .then(res => res.json())
    .then(data => {
        currentMovieId = data.id;
        movieTitle.textContent = "🎥 Movie: " + data.title;
        movieBox.classList.remove("hidden");
        hintText.textContent = "";
    });
});

// Get Hint
hintBtn.addEventListener("click", () => {
    if (currentMovieId === null) return;

    fetch(`${HINT_URL}${currentMovieId}/hint/1`)
    .then(res => res.text())
    .then(hint => {
        hintText.textContent = "💡 Hint: " + hint;
    });
});
