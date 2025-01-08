//Imports
import dotenv from "dotenv";
import { Client, Events, GatewayIntentBits, Collection } from "discord.js";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
//.env
dotenv.config();
const { DISCORD_TOKEN, CLIENT_ID } = process.env;
//DiscordJS
const client = new Client({ intents: [GatewayIntentBits.Guilds] });
client.once(Events.ClientReady, (readyClient) => {
  console.log(`Ready! Logged in as ${readyClient.user.tag}`);
});
//Commands
client.commands = new Collection();
(async () => {
  const folderpath = path.join(__dirname + "/commands/");
  const commandf = fs.readdirSync(folderpath);
  for (const folder of commandf) {
    const commandpath = path.join(folderpath + folder);
    if (fs.statSync(commandpath).isDirectory()) {
      const commandf = fs
        .readdirSync(commandpath)
        .filter((file) => file.endsWith(".js"));
    }
    for (const file of commandf) {
      const fpath = path.join(commandpath);
      console.log(`Processing file: ${fpath}`);
      const command = await import(fpath);
      if ("data" in command && "execute" in command) {
        client.commands.set(command.data.name, command);
      } else {
        console.warn(
          `[WARNING] ${file} is missing a required "data" or "execute" property.`,
        );
      }
    }
  }
  client.on(Event.InteractionCreate, async (interaction) => {
    if (!interaction.isChatInputCommand()) return;
    console.log(interaction);
  });
  client.login(DISCORD_TOKEN);
})();
