// Greek alphabet symbols - 18 pairs for 6x6 grid
const greekAlphabets = ['Α', 'Β', 'Γ', 'Δ', 'Ε', 'Ζ', 'Η', 'Θ', 'Ι', 'Κ', 'Λ', 'Μ', 'Ν', 'Ξ', 'Ο', 'Π', 'Ρ', 'Σ'];

let cards = [];
let flippedCards = [];
let matchedPairs = 0;
let score = 100;
let moves = 0;
let canFlip = true;
let visitedCards = new Set(); // Track which cards have been visited

// Initialize game
function initGame() {
    // Create pairs of cards (18 pairs = 36 cards for 6x6 grid)
    cards = [...greekAlphabets, ...greekAlphabets];
    
    // Shuffle cards
    cards = cards.sort(() => Math.random() - 0.5);
    
    // Reset game state
    flippedCards = [];
    matchedPairs = 0;
    score = 100;
    moves = 0;
    canFlip = true;
    visitedCards = new Set(); // Reset visited cards tracking
    
    // Update UI
    updateScore();
    renderBoard();
}

// Render game board
function renderBoard() {
    const gameBoard = document.getElementById('gameBoard');
    gameBoard.innerHTML = '';
    
    cards.forEach((symbol, index) => {
        const card = document.createElement('div');
        card.className = 'card';
        card.dataset.index = index;
        card.dataset.symbol = symbol;
        card.innerHTML = '<span class="card-back">?</span>';
        card.addEventListener('click', () => flipCard(index));
        gameBoard.appendChild(card);
    });
}

// Flip card
function flipCard(index) {
    if (!canFlip) return;
    
    const card = document.querySelector(`[data-index="${index}"]`);
    
    // Don't flip if already flipped or matched
    if (card.classList.contains('flipped') || card.classList.contains('matched')) {
        return;
    }
    
    // Flip the card
    card.classList.add('flipped');
    card.innerHTML = card.dataset.symbol;
    flippedCards.push({ 
        index, 
        symbol: card.dataset.symbol, 
        element: card,
        wasVisited: visitedCards.has(index) // Check if this card was visited before
    });
    
    // Mark this card as visited
    visitedCards.add(index);
    
    // Check for match when two cards are flipped
    if (flippedCards.length === 2) {
        canFlip = false;
        moves++;
        updateScore();
        
        setTimeout(() => checkMatch(), 800);
    }
}

// Check if cards match
function checkMatch() {
    const [card1, card2] = flippedCards;
    
    if (card1.symbol === card2.symbol) {
        // Match found
        card1.element.classList.add('matched');
        card2.element.classList.add('matched');
        card1.element.classList.remove('flipped');
        card2.element.classList.remove('flipped');
        
        matchedPairs++;
        updateScore();
        
        // Check if game is won
        if (matchedPairs === greekAlphabets.length) {
            setTimeout(() => endGame(true), 500);
        }
    } else {
        // No match - apply penalty logic
        let penaltyApplied = false;
        
        // PENALTY RULE 1: Both cards visited second time (both were flipped before)
        if (card1.wasVisited && card2.wasVisited) {
            score -= 4;
            penaltyApplied = true;
        }
        // PENALTY RULE 2: At least one card was visited once before
        else if (card1.wasVisited || card2.wasVisited) {
            score -= 4;
            penaltyApplied = true;
        }
        // NO PENALTY: Both cards are being visited for the first time
        
        if (penaltyApplied) {
            card1.element.classList.add('wrong');
            card2.element.classList.add('wrong');
        }
        
        updateScore();
        
        // Flip cards back
        setTimeout(() => {
            card1.element.classList.remove('flipped', 'wrong');
            card2.element.classList.remove('flipped', 'wrong');
            card1.element.innerHTML = '<span class="card-back">?</span>';
            card2.element.innerHTML = '<span class="card-back">?</span>';
        }, 500);
        
        // Check if game is lost (score = 0 or below)
        if (score <= 0) {
            score = 0;
            updateScore();
            setTimeout(() => endGame(false), 500);
        }
    }
    
    flippedCards = [];
    canFlip = true;
}

// Update score display
function updateScore() {
    const scoreElement = document.getElementById('score');
    scoreElement.textContent = score;
    
    // Color coding based on score
    scoreElement.className = 'score-value';
    if (score <= 20) {
        scoreElement.classList.add('danger');
    } else if (score <= 50) {
        scoreElement.classList.add('warning');
    }
    
    document.getElementById('matches').textContent = `${matchedPairs}/${greekAlphabets.length}`;
    document.getElementById('moves').textContent = moves;
}

// End game
function endGame(won) {
    const modal = document.getElementById('gameOverModal');
    const title = document.getElementById('gameOverTitle');
    const message = document.getElementById('gameOverMessage');
    const finalScore = document.getElementById('finalScore');
    
    if (won) {
        title.textContent = '🎉 Congratulations!';
        message.textContent = 'You matched all pairs!';
        title.style.color = '#4169E1';
    } else {
        title.textContent = '😢 Game Over!';
        message.textContent = 'Your score reached 0!';
        title.style.color = '#DC143C';
    }
    
    finalScore.textContent = `Final Score: ${score}`;
    finalScore.style.color = won ? '#FFB6C1' : '#DC143C';
    
    modal.classList.add('show');
}

// Reset game
function resetGame() {
    document.getElementById('gameOverModal').classList.remove('show');
    initGame();
}

// Start game on load
window.onload = initGame;