import axios from "axios"
import dotenv from 'dotenv';
dotenv.config();

const headers = {
    'Content-Type': 'application/json',
    'X-Naver-Client-Id': `${process.env.NAVER_CLIENT_ID}`,
    'X-Naver-Client-Secret': `${process.env.NAVER_CLIENT_SECRET}`
}

const model = "gpt-3.5-turbo"

export async function getNews (messages:string, pages:number){
    const answer = await axios.get(
        `https://openapi.naver.com/v1/search/news.json?query=${messages}&display=10&start=${(pages - 1) * 10 + 1}&sort=sim`,
        {
            headers
        }
    )

    return answer;

}