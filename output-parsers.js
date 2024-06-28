import { ChatOpenAI } from "@langchain/openai";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import {StringOutputParser, CommaSeparatedListOutputParser} from  '@langchain/core/output_parsers'


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
        Provideo 5 synonyms, seperated by commas, for the following {word}
    `);

    const outputParser = new CommaSeparatedListOutputParser();

    const chain = prompt.pipe(model).pipe(outputParser);
    return await chain.invoke({
        word: 'happy'
    })
}
const response = await callStringOutputParser()
console.log(response)
