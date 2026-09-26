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
let timer = null;
let selectedAnswers = [];

const startQuizButton = document.getElementById("start-quiz");
const startQuizSection = document.getElementById("start-quiz-section");
const quizSection = document.getElementById("quiz-section");
const resultSection = document.getElementById("result-section");

const questionNumberElement = document.getElementById("question-number");
const questionTextElement = document.getElementById("question-text");
const optionsContainer = document.getElementById("answer-options");
const timerElement = document.getElementById("time-left");

const nextButton = document.getElementById("next-question");
const previousButton = document.getElementById("previous-question");
const restartButton = document.getElementById("restart-quiz");
const submitButton = document.getElementById("submit-answer");

const scoreElement = document.getElementById("score");

quizSection.style.display = "none";
resultSection.style.display = "none";

startQuizButton.addEventListener("click", startQuiz);

function startQuiz() {
    startQuizSection.style.display = "none";
    quizSection.style.display = "block";
    resultSection.style.display = "none";

    currentQuestionIndex = 0;
    score = 0;
    timeLeft = 60;
    selectedAnswers = [];

    timerElement.textContent = timeLeft;

    displayQuestion();
    startTimer();
}

function displayQuestion() {
    const currentQuestion = questions[currentQuestionIndex];

    questionNumberElement.textContent =
        `${currentQuestionIndex + 1} of ${questions.length}`;

    questionTextElement.textContent =
        currentQuestion.question;

    optionsContainer.innerHTML = "";

    currentQuestion.options.forEach(function(option) {
        const optionItem = document.createElement("li");
        const optionButton = document.createElement("button");

        optionButton.textContent = option;
        optionButton.classList.add("option-button");

        if (selectedAnswers[currentQuestionIndex] === option) {
            optionButton.classList.add("selected");
        }

        optionButton.addEventListener("click", function() {
            selectOption(option);
        });

        optionItem.appendChild(optionButton);
        optionsContainer.appendChild(optionItem);
    });

    previousButton.disabled = currentQuestionIndex === 0;
    nextButton.disabled =
        currentQuestionIndex === questions.length - 1;
}

function selectOption(selectedOption) {
    selectedAnswers[currentQuestionIndex] = selectedOption;

    const optionButtons =
        document.querySelectorAll(".option-button");

    optionButtons.forEach(function(button) {
        button.classList.remove("selected");

        if (button.textContent === selectedOption) {
            button.classList.add("selected");
        }
    });
}

nextButton.addEventListener("click", function() {
    if (currentQuestionIndex < questions.length - 1) {
        currentQuestionIndex++;
        displayQuestion();
    }
});

previousButton.addEventListener("click", function() {
    if (currentQuestionIndex > 0) {
        currentQuestionIndex--;
        displayQuestion();
    }
});

submitButton.addEventListener("click", function() {
    clearInterval(timer);
    calculateScore();
    showResult();
});

function calculateScore() {
    score = 0;

    questions.forEach(function(question, index) {
        if (selectedAnswers[index] === question.answer) {
            score++;
        }
    });
}

function startTimer() {
    clearInterval(timer);

    timer = setInterval(function() {
        timeLeft--;

        timerElement.textContent = timeLeft;

        if (timeLeft <= 0) {
            clearInterval(timer);
            calculateScore();
            showResult();
        }
    }, 1000);
}

function showResult() {
    clearInterval(timer);

    quizSection.style.display = "none";
    startQuizSection.style.display = "none";
    resultSection.style.display = "block";

    scoreElement.textContent =
        `Your Score: ${score} out of ${questions.length}`;
}

restartButton.addEventListener("click", function() {
    clearInterval(timer);

    currentQuestionIndex = 0;
    score = 0;
    timeLeft = 60;
    selectedAnswers = [];

    resultSection.style.display = "none";
    quizSection.style.display = "none";
    startQuizSection.style.display = "block";

    timerElement.textContent = timeLeft;
});