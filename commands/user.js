import { SlashCommandBuilder } from "discord.js";

export const data = new SlashCommandBuilder()
  .setName("user")
  .setDescription("Replies with user info!");

export const execute = async (interaction) => {
  await interaction.reply(
    `Your tag: ${interaction.user.tag}\nYour ID: ${interaction.user.id}`,
  );
};
