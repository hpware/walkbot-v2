import { SlashCommandBuilder } from "discord.js";

export default {
  data: new SlashCommandBuilder()
    .setName("hi")
    .setDescription("Replies with Hello!"),
  async execute(interaction) {
    await interaction.reply("Hello!");
  },
};
