const { Client, GatewayIntentBits } = require("discord.js");
require("dotenv").config();
const client = new Client({
  intents: [GatewayIntentBits.Guilds],
});

const startBot = async (token) => {
  client.once("clientReady", () => {
    console.log(`🤖 Logged in as ${client.user.tag}`);
  });

  await client.login(token);
};

module.exports = { client, startBot };
