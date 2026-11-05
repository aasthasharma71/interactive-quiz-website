
// Get HTML elements
const welcomeScreen = document.getElementById("welcome-screen");
const quizScreen = document.getElementById("quiz-screen");
const resultScreen = document.getElementById("result-screen");

const startButton = document.getElementById("start-btn");
const nextButton = document.getElementById("next-btn");
const restartButton = document.getElementById("restart-btn");

const questionCounter = document.getElementById("question-counter");
const scoreDisplay = document.getElementById("score");
const questionText = document.getElementById("question-text");
const optionsContainer = document.getElementById("options-container");
const feedback = document.getElementById("feedback");
const progressBar = document.getElementById("progress-bar");

const finalScore = document.getElementById("final-score");
const resultDescription = document.getElementById("result-description");


// Quiz variables
let questions = [];
let currentQuestionIndex = 0;
let score = 0;
let answerSelected = false;


// Load questions from JSON file
async function loadQuestions() {
    try {
        const response = await fetch("data/questions.json");

        if (!response.ok) {
            throw new Error("Unable to load questions.");
        }

        questions = await response.json();

        if (!Array.isArray(questions) || questions.length === 0) {
            throw new Error("No quiz questions found.");
        }

        questions.forEach((question) => {
            if (
                typeof question.question !== "string" ||
                !Array.isArray(question.options) ||
                question.options.length !== 4 ||
                !question.options.includes(question.answer) ||
                typeof question.explanation !== "string"
            ) {
                throw new Error("Invalid question data in JSON file.");
            }
        });

        startButton.disabled = false;

    } catch (error) {
        console.error("Error:", error);
        startButton.disabled = true;
        alert("Unable to load quiz questions. Please run the project using Live Server.");
    }
}


// Start Quiz
function startQuiz() {
    currentQuestionIndex = 0;
    score = 0;

    welcomeScreen.classList.add("hidden");
    resultScreen.classList.add("hidden");
    quizScreen.classList.remove("hidden");

    showQuestion();
}


// Display Question
function showQuestion() {
    answerSelected = false;

    const currentQuestion = questions[currentQuestionIndex];

    questionCounter.textContent =
        `Question ${currentQuestionIndex + 1} of ${questions.length}`;

    scoreDisplay.textContent = `Score: ${score}`;

    questionText.textContent = currentQuestion.question;

    optionsContainer.innerHTML = "";

    feedback.textContent = "";

    nextButton.classList.add("hidden");

    progressBar.style.width =
        `${(currentQuestionIndex / questions.length) * 100}%`;


    // Create answer buttons
    currentQuestion.options.forEach((option) => {

        const button = document.createElement("button");

        button.textContent = option;

        button.classList.add("option-btn");

        button.addEventListener("click", () => {
            selectAnswer(button, option);
        });

        optionsContainer.appendChild(button);

    });
}


// Check Selected Answer
function selectAnswer(selectedButton, selectedOption) {

    if (answerSelected) {
        return;
    }

    answerSelected = true;

    const currentQuestion = questions[currentQuestionIndex];

    const allOptions = document.querySelectorAll(".option-btn");

    // Disable all options after selection
    allOptions.forEach((button) => {
        button.disabled = true;

        if (button.textContent === currentQuestion.answer) {
            button.classList.add("correct");
        }
    });


    // Check answer
    if (selectedOption === currentQuestion.answer) {

        score++;

        feedback.textContent = "Correct Answer! Well done.";

        feedback.style.color = "#28a745";

    } else {

        selectedButton.classList.add("incorrect");

        feedback.textContent =
            `Incorrect! ${currentQuestion.explanation}`;

        feedback.style.color = "#dc3545";

    }

    scoreDisplay.textContent = `Score: ${score}`;

    nextButton.classList.remove("hidden");

    if (currentQuestionIndex === questions.length - 1) {
        nextButton.textContent = "View Result";
    } else {
        nextButton.textContent = "Next Question";
    }

}


// Next Question
function nextQuestion() {

    currentQuestionIndex++;

    if (currentQuestionIndex < questions.length) {

        showQuestion();

    } else {

        showResult();

    }

}


// Display Final Result
function showResult() {

    quizScreen.classList.add("hidden");

    resultScreen.classList.remove("hidden");

    finalScore.textContent =
        `Your Score: ${score}/${questions.length}`;

    progressBar.style.width = "100%";

    if (score === questions.length) {

        resultDescription.textContent =
            "Excellent! You answered every question correctly.";

    } else if (score >= questions.length / 2) {

        resultDescription.textContent =
            "Good job! Keep practising to improve your score.";

    } else {

        resultDescription.textContent =
            "Keep learning and try again. Practice makes perfect!";

    }

}


// Restart Quiz
function restartQuiz() {

    currentQuestionIndex = 0;

    score = 0;

    nextButton.textContent = "Next Question";

    resultScreen.classList.add("hidden");

    welcomeScreen.classList.remove("hidden");

    progressBar.style.width = "0%";

}


// Button Events
startButton.addEventListener("click", startQuiz);

nextButton.addEventListener("click", nextQuestion);

restartButton.addEventListener("click", restartQuiz);


// Load questions when the page opens
loadQuestions();
