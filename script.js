// Enhanced script.js

document.addEventListener('DOMContentLoaded', () => {
    const typingText = document.getElementById('paragraph');
    const inputField = document.querySelector('.input-field');
    const timeLeft = document.getElementById('time-left');
    const mistakesSpan = document.getElementById('mistakes');
    const wpmSpan = document.getElementById('wpm');
    const cpmSpan = document.getElementById('cpm');
    const tryAgainBtn = document.getElementById('try-again');

    const paragraphs = [
        "When you have eliminated the impossible, whatever remains, however improbable, must be the truth.",
        "There is nothing more deceptive than an obvious fact.",
        "I ought to know by this time that when a fact appears to be opposed to a long train of deductions it invariably proves to be capable of bearing some other interpretation.",
        "I never make exceptions. An exception disproves the rule.",
        "What one man can invent another can discover.",
        "Nothing clears up a case so much as stating it to another person.",
        "Education never ends, Watson. It is a series of lessons, with the greatest for the last."
    ];

    let timer;
    let maxTime = 60;
    let timeLeftValue = maxTime;
    let charIndex = 0;
    let mistakes = 0;
    let isTyping = false;
    let totalCharsTyped = 0; // Added to track total characters typed including mistakes

    function randomParagraph() {
        const randomIndex = Math.floor(Math.random() * paragraphs.length);
        typingText.innerHTML = "";
        paragraphs[randomIndex].split("").forEach(char => {
            const span = document.createElement('span');
            span.innerText = char;
            typingText.appendChild(span);
        });
        typingText.querySelectorAll('span')[0].classList.add('active');
        // Reset totalCharsTyped with each new paragraph
        totalCharsTyped = 0;
    }

    function initTyping() {
        const characters = typingText.querySelectorAll('span');
        const typedChar = inputField.value.split('')[charIndex];

        if (!isTyping) {
            timer = setInterval(updateTimer, 1000);
            isTyping = true;
        }

        if (typedChar == null) {
            if (charIndex > 0) {
                charIndex--;
                if (characters[charIndex].classList.contains('incorrect')) {
                    mistakes--;
                }
                characters[charIndex].classList.remove('correct', 'incorrect', 'active');
                characters[charIndex].classList.add('active');
                totalCharsTyped--; // Decrement totalCharsTyped on backspace
            }
        } else {
            totalCharsTyped++; // Increment totalCharsTyped for every character typed
            if (characters[charIndex].innerText === typedChar) {
                characters[charIndex].classList.add('correct');
            } else {
                mistakes++;
                characters[charIndex].classList.add('incorrect');
            }
            characters[charIndex].classList.remove('active');
            charIndex++;
            if (charIndex < characters.length) {
                characters[charIndex].classList.add('active');
            } else {
                // Typing finished
                clearInterval(timer);
                inputField.disabled = true;
                const wpm = Math.round(((charIndex - mistakes) / 5) / ((maxTime - timeLeftValue) / 60));
                alert(`Your typing speed was ${wpm} WPM with ${mistakes} mistakes. Total characters typed: ${totalCharsTyped}`);
            }
        }

        characters.forEach(span => span.classList.remove('active'));
        if (charIndex < characters.length) {
            characters[charIndex].classList.add('active');
        }

        mistakesSpan.innerText = mistakes;
        cpmSpan.innerText = totalCharsTyped; // Update to show total characters typed
        wpmSpan.innerText = Math.round(((charIndex - mistakes) / 5) / ((maxTime - timeLeftValue) / 60));
    }

    function updateTimer() {
        if (timeLeftValue > 0) {
            timeLeftValue--;
            timeLeft.innerText = timeLeftValue;
        } else {
            clearInterval(timer);
            inputField.disabled = true;
            alert(`Time's up! Your typing speed was ${wpmSpan.innerText} WPM with ${mistakes} mistakes. Total characters typed: ${totalCharsTyped}`);
        }
    }

    function resetGame() {
        randomParagraph();
        inputField.value = "";
        clearInterval(timer);
        timeLeftValue = maxTime;
        charIndex = 0;
        mistakes = 0;
        isTyping = false;
        totalCharsTyped = 0; // Reset totalCharsTyped on game reset
        timeLeft.innerText = timeLeftValue;
        mistakesSpan.innerText = mistakes;
        wpmSpan.innerText = 0;
        cpmSpan.innerText = 0;
        inputField.disabled = false;
    }

    randomParagraph();
    inputField.addEventListener('input', initTyping);
    tryAgainBtn.addEventListener('click', resetGame);
});
