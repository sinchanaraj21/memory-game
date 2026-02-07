// Greek alphabet symbols for the cards (18 unique symbols for 36 cards total)
const greekAlphabets = ['α', 'β', 'γ', 'δ', 'ε', 'ζ', 'η', 'θ', 'ι', 'κ', 'λ', 'μ', 'ν', 'ξ', 'ο', 'π', 'ρ', 'σ'];

let cards = [];
let flippedCards = [];
let matchedPairs = 0;
let score = 100;
let moves = 0;
let canFlip = false; // Start with false, will enable after countdown

// Initialize the game
function initGame() {
    // Reset game state
    cards = [];
    flippedCards = [];
    matchedPairs = 0;
    score = 100;
    moves = 0;
    canFlip = false;

    // Create pairs of cards
    const cardPairs = [...greekAlphabets, ...greekAlphabets];
    
    // Shuffle the cards
    cards = shuffleArray(cardPairs);

    // Update UI
    updateScore();
    document.getElementById('gameOver').classList.remove('show');
    document.getElementById('freezeOverlay').classList.remove('show');
    
    // Render the game board
    renderBoard();
    
    // Start the countdown sequence
    startCountdown();
}

// Shuffle array using Fisher-Yates algorithm
function shuffleArray(array) {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
}

// Render the game board
function renderBoard() {
    const gameBoard = document.getElementById('gameBoard');
    gameBoard.innerHTML = '';

    cards.forEach((symbol, index) => {
        const card = document.createElement('div');
        card.className = 'card';
        card.dataset.index = index;
        card.dataset.symbol = symbol;
        card.innerHTML = '<div class="card-back">?</div>';
        card.addEventListener('click', flipCard);
        gameBoard.appendChild(card);
    });
}

// Start countdown and show all cards
function startCountdown() {
    const overlay = document.getElementById('countdownOverlay');
    const countdownNumber = document.getElementById('countdownNumber');
    
    // Show all cards face up
    const allCards = document.querySelectorAll('.card');
    allCards.forEach(card => {
        card.classList.add('flipped');
        card.innerHTML = card.dataset.symbol;
    });
    
    // Show overlay
    overlay.classList.add('show');
    
    let count = 5;
    countdownNumber.textContent = count;
    
    const countdownInterval = setInterval(() => {
        count--;
        
        if (count > 0) {
            countdownNumber.textContent = count;
            // Restart animation
            countdownNumber.style.animation = 'none';
            setTimeout(() => {
                countdownNumber.style.animation = 'countdownPulse 1s ease-in-out';
            }, 10);
        } else {
            clearInterval(countdownInterval);
            
            // Hide overlay
            overlay.classList.remove('show');
            
            // Flip all cards back
            allCards.forEach(card => {
                card.classList.remove('flipped');
                card.innerHTML = '<div class="card-back">?</div>';
            });
            
            // Enable card flipping
            canFlip = true;
        }
    }, 1000);
}

// Handle card flip
function flipCard(e) {
    if (!canFlip) return;

    const card = e.currentTarget;
    const index = card.dataset.index;

    // Prevent flipping the same card twice or already matched cards
    if (card.classList.contains('flipped') || card.classList.contains('matched')) {
        return;
    }

    // Flip the card
    card.classList.add('flipped');
    card.innerHTML = card.dataset.symbol;
    flippedCards.push(card);

    // Check if two cards are flipped
    if (flippedCards.length === 2) {
        canFlip = false;
        moves++;
        updateScore();
        checkMatch();
    }
}

// Freeze the game when score reaches 0
function freezeGame() {
    canFlip = false;
    const freezeOverlay = document.getElementById('freezeOverlay');
    freezeOverlay.classList.add('show');
}

// Check if flipped cards match
function checkMatch() {
    const [card1, card2] = flippedCards;
    const symbol1 = card1.dataset.symbol;
    const symbol2 = card2.dataset.symbol;

    setTimeout(() => {
        if (symbol1 === symbol2) {
            // Cards match
            card1.classList.add('matched');
            card2.classList.add('matched');
            matchedPairs++;
            updateScore();

            // Check if all pairs are matched
            if (matchedPairs === greekAlphabets.length) {
                endGame(true);
            }
        } else {
            // Cards don't match - deduct points
            score = Math.max(0, score - 4);
            updateScore();

            // Add wrong animation
            card1.classList.add('wrong');
            card2.classList.add('wrong');

            setTimeout(() => {
                card1.classList.remove('flipped', 'wrong');
                card2.classList.remove('flipped', 'wrong');
                card1.innerHTML = '<div class="card-back">?</div>';
                card2.innerHTML = '<div class="card-back">?</div>';
            }, 500);

            // Check if score reached 0 - FREEZE THE GAME
            if (score === 0) {
                setTimeout(() => freezeGame(), 600);
                return; // Don't allow any more moves
            }
        }

        flippedCards = [];
        canFlip = true;
    }, 800);
}

// Update score display
function updateScore() {
    const scoreElement = document.getElementById('score');
    scoreElement.textContent = score;
    document.getElementById('moves').textContent = moves;
    document.getElementById('matches').textContent = matchedPairs;

    // Add danger class if score is low
    if (score <= 20) {
        scoreElement.classList.add('danger');
    } else {
        scoreElement.classList.remove('danger');
    }
}

// End the game
function endGame(won) {
    const gameOver = document.getElementById('gameOver');
    const title = document.getElementById('gameOverTitle');
    const message = document.getElementById('gameOverMessage');

    if (won) {
        title.textContent = '🎉 Congratulations!';
        message.textContent = `You won with a score of ${score} points in ${moves} moves!`;
    } else {
        title.textContent = '😔 Game Over!';
        message.textContent = `You ran out of points! You matched ${matchedPairs} out of ${greekAlphabets.length} pairs.`;
    }

    gameOver.classList.add('show');
}

// Reset button event listener
document.getElementById('resetBtn').addEventListener('click', initGame);

// Initialize the game on page load
initGame();