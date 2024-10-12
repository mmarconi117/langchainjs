import { ChatOpenAI } from "@langchain/openai";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import {StringOutputParser, CommaSeparatedListOutputParser} from  '@langchain/core/output_parsers'
import {StructuredOutputParser} from 'langchain/output_parsers'
import {z} from 'zod'


import * as dotenv from 'dotenv'
dotenv.config();

const model = new ChatOpenAI({
    modelName: "gpt-3.5-turbo",
    temperature: 0.7,
});

async function callStringOutputParser(){

const prompt = ChatPromptTemplate.fromMessages([
    ['system', 'Generate a joke based on a word provided by the user'],
    ["human", "{input}"],
]);

const parser = new StringOutputParser();

const chain = prompt.pipe(model).pipe(parser);

return await chain.invoke({
    input: 'dog'
})
}
async function callListOutputParser(){
    const prompt = ChatPromptTemplate.fromTemplate(`
        Provide 5 synonyms, seperated by commas, for the following {word}
    `);

    const outputParser = new CommaSeparatedListOutputParser();

    const chain = prompt.pipe(model).pipe(outputParser);
    return await chain.invoke({
        word: 'happy'
    })
}


//structured output parser

async function callStructuredParser(){
    const prompt = ChatPromptTemplate.fromTemplate(`
        Extract information from the following phrase.
        Formatting Instructions: {format_instructions}
        Phrase: {phrase}.
    `);

    const outputParser = StructuredOutputParser.fromNamesAndDescriptions({
        name: "The name of the person",
        age: "The age of the person",
    })

    const chain = prompt.pipe(model).pipe(outputParser);
    return await chain.invoke({
        phrase: 'My name is Michael and I am 29 years old',
        format_instructions: outputParser.getFormatInstructions(),
    })
}

async function callZodOutputParser(){
    const prompt = ChatPromptTemplate.fromTemplate(`
        Extract information from the following phrase.
        Formatting Instructions: {format_instructions}
        Phrase: {phrase}.
    `);

    const outputParser = StructuredOutputParser.fromZodSchema(
        z.object({
            recipe: z.string().describe('name of recipe'),
            ingredients: z.array(z.string().describe('Ingredients'))
        })
    );

    const chain = prompt.pipe(model).pipe(outputParser);
    return await chain.invoke({
        phrase: 'The ingredients for Spaghetti Bolognese recipe are tomatoes, minced beef, garlic, wine and herbs',
        format_instructions: outputParser.getFormatInstructions(),
    })
}

// const response = await callStringOutputParser()
// const response = await callListOutputParser()
// const response = await callStructuredParser()

const response = await callZodOutputParser()
console.log(response)
