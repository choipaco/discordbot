import { ActionRowBuilder, ApplicationCommandOptionType, ButtonBuilder, ButtonStyle, ComponentType } from "discord.js";
import { SlashCommand } from "../types/slashCommand";
import { EmbedBuilder } from "discord.js";
import dotenv from 'dotenv';
import { timeAgo } from "../utils/dateUtils";
import { getNews } from "../utils/api/newsApi";
import { newsReplace } from "../utils/newsReplace";
dotenv.config();

interface Items {
  title: string;
  originallink: string;
  link: string;
  description: string;
  pubDate: string;
}

export const news: SlashCommand = {
  name: "news",
  description: "naver news 검색기능",
  options: [
    {
      required: true,
      name: "검색",
      description: "검색 할 내용을 적습니다",
      type: ApplicationCommandOptionType.String,
    },
  ],
  execute: async (_, interaction) => {
    const titleMessage = interaction.options.get("검색")?.value || '';
    let currentPage = 1;
    try {
      const completion = await getNews(titleMessage.toString(),1); //api 가져오기

      const res: Items[] = completion.data.items;

      const prev = new ButtonBuilder()
        .setCustomId('-')
        .setLabel('prev')
        .setStyle(ButtonStyle.Danger);

      const next = new ButtonBuilder()
        .setCustomId('+')
        .setLabel('next')
        .setStyle(ButtonStyle.Success);

      const row: ActionRowBuilder<ButtonBuilder> = new ActionRowBuilder();

      const embed = new EmbedBuilder()
        .setTitle(`"${titleMessage}"에 대한 검색결과`)
        .setDescription(res.map((item, idx) => {
          const title = newsReplace(item.title);
          const time = timeAgo(new Date(item.pubDate));
          return `${idx + 1}.  [${title}](${item.originallink})\n   ${time}`;
        }).join('\n'));

      const response = await interaction.editReply({
        embeds: [embed],
        components: [row.addComponents(prev, next)]
      });

      // 버튼 클릭 이벤트
      const collector = await response.createMessageComponentCollector({
        componentType: ComponentType.Button,
        time: 600000,
      });

      collector.on('collect', async i =>{
        if (i.customId === '-') {
        currentPage = Math.max(currentPage - 1, 1);
        } else if (i.customId === '+') {
        currentPage++;
        }

        const newCompletion = await getNews(titleMessage.toString(),currentPage);
        const newRes: Items[] = newCompletion.data.items;
  
        embed.setTitle(`"${titleMessage}"에 대한 검색결과 - 페이지 ${currentPage}`)
        .setDescription(newRes.map((item, idx) => {
          const title = newsReplace(item.title);
          const time = timeAgo(new Date(item.pubDate));
          return `${idx + 1}.  [${title}](${item.originallink})\n   ${time}`;
        }).join('\n'));
    
        await i.update({
        embeds: [embed],
        components: [row]
        });
      })
    } catch (error) {
      console.error(error);
      await interaction.reply({
        ephemeral: true,
        content: "API 호출 중 오류가 발생했습니다.",
      });
    }
  },
};