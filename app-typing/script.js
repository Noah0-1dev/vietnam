window.addEventListener('DOMContentLoaded', () => {
    const codeSnippet = `const originalArray = [1, 2, 3, 4, 5];
const mappedArray = originalArray.map(element => element * 2);
console.log(mappedArray);`;

    const textExample = document.getElementById('textExample');
    const textInput = document.getElementById('textInput');
    const timeLeftDisplay = document.getElementById('timeLeft');
    const wpmDisplay = document.getElementById('wpm');
    const accuracyDisplay = document.getElementById('accuracy');
    const startTestBtn = document.getElementById('startTestBtn');

    let maxTime = 30;
    let timeLeft = maxTime;
    let timerInterval = null;
    let isPlaying = false;
    let mistakes = 0;

    function loadText() {
        textExample.innerHTML = '';
        codeSnippet.split('').forEach(char => {
            const span = document.createElement('span');
            span.textContent = char;
            textExample.appendChild(span);
        });
        if(textExample.children.length > 0) textExample.children[0].classList.add('char-current');
    }

    function startTest() {
        isPlaying = true;
        timeLeft = maxTime;
        mistakes = 0;
        textInput.disabled = false;
        textInput.value = '';
        wpmDisplay.textContent = '0';
        accuracyDisplay.textContent = '100';
        timeLeftDisplay.textContent = timeLeft;
        
        loadText();
        textInput.focus();
        
        clearInterval(timerInterval);
        timerInterval = setInterval(updateTimer, 1000);
    }

    function updateTimer() {
        if (timeLeft > 0) {
            timeLeft--;
            timeLeftDisplay.textContent = timeLeft;
            
            let charactersTyped = textInput.value.length - mistakes;
            if(charactersTyped < 0) charactersTyped = 0;
            let timeElapsed = (maxTime - timeLeft) / 60;
            let wpm = Math.round((charactersTyped / 5) / timeElapsed);
            wpmDisplay.textContent = isFinite(wpm) && wpm > 0 ? wpm : 0;
        } else {
            endTest();
        }
    }

    textInput.addEventListener('input', () => {
        const spans = textExample.querySelectorAll('span');
        const inputChars = textInput.value.split('');
        mistakes = 0;

        spans.forEach((span, index) => {
            const inputChar = inputChars[index];
            span.classList.remove('char-correct', 'char-incorrect', 'char-current');

            if (inputChar == null) {
                if (index === inputChars.length) span.classList.add('char-current');
            } else if (inputChar === span.textContent) {
                span.classList.add('char-correct');
            } else {
                span.classList.add('char-incorrect');
                mistakes++;
            }
        });

        let totalTyped = inputChars.length;
        let accuracy = totalTyped > 0 ? Math.round(((totalTyped - mistakes) / totalTyped) * 100) : 100;
        accuracyDisplay.textContent = accuracy;

        if (totalTyped >= spans.length) endTest();
    });

    function endTest() {
        clearInterval(timerInterval);
        textInput.disabled = true;
        isPlaying = false;
        alert(`測驗結束！您的速度為: ${wpmDisplay.textContent} WPM，精準度為: ${accuracyDisplay.textContent}%`);
    }

    startTestBtn.addEventListener('click', startTest);
    loadText();
});