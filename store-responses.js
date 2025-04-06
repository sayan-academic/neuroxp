import { db, collection, addDoc, serverTimestamp } from "./firebase-config.js";

// Function to store quiz responses
async function storeQuizResponse(quizType, questionNumber, response) {
    try {
        const docRef = await addDoc(collection(db, `${quizType}-responses`), {
            questionNumber: questionNumber,
            response: response,
            timestamp: serverTimestamp()
        });

        console.log(`Saved: ${quizType} - Q${questionNumber}: ${response}`);
        alert("Response saved successfully!");
    } catch (error) {
        console.error("Error saving response:", error);
    }
}

// Export for use in individual quiz files
export { storeQuizResponse };
