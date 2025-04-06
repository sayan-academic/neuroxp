import { db, collection, addDoc } from "../firebase-config.js";

// Dynamically get the quiz type from the directory name
const quizType = window.location.pathname.split('/')[1]; 

let correctCount = 0; 
let totalQuestions = 0;

// Function to store individual quiz responses
async function storeQuizResponse(questionNumber, selectedAnswer, isCorrect) {
    try {
        // Store the response in Firestore
        await addDoc(collection(db, `${quizType}-responses`), {
            questionNumber: questionNumber,
            response: selectedAnswer,
            isCorrect: isCorrect
        });

        console.log(`Saved: ${quizType} - Q${questionNumber}: ${selectedAnswer} (Correct: ${isCorrect})`);

        // Track the score
        if (isCorrect) {
            correctCount++;
        }
        totalQuestions++;

    } catch (error) {
        console.error("Error saving response:", error);
    }
}

// Function to store the final score percentage
async function storeFinalScore() {
    if (totalQuestions === 0) return;

    const scorePercentage = Math.round((correctCount / totalQuestions) * 100);

    try {
        // Store the final score in the -scores collection
        await addDoc(collection(db, `${quizType}-scores`), {
            correctAnswers: correctCount,
            totalQuestions: totalQuestions,
            scorePercentage: scorePercentage
        });

        console.log(`Final Score Stored: ${scorePercentage}%`);

        // Reset counters
        correctCount = 0;
        totalQuestions = 0;

    } catch (error) {
        console.error("Error storing final score:", error);
    }
}

// Function to handle answer clicks
window.handleAnswerClick = async (questionNumber, btn) => {
    const selectedAnswer = btn.innerText;
    const isCorrect = btn.getAttribute('data-answer') === "1";

    // Disable buttons for the current question
    const buttons = document.querySelectorAll(`[data-question="${questionNumber}"]`);
    buttons.forEach(button => button.disabled = true);

    await storeQuizResponse(questionNumber, selectedAnswer, isCorrect);

    // Check if it's the last question
    const lastQuestionNumber = document.querySelectorAll('[data-question]').length;
    if (questionNumber === lastQuestionNumber) {
        await storeFinalScore();
    }
};
