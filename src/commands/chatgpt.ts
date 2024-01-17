import { ApplicationCommandOptionType } from "discord.js";
import { SlashCommand } from "../types/slashCommand";
import axios from "axios";
import dotenv from 'dotenv';
import { getChatgpt } from "../utils/api/chatgptApi";
dotenv.config();
// 마지막 API 호출 시간을 저장할 변수
let lastAPICallTime = 0;

export const chatgpt: SlashCommand = {
    name: "chat",
    description: "chat gpt 3.5 사용기능.",
    options: [
        {
            required: true,
            name: "질문",
            description: "질문 할 내용을 적습니다",
            type: ApplicationCommandOptionType.String,
        },
    ],
    execute: async (_, interaction) => {
        const echoMessage = interaction.options.get("질문")?.value || '';
        
        // 현재 시간을 가져와서 마지막 API 호출 이후로 얼마나 시간이 지났는지 계산
        const currentTime = Date.now();
        const timeSinceLastCall = currentTime - lastAPICallTime;

        // 최소 2초 간격으로만 API 호출이 이루어지도록 제어
        if (timeSinceLastCall < 2000) {
            await interaction.followUp({
                ephemeral: true,
                content: "API 호출 간격이 너무 짧습니다. 몇 초 기다려주세요.",
            });
            return;
        }

        try {
            const completion = await getChatgpt(echoMessage.toString());
            // API 호출 성공 시 마지막 호출 시간 갱신
            lastAPICallTime = Date.now();

            // 결과를 Discord에 출력
            await interaction.followUp({
                ephemeral: true,
                content: `${completion.data.choices[0].message.content}`,
            });
            
        } catch (error) {
            console.error(error);
            await interaction.followUp({
                ephemeral: true,
                content: "API 호출 중 오류가 발생했습니다.",
            });
        }
    },
};
