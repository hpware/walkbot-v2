// Imports
import dotenv from "dotenv";
import {
  Client,
  Events,
  GatewayIntentBits,
  Collection,
  REST,
  Routes,
} from "discord.js";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// .env
dotenv.config();
const { DISCORD_TOKEN, CLIENT_ID } = process.env;

// DiscordJS Client Setup
const client = new Client({ intents: [GatewayIntentBits.Guilds] });
client.commands = new Collection();

// Commands Loader and Deployment
(async () => {
  const commands = [];
  const folderPath = path.join(__dirname, "commands");
  const commandFiles = fs.readdirSync(folderPath);

  for (const file of commandFiles) {
    const filePath = path.join(folderPath, file);
    if (file.endsWith(".js")) {
      const command = await import(`file://${filePath}`);
      if (command.data && command.execute) {
        client.commands.set(command.data.name, command);
        commands.push(command.data.toJSON());
      } else {
        console.warn(
          `[WARNING] ${file} is missing "data" or "execute" properties.`,
        );
      }
    }
  }

  // Deploy commands to Discord
  const rest = new REST({ version: "10" }).setToken(DISCORD_TOKEN);
  try {
    console.log("Started refreshing application (/) commands.");
    await rest.put(Routes.applicationCommands(CLIENT_ID), { body: commands });
    console.log("Successfully reloaded application (/) commands.");
  } catch (error) {
    console.error(error);
  }

  // Event Handling
  client.once(Events.ClientReady, (readyClient) => {
    console.log(`Ready! Logged in as ${readyClient.user.tag}`);
  });

  client.on(Events.InteractionCreate, async (interaction) => {
    if (!interaction.isChatInputCommand()) return;

    const command = client.commands.get(interaction.commandName);
    if (!command) {
      console.error(
        `No command matching ${interaction.commandName} was found.`,
      );
      return;
    }

    try {
      await command.execute(interaction);
    } catch (error) {
      console.error(error);
      await interaction.reply({
        content: "There was an error executing this command!",
        ephemeral: true,
      });
    }
  });

  // Login to Discord
  client.login(DISCORD_TOKEN);
})();
