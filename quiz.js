const quizContainer = document.getElementById("quiz-container");
const quizQuestionE1 = document.getElementById("quiz-question");
const quizAnswerE1 = document.getElementById("quiz-answer");
const submitAnswerBtn = document.getElementById("submit-answer-btn");
const quizResultE1 = document.getElementById("quiz-result");
const showWordBankBtn = document.getElementById("show-word-bank-btn");
const wordBankContainer = document.getElementById("word-bank-container");
const wordBankList = document.getElementById("word-bank-list");

let savedWords = JSON.parse(localStorage.getItem("savedWords")) || [];
let currentQuestionIndex = 0;
let correctAnswers = 0;

function loadQuestion() {
    if (currentQuestionIndex >= savedWords.length) {
        showFinalScore();
        return;
    }

    const currentWord = savedWords[currentQuestionIndex];
    fetchWordMeaning(currentWord);
}

async function fetchWordMeaning(word) {
    const url = `https://api.dictionaryapi.dev/api/v2/entries/en/${word}`;
    try {
        const result = await fetch(url).then((res) => res.json());

        if (result.title) {
            quizQuestionE1.innerText = `Sorry, we couldn't find the meaning for "${word}".`;
            quizAnswerE1.style.display = 'none';
            submitAnswerBtn.style.display = 'none'; 
            quizResultE1.innerHTML = '';
        } else {
            const meaning = result[0].meanings[0].definitions[0].definition;
            generateQuizQuestion(word, meaning);
        }
    } catch (error) {
        console.error(error);
    }
}

function generateQuizQuestion(word, correctAnswer) {
    quizQuestionE1.innerText = `What word matches the definition: "${correctAnswer}"?`;

    quizAnswerE1.style.display = 'inline-block';
    submitAnswerBtn.style.display = 'inline-block';

    quizResultE1.innerHTML = '';

    submitAnswerBtn.onclick = () => checkAnswer(word, correctAnswer);
}

function checkAnswer(word, correctAnswer) {
    const userAnswer = quizAnswerE1.value.trim().toLowerCase();

    if (userAnswer === word.toLowerCase()) {
        correctAnswers++;
        quizResultE1.innerText = "Correct!";
    } else {
        quizResultE1.innerText = `Incorrect! The correct word was: ${word}`;
    }

    setTimeout(() => {
        currentQuestionIndex++;
        quizResultE1.innerText = '';
        quizAnswerE1.value = ''; 
        loadQuestion();
    }, 2000); 
}

function showFinalScore() {
    quizQuestionE1.innerText = "Quiz Complete!";
    quizAnswerE1.style.display = 'none'; 
    submitAnswerBtn.style.display = 'none'; 
    quizResultE1.innerHTML = `Your score: ${correctAnswers} out of ${savedWords.length}`;
    showWordBankBtn.style.display = "none";
}

function toggleWordBank() {
    if (wordBankContainer.style.display === "none") {
        wordBankContainer.style.display = "block";
        showWordBankBtn.innerText = "Hide Word Bank";
        showWordBankList();
    } else {
        wordBankContainer.style.display = "none";
        showWordBankBtn.innerText = "Show Word Bank";
    }
}

function showWordBankList() {
    wordBankList.innerHTML = "";
    savedWords.forEach((word) => {
        const listItem = document.createElement("li");
        listItem.textContent = word;
        wordBankList.appendChild(listItem);
    });
}

showWordBankBtn.addEventListener("click", toggleWordBank);

loadQuestion();
