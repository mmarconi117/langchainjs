import { ChatOpenAI } from "@langchain/openai";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { StringOutputParser, CommaSeparatedListOutputParser } from '@langchain/core/output_parsers';
import { StructuredOutputParser } from 'langchain/output_parsers';
import { z } from 'zod';
import * as dotenv from 'dotenv';

dotenv.config();

const model = new ChatOpenAI({
    modelName: "gpt-3.5-turbo",
    temperature: 0.7,
});

// Function to generate a joke based on a provided word
async function callStringOutputParser() {
    const prompt = ChatPromptTemplate.fromMessages([
        ['system', 'Generate a joke based on a word provided by the user'],
        ["human", "{input}"],
    ]);

    const parser = new StringOutputParser();
    const chain = prompt.pipe(model).pipe(parser);

    return await chain.invoke({ input: 'dog' });
}

// Function to provide synonyms for a word
async function callListOutputParser() {
    const prompt = ChatPromptTemplate.fromTemplate(`
        Provide 5 synonyms, separated by commas, for the following {word}
    `);

    const outputParser = new CommaSeparatedListOutputParser();
    const chain = prompt.pipe(model).pipe(outputParser);

    return await chain.invoke({ word: 'happy' });
}

// Function to extract structured information from a phrase
async function callStructuredParser() {
    const prompt = ChatPromptTemplate.fromTemplate(`
        Extract information from the following phrase and return it in JSON format.
        Phrase: {phrase}.
    `);

    const outputParser = StructuredOutputParser.fromNamesAndDescriptions({
        name: "The name of the person",
        age: "The age of the person",
    });

    const chain = prompt.pipe(model).pipe(outputParser);
    return await chain.invoke({
        phrase: 'My name is Michael and I am 29 years old',
    });
}

// Function to extract structured information using Zod
async function callZodOutputParser() {
    const prompt = ChatPromptTemplate.fromTemplate(`
        Extract information from the following phrase and return it in JSON format.
        Phrase: {phrase}.
    `);

    const outputParser = StructuredOutputParser.fromZodSchema(
        z.object({
            recipe: z.string().describe('name of recipe'),
            ingredients: z.array(z.string().describe('Ingredients')),
        })
    );

    const chain = prompt.pipe(model).pipe(outputParser);
    return await chain.invoke({
        phrase: 'The ingredients for Spaghetti Bolognese recipe are tomatoes, minced beef, garlic, wine and herbs',
    });
}

// Uncomment to call different output parsers
// const response = await callStringOutputParser();
// const response = await callListOutputParser();
// const response = await callStructuredParser();
const response = await callZodOutputParser();
console.log(response);
