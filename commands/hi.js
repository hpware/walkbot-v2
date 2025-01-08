import { SlashCommandBuilder } from "discord.js";

export const data = new SlashCommandBuilder()
  .setName("hi")
  .setDescription("Says Hello!");
export const execute = async (interaction) => {
  await interaction.reply("Hello!");
};
