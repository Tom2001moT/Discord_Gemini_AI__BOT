const discord = require("discord.js");
const { GoogleGenerativeAI } = require("@google/generative-ai");
const DEV = `WDG`;

const MODEL = "gemini-pro"; //Don't change this VALUE
const API_KEY = "api_key"; // API KEY of Google Gemini pro ai
const BOT_TOKEN = "bot_token"; // Token of Discord Bot
const CHANNEL_IDS = ["channel_ID_1", "channel_ID_2"]; // Add your channel IDs here where you want chat with bot

const ai = new GoogleGenerativeAI(API_KEY);
const model = ai.getGenerativeModel({ model: MODEL });

const client = new discord.Client({
    intents: Object.keys(discord.GatewayIntentBits),
});

client.on("ready", () => {
    console.log(` ❤️ ${DEV} ❤️ `);
    console.log(`Logged in as 🤖 ${client.user.tag} 🤖`);
});

client.login(BOT_TOKEN);

client.on("messageCreate", async (message) => {
    try {
        if (message.author.bot) return;
        if (!CHANNEL_IDS.includes(message.channel.id)) return; // Check if the channel ID is in the array

        const { response } = await model.generateContent(message.cleanContent);
        const generatedText = response.candidates[0]?.content.parts.map(part => part.text).join('');

        if (generatedText) {
            console.log("Reply Content:", generatedText);

            // Split the generated content into chunks of 2000 characters
            const chunks = splitTextIntoChunks(generatedText);
            
            // Send each chunk as a separate message
            for (const chunk of chunks) {
                await message.reply({
                    content: chunk,
                });
            }
        } else {
            console.log("No generated text found.");
        }
    } catch (e) {
        console.error("Error:", e);
    }
});

function splitTextIntoChunks(text, chunkSize = 2000) {
    const chunks = [];
    for (let i = 0; i < text.length; i += chunkSize) {
        chunks.push(text.slice(i, i + chunkSize));
    }
    return chunks;
}
