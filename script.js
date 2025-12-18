let movie;
let hintIndex = 0;
let score = 40;

let totalScore = 0;
let movieCount = 0;
const MAX_MOVIES = 6;

let playerName = "";

/* ========= INTRO → START SCREEN ========= */
window.onload = () => {
    setTimeout(() => {
        document.getElementById("intro").style.display = "none";
        document.getElementById("start").hidden = false;
    }, 3000); // reel animation duration
};

/* ========= START GAME ========= */
async function startGame() {
    const input = document.getElementById("playerName");
    playerName = input.value.trim();

    if (!playerName) {
        alert("Please enter your name");
        return;
    }

    totalScore = 0;
    movieCount = 0;

    document.getElementById("start").style.display = "none";
    document.getElementById("game").hidden = false;

    loadMovie();
}

/* ========= LOAD MOVIE ========= */
async function loadMovie() {

    if (movieCount === MAX_MOVIES) {
        endGame();
        return;
    }

    // ✅ FIXED FETCH (this was the main error)
    const res = await fetch("http://localhost:8080/start");
    movie = await res.json();

    hintIndex = 0;
    score = 40;
    movieCount++;

    document.getElementById("game").style.backgroundImage =
        `url(${movie.background})`;

    // Initial visible info (NOT a hint)
    document.getElementById("info").innerText =
        `${movie.language} · ${movie.hero} · ${movie.genre}`;

    document.getElementById("hintBox").innerText = "";
    document.getElementById("guess").value = "";

    updateScore();
}


/* ========= UPDATE SCORE ========= */
function updateScore() {
    document.getElementById("score").innerText =
        `Score: ${score} | Movie ${movieCount}/${MAX_MOVIES}`;
}

/* ========= SHOW HINT ========= */
function showHint() {

    if (hintIndex >= movie.hints.length) {
        document.getElementById("hintBox").innerText = "❌ No more hints!";
        score = 0;
        updateScore();
        return;
    }

    document.getElementById("hintBox").innerText =
        movie.hints[hintIndex].text;

    // scoring logic
    if (hintIndex === 0) score = 30;       // heroine + director
    else if (hintIndex === 1) score = 20;  // summary
    else if (hintIndex === 2) score = 10;  // meme

    hintIndex++;
    updateScore();
}

/* ========= CHECK ANSWER ========= */
function check() {
    const g = document.getElementById("guess").value.trim().toLowerCase();
    if (!g) return;

    if (g === movie.name.toLowerCase()) {
        totalScore += score;

        showPopup(
            "🎉 Correct!",
            `You scored ${score} points`,
            loadMovie   // move to next movie ONLY if correct
        );

    } else {
        showPopup(
            "❌ Wrong Answer",
            "Try again 🙂",
            () => {}    // do nothing, stay on same movie
        );
    }
}



/* ========= NEXT MOVIE (SKIP) ========= */
function nextMovie() {
    showPopup(
        "⏭️ Skipped",
        "You scored 0 points",
        loadMovie
    );
}


/* ========= END GAME ========= */
function endGame() {
    saveScore();
    showLeaderboard();
}

/* ========= SAVE SCORE ========= */
function saveScore() {
    let board = JSON.parse(localStorage.getItem("leaderboard")) || [];
    board.push({ name: playerName, score: totalScore });
    board.sort((a, b) => b.score - a.score);
    board = board.slice(0, 5);
    localStorage.setItem("leaderboard", JSON.stringify(board));
}

/* ========= SHOW LEADERBOARD ========= */
function showLeaderboard() {
    const board = JSON.parse(localStorage.getItem("leaderboard")) || [];
    const medals = ["🥇", "🥈", "🥉"];

    document.getElementById("game").innerHTML = `
        <div class="game-box leaderboard-box">

            <h1>🏆 Leaderboard</h1>

            <div class="player-name">
                ${playerName}
            </div>

            <div class="player-score">
                Your Score: ${totalScore} / 240
            </div>

            <ol class="leaderboard-list">
                ${board.map((p, i) => `
                    <li>
                        <span class="rank">${medals[i] || "🎬"}</span>
                        <span class="player">${p.name}</span>
                        <span class="points">${p.score}</span>
                    </li>
                `).join("")}
            </ol>

            <button onclick="location.reload()">Play Again</button>
            <button onclick="clearLeaderboard()">Clear Leaderboard 🧹</button>

        </div>
    `;
}



function showPopup(title, message, callback) {
    document.getElementById("popupTitle").innerText = title;
    document.getElementById("popupMessage").innerText = message;
    document.getElementById("popupOverlay").classList.remove("hidden");

    window.popupCallback = callback;
}

function closePopup() {
    document.getElementById("popupOverlay").classList.add("hidden");
    if (window.popupCallback) window.popupCallback();
}

function clearLeaderboard() {
    localStorage.removeItem("leaderboard");
    location.reload();
}
