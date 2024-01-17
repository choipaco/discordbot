import axios from "axios"
import dotenv from 'dotenv';
dotenv.config();

const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${process.env.AI_TOKEN}`,
}

const model = "gpt-3.5-turbo"

export async function getChatgpt (messages:string){
    const answer = await axios.post(
        'https://api.openai.com/v1/chat/completions',
        {
            messages: [
                { role: "user", content: messages.toString() },
                { role: "assistant", content: "" },
            ],
            model
        },
        {
            headers
        }
    )

    return answer;

}