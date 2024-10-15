import dotenv from 'dotenv'; // Import dotenv
import { ChatOpenAI } from "@langchain/openai"; // Import only ChatOpenAI

dotenv.config(); // Load environment variables from .env file

const model = new ChatOpenAI({ apiKey: process.env.OPENAI_API_KEY }); // Pass the API key

async function askQuestion(question) {
    try {
        console.log(`Asking: ${question}`); // Debugging log

        const response = await model.call([{ role: 'user', content: question }]); // Format the message
        console.log("Raw Response:", response); // Log the raw response for debugging

        // Ensure to check the response structure
        if (response.generations && response.generations.length > 0) {
            const answer = response.generations[0][0].text; // Adjusted to the correct path
            console.log(`AI: ${answer}`);
        } else {
            console.log("No response generated.");
        }
    } catch (error) {
        console.error("Error:", error); // Log any errors that occur
    }
}

console.log("Hello! I'm your AI assistant. You can ask me anything.");
process.stdin.on('data', async (input) => {
    const question = input.toString().trim();
    await askQuestion(question);
});
