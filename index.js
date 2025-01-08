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
  const commandFolders = fs.readdirSync(folderpath);
  for (const folder of commandFolders) {
    const commandpath = path.join(folderpath + folder);
    const commandf = fs
      .readdirSync(commandpath)
      .filter((file) => file.endsWith(".js"));
    for (const file of commandf) {
      const fpath = path.join(commandpath + file);
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

  client.login(DISCORD_TOKEN);
})();
