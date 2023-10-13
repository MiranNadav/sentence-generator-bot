import { Telegraf } from 'telegraf';
import { message } from 'telegraf/filters';
import * as dotenv from 'dotenv'
import { CronJob } from 'cron';
import { getSentence } from './services/sentence-generator';
import axios from 'axios';

dotenv.config();

const bot = new Telegraf(process.env.BOT_TOKEN || '');
const chatIds : Array<number> = [235452433, 5715312983];
const commandsList = [
    { command: '/loveme', description: 'send me a love sentence now!'},
    { command: '/stop', description: 'stop sending me messages :('},
    { command: '/start', description: 'send me messages :)'}
]

bot.telegram.setMyCommands(commandsList)

bot.command('loveme', async (ctx) => {
    await ctx.telegram.sendMessage(ctx.message.chat.id, getSentence());
})

bot.command('start', async (ctx) => {
    const chatId = ctx.chat.id;
    if (!chatIds.includes(chatId)){
        chatIds.push(chatId);
    }
    console.log(chatIds);
    await ctx.telegram.sendMessage(ctx.message.chat.id, `Thanks for registering - stay tuned 😘`);
})

bot.command('stop', async (ctx) => {
    const chatId = ctx.chat.id;
    const index = chatIds.indexOf(chatId);
    if (index !== -1) {
        chatIds.splice(index, 1);
    }
    console.log(chatIds);
    await ctx.telegram.sendMessage(ctx.message.chat.id, `Stop sending you sentences 😔`);
})

const cronJob = new CronJob('0 8,19 * * *', async () => {
    try {
        const promises = [];
        for (const chatId of chatIds) {
            promises.push(axios.get(`https://api.telegram.org/bot${process.env.BOT_TOKEN}/sendMessage?chat_id=${chatId}&text=${getSentence()}`))
        }
        Promise.all(promises);
        console.log('sending message to all subscribers...');
    } catch (e) {
      console.error(e);
    }
  });

  // Start job
  if (!cronJob.running) {
    cronJob.start();
  }

bot.launch()