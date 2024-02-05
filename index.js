const discord = require("discord.js");
const { GoogleGenerativeAI } = require("@google/generative-ai");

const MODEL = "gemini-pro";
const API_KEY = "AIzaSyCOl8MQBYULgSkiXENppEcOw6do8nFKU4k";
const BOT_TOKEN = "MTIwNDA4NTU2NTEyMTYyNjEzMg.GGbjvf.bLX5czodTgo147Qx8GQQiEnG06t-LMFYTMtZ04";
const CHANNEL_IDS = ["983429741178658826", "1204098265906159646"]; // Add your additional channel IDs here

const ai = new GoogleGenerativeAI(API_KEY);
const model = ai.getGenerativeModel({ model: MODEL });

const client = new discord.Client({
    intents: Object.keys(discord.GatewayIntentBits),
});

client.on("ready", () => {
    console.log(`Logged in as ${client.user.tag}`);
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
