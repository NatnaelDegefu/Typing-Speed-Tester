const quotes = {
    easy: [
        "Practice makes perfect.",
        "Typing fast requires focus.",
        "Success comes with consistency.",
        "Never stop learning new things."
    ],

    medium: [
        "Technology has changed the way people communicate around the world.",
        "Typing speed improves when you practice every single day consistently.",
        "Web development combines creativity and logical problem solving together."
    ],

    hard: [
        "Programming languages empower developers to build scalable applications efficiently and creatively.",
        "Discipline and determination are often more valuable than temporary motivation in achieving success.",
        "Artificial intelligence continues transforming industries through automation and data driven systems."
    ]
};

const quoteElement = document.getElementById("quote");
const inputElement = document.getElementById("input");
const timerElement = document.getElementById("timer");
const wpmElement = document.getElementById("wpm");
const accuracyElement = document.getElementById("accuracy");
const mistakesElement = document.getElementById("mistakes");
const restartBtn = document.getElementById("restartBtn");
const difficultySelect = document.getElementById("difficulty");
const resultMessage = document.getElementById("resultMessage");

let timer = 0;
let interval = null;
let started = false;
let mistakes = 0;
let currentQuote = "";
let usedQuotes = [];

function getRandomQuote() {

    const difficulty = difficultySelect.value;
    const availableQuotes = quotes[difficulty];

    if (usedQuotes.length === availableQuotes.length) {
        usedQuotes = [];
    }

    let randomQuote;

    do {
        randomQuote =
            availableQuotes[
                Math.floor(Math.random() * availableQuotes.length)
            ];
    } while (usedQuotes.includes(randomQuote));

    usedQuotes.push(randomQuote);

    return randomQuote;
}

function renderQuote() {

    currentQuote = getRandomQuote();

    quoteElement.innerHTML = "";

    currentQuote.split("").forEach(char => {

        const span = document.createElement("span");
        span.innerText = char;

        quoteElement.appendChild(span);
    });

    quoteElement.childNodes[0].classList.add("active");
}

function startTimer() {

    interval = setInterval(() => {

        timer++;

        timerElement.innerText = timer;

        calculateWPM();

    }, 1000);
}

function calculateWPM() {

    const wordsTyped = inputElement.value.trim().split(/\s+/).length;

    const wpm = Math.round((wordsTyped / timer) * 60) || 0;

    wpmElement.innerText = wpm;
}

function calculateAccuracy(correctChars, totalChars) {

    const accuracy =
        Math.round((correctChars / totalChars) * 100) || 100;

    accuracyElement.innerText = accuracy;
}

inputElement.addEventListener("input", () => {

    const enteredText = inputElement.value.split("");
    const quoteChars = quoteElement.querySelectorAll("span");

    let correctChars = 0;
    mistakes = 0;

    if (!started && inputElement.value.length > 0) {

        started = true;
        startTimer();
    }

    quoteChars.forEach((charSpan, index) => {

        const typedChar = enteredText[index];

        charSpan.classList.remove("correct", "incorrect", "active");

        if (typedChar == null) {

            charSpan.classList.add("active");

        } else if (typedChar === charSpan.innerText) {

            charSpan.classList.add("correct");
            correctChars++;

        } else {

            charSpan.classList.add("incorrect");
            mistakes++;
        }
    });

    mistakesElement.innerText = mistakes;

    calculateAccuracy(correctChars, enteredText.length);

    const completed =
        enteredText.length === currentQuote.length &&
        mistakes === 0;

    if (completed) {

        clearInterval(interval);

        inputElement.disabled = true;

        resultMessage.innerHTML =
            `🔥 Finished! Your speed is ${wpmElement.innerText} WPM`;
    }
});

function restartTest() {

    clearInterval(interval);

    timer = 0;
    started = false;
    mistakes = 0;

    timerElement.innerText = 0;
    wpmElement.innerText = 0;
    accuracyElement.innerText = 100;
    mistakesElement.innerText = 0;

    inputElement.value = "";
    inputElement.disabled = false;

    resultMessage.innerHTML = "";

    renderQuote();
}

restartBtn.addEventListener("click", restartTest);

difficultySelect.addEventListener("change", restartTest);

renderQuote();