import dotenv from 'dotenv'; // Import dotenv
import { ChatOpenAI } from "@langchain/openai"; // Import only ChatOpenAI

dotenv.config(); // Load environment variables from .env file

const model = new ChatOpenAI({ apiKey: process.env.OPENAI_API_KEY }); // Pass the API key

async function askQuestion(question) {
    try {
        console.log(`Asking: ${question}`); // Debugging log

        const response = await model.call([{ role: 'user', content: question }]); // Format the message
        console.log("Raw Response:", response); // Log the raw response for debugging

        const answer = response.content; // Directly access the content property
        console.log(`AI: ${answer}`);
    } catch (error) {
        console.error("Error:", error); // Log any errors that occur
    }
}

console.log("Hello! I'm your AI assistant. You can ask me anything.");

// Input handling to ask questions
process.stdin.on('data', async (input) => {
    const question = input.toString().trim();

    // Check for exit command
    if (question.toLowerCase() === 'exit') {
        console.log("Exiting the AI assistant. Goodbye!");
        process.exit(); // Exit the program
    }

    await askQuestion(question);
});
