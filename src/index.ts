import dotenv from 'dotenv';
dotenv.config();
import {Client, Interaction} from "discord.js";
import commands from "./commands"; // ./commands/index.ts에 있는 배열 가져오기


const client = new Client({
    intents:  []
});

const startBot = async () => {
  await client.login(process.env.BOT_TOKEN); //bot 토큰 로그인
  console.info("info: login success!")

  client.on("ready",async ()=>{
      if(client.application){
          await client.application.commands.set(commands); // commands에 있는것 등록
          console.log("info: command registered")
      }
  })

//핸들링 로직
  client.on("interactionCreate", async (interaction: Interaction) => {
      if (interaction.isCommand()) {
          const currentCommand = commands.find(({name}) => name === interaction.commandName); //등록한 명령어 찾기

          if(currentCommand){
              await interaction.deferReply();
              currentCommand.execute(client, interaction); // 실행
              console.log(`info: command ${currentCommand.name} handled correctly`)
          }
      }
  });

}

startBot();