window.addEventListener('DOMContentLoaded', () => {
    const emojis = ['🦊', '🦊', '🐱', '🐱', '🐼', '🐼', '🦁', '🦁', '🐸', '🐸', '🐵', '🐵', '🦄', '🦄', '🐝', '🐝'];
    const gameBoard = document.getElementById('gameBoard');
    const timerDisplay = document.getElementById('timer');
    const clicksDisplay = document.getElementById('clicks');
    const restartBtn = document.getElementById('restartBtn');

    let flippedCards = [];
    let matchedCount = 0;
    let clicks = 0;
    let timer = 0;
    let timerInterval = null;
    let isLocked = false;

    function shuffle(array) {
        let currentIndex = array.length, randomIndex;
        while (currentIndex != 0) {
            randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex--;
            [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
        }
        return array;
    }

    function startTimer() {
        if (timerInterval) return;
        timerInterval = setInterval(() => {
            timer++;
            const mins = String(Math.floor(timer / 60)).padStart(2, '0');
            const secs = String(timer % 60).padStart(2, '0');
            timerDisplay.textContent = `${mins}:${secs}`;
        }, 1000);
    }

    function stopTimer() {
        clearInterval(timerInterval);
        timerInterval = null;
    }

    function initGame() {
        gameBoard.innerHTML = '';
        flippedCards = [];
        matchedCount = 0;
        clicks = 0;
        timer = 0;
        isLocked = false;
        clicksDisplay.textContent = '0';
        timerDisplay.textContent = '00:00';
        stopTimer();

        const shuffledList = shuffle([...emojis]);
        shuffledList.forEach((emoji) => {
            const card = document.createElement('div');
            card.classList.add('card');
            card.innerHTML = `
                <div class="card-inner">
                    <div class="card-back">🌀</div>
                    <div class="card-front">${emoji}</div>
                </div>
            `;
            card.addEventListener('click', () => flipCard(card));
            gameBoard.appendChild(card);
        });
    }

    function flipCard(card) {
        if (isLocked) return;
        if (card.classList.contains('flipped') || card.classList.contains('matched')) return;

        startTimer();
        card.classList.add('flipped');
        flippedCards.push(card);
        
        clicks++;
        clicksDisplay.textContent = clicks;

        if (flippedCards.length === 2) {
            isLocked = true; // Khóa click tạm thời khi đang kiểm tra cặp bài
            checkMatch();
        }
    }

    function checkMatch() {
        const [card1, card2] = flippedCards;
        const emoji1 = card1.querySelector('.card-front').textContent;
        const emoji2 = card2.querySelector('.card-front').textContent;

        if (emoji1 === emoji2) {
            card1.classList.add('matched');
            card2.classList.add('matched');
            flippedCards = [];
            matchedCount += 2;
            isLocked = false;

            if (matchedCount === emojis.length) {
                stopTimer();
                setTimeout(() => alert(`🎉 完美的記憶力！總共點擊 ${clicks} 次，耗時 ${timer} 秒破關！`), 400);
            }
        } else {
            setTimeout(() => {
                card1.classList.remove('flipped');
                card2.classList.remove('flipped');
                flippedCards = [];
                isLocked = false; // Mở khóa cho lượt chơi tiếp theo
            }, 1000);
        }
    }

    restartBtn.addEventListener('click', initGame);
    initGame();
});