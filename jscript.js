const questions = [
    {
        question: "What is the capital of France?",
        options: ["Berlin", "Madrid", "Paris", "Rome"],
        answer: "Paris"
    },
    {
        question: "What is 2 + 2?",
        options: ["3", "4", "5", "6"],
        answer: "4"
    },
    {
        question: "What is the largest planet in our solar system?",
        options: ["Earth", "Mars", "Jupiter", "Saturn"],
        answer: "Jupiter"
    },
    {
        question: "What is the chemical symbol for water?",
        options: ["H2O", "CO2", "NaCl", "O2"],
        answer: "H2O"
    },
    {
        question: "What is the currency of Japan?",
        options: ["Yen", "Dollar", "Euro", "Pound"],
        answer: "Yen"
    },
    {
        question: "What is the largest ocean on Earth?",
        options: ["Atlantic Ocean", "Indian Ocean", "Arctic Ocean", "Pacific Ocean"],
        answer: "Pacific Ocean"
    },
    {
        question: "What is the tallest mountain in the world?",
        options: ["Mount Everest", "K2", "Kangchenjunga", "Lhotse"],
        answer: "Mount Everest"
    },
    {
        question: "What is the smallest country in the world?",
        options: ["Vatican City", "Monaco", "Nauru", "San Marino"],
        answer: "Vatican City"
    },
    {
        question: "What is the largest desert in the world?",
        options: ["Sahara Desert", "Arabian Desert", "Gobi Desert", "Kalahari Desert"],
        answer: "Sahara Desert"
    },
    {
        question: "What is the longest river in the world?",
        options: ["Nile River", "Amazon River", "Yangtze River", "Mississippi River"],
        answer: "Nile River"
    }
];

let currentQuestionIndex = 0;
let score = 0;
let timeLeft = 60;
let timer;
let selectedAnswers = [];

const storageKey = "quizProgress";

const startQuizButton = document.getElementById("start-quiz");
const startQuizSection = document.getElementById("start-quiz-section");
const quizSection = document.getElementById("quiz-section");
const resultSection = document.getElementById("result-section");

const questionNumber = document.getElementById("question-number");
const questionText = document.getElementById("question-text");
const answerOptions = document.getElementById("answer-options");
const timeLeftElement = document.getElementById("time-left");

const previousButton = document.getElementById("previous-question");
const submitButton = document.getElementById("submit-answer");
const nextButton = document.getElementById("next-question");
const restartButton = document.getElementById("restart-quiz");

const scoreElement = document.getElementById("score");

quizSection.style.display = "none";
resultSection.style.display = "none";

startQuizButton.addEventListener("click", function () {
    currentQuestionIndex = 0;
    score = 0;
    timeLeft = 60;
    selectedAnswers = [];

    localStorage.removeItem(storageKey);

    startQuizSection.style.display = "none";
    quizSection.style.display = "block";
    resultSection.style.display = "none";

    displayQuestion();
    startTimer();
    saveProgress();
});

function displayQuestion() {
    const currentQuestion = questions[currentQuestionIndex];

    questionNumber.textContent =
        `${currentQuestionIndex + 1} of ${questions.length}`;

    questionText.textContent = currentQuestion.question;

    answerOptions.innerHTML = "";

    currentQuestion.options.forEach(function (option) {
        const li = document.createElement("li");
        const button = document.createElement("button");

        button.type = "button";
        button.textContent = option;
        button.classList.add("option-button");

        if (selectedAnswers[currentQuestionIndex] === option) {
            button.classList.add("selected");
        }

        button.addEventListener("click", function () {
            selectedAnswers[currentQuestionIndex] = option;

            const allButtons =
                document.querySelectorAll(".option-button");

            allButtons.forEach(function (item) {
                item.classList.remove("selected");
            });

            button.classList.add("selected");

            saveProgress();
        });

        li.appendChild(button);
        answerOptions.appendChild(li);
    });

    previousButton.disabled = currentQuestionIndex === 0;
    nextButton.disabled =
        currentQuestionIndex === questions.length - 1;
}

nextButton.addEventListener("click", function () {
    if (currentQuestionIndex < questions.length - 1) {
        currentQuestionIndex++;
        displayQuestion();
        saveProgress();
    }
});

previousButton.addEventListener("click", function () {
    if (currentQuestionIndex > 0) {
        currentQuestionIndex--;
        displayQuestion();
        saveProgress();
    }
});

submitButton.addEventListener("click", function () {
    calculateScore();
    clearInterval(timer);
    showResult();
});

function calculateScore() {
    score = 0;

    questions.forEach(function (question, index) {
        if (selectedAnswers[index] === question.answer) {
            score++;
        }
    });
}

function startTimer() {
    clearInterval(timer);

    timer = setInterval(function () {
        timeLeft--;

        timeLeftElement.textContent = timeLeft;

        saveProgress();

        if (timeLeft <= 0) {
            clearInterval(timer);
            calculateScore();
            showResult();
        }
    }, 1000);
}

function showResult() {
    clearInterval(timer);

    localStorage.removeItem(storageKey);

    quizSection.style.display = "none";
    startQuizSection.style.display = "none";
    resultSection.style.display = "block";

    scoreElement.textContent =
        `Your Score: ${score} out of ${questions.length}`;
}

restartButton.addEventListener("click", function () {
    clearInterval(timer);

    currentQuestionIndex = 0;
    score = 0;
    timeLeft = 60;
    selectedAnswers = [];

    localStorage.removeItem(storageKey);

    resultSection.style.display = "none";
    quizSection.style.display = "none";
    startQuizSection.style.display = "block";

    timeLeftElement.textContent = timeLeft;
});

function saveProgress() {
    if (quizSection.style.display !== "block") {
        return;
    }

    const progress = {
        currentQuestionIndex: currentQuestionIndex,
        score: score,
        timeLeft: timeLeft,
        selectedAnswers: selectedAnswers
    };

    localStorage.setItem(
        storageKey,
        JSON.stringify(progress)
    );
}

function loadProgress() {
    const savedData = localStorage.getItem(storageKey);

    if (!savedData) {
        return false;
    }

    try {
        const progress = JSON.parse(savedData);

        if (
            typeof progress.currentQuestionIndex !== "number" ||
            progress.currentQuestionIndex < 0 ||
            progress.currentQuestionIndex >= questions.length
        ) {
            localStorage.removeItem(storageKey);
            return false;
        }

        if (
            typeof progress.timeLeft !== "number" ||
            progress.timeLeft <= 0
        ) {
            localStorage.removeItem(storageKey);
            return false;
        }

        currentQuestionIndex =
            progress.currentQuestionIndex;

        score =
            typeof progress.score === "number"
                ? progress.score
                : 0;

        timeLeft = progress.timeLeft;

        selectedAnswers =
            Array.isArray(progress.selectedAnswers)
                ? progress.selectedAnswers
                : [];

        return true;

    } catch (error) {
        localStorage.removeItem(storageKey);
        return false;
    }
}

window.addEventListener("load", function () {
    const savedQuiz = loadProgress();

    if (savedQuiz) {
        startQuizSection.style.display = "none";
        quizSection.style.display = "block";
        resultSection.style.display = "none";

        timeLeftElement.textContent = timeLeft;

        displayQuestion();
        startTimer();
    } else {
        startQuizSection.style.display = "block";
        quizSection.style.display = "none";
        resultSection.style.display = "none";
    }
});