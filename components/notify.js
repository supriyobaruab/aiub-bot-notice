const { EmbedBuilder } = require("discord.js");
require("dotenv").config();
const { client, startBot } = require("./bot");
const sendNotification = async (client, data) => {
  try {
    await startBot(process.env.TOKEN);
    const channel = await client.channels.fetch(process.env.CHANNEL_ID);

    if (!channel) {
      return console.log("Channel not found");
    }

    const embed = new EmbedBuilder()
      .setAuthor({
        name: "AIUB NOTICE BOARD",
        url: "https://www.aiub.edu",
      })
      .setTitle("📢 New Notice")
      .setDescription(`> ${data.title}`)
      .setURL(data.link)
      .setColor(0x5865f2)
      .addFields({
        name: "🔗 View Notice",
        value: `[Click Here](${data.link})`,
      })
      .setThumbnail(
        "https://www.aiub.edu/Files/Templates/AIUBv3/assets/images/aiub-logo-white-border.svg",
      )
      .setFooter({ text: "AIUB Notice System" })
      .setTimestamp();

    await channel.send({ embeds: [embed] });

    console.log("Notification sent");
  } catch (err) {
    console.error("Error:", err);
  }
};
// sendNotification(client);
module.exports = { sendNotification };
