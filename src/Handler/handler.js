// import fs from "fs";
import { join } from "node:path";
import { readdir } from "node:fs/promises";
import { REST, Routes } from "discord.js";
import config from "../config.json" assert { type: "json" };
import chalk from "chalk";

export async function CommandHandler(client) {
  const CommandArray = [];
  const CommandFolders = await readdir(join("./src/Commands"));
  for (const folders of CommandFolders) {
    const folder = (await readdir(join(`./src/Commands/${folders}`))).filter(
      (file) => file.endsWith(".js")
    );

    for (const files of folder) {
      const cmd = await import(`../Commands/${folders}/${files}`);
      client.commands.set(cmd.Command.data.name, cmd);
      CommandArray.push(cmd.Command.data.toJSON());
    }
  }

  const rest = new REST({ version: "10" }).setToken(config.token);

  (async () => {
    try {
      console.log(
        chalk.yellow(`Started`),
        chalk.white(
          `refreshing`, chalk.yellowBright(`${CommandArray.length}`), chalk.white(`application (/) commands.`)
        )
      );

      // The put method is used to fully refresh all commands in the guild with the current set
      const data = await rest.put(Routes.applicationCommands(config.clientID), {
        body: CommandArray,
      });

      console.log(
        chalk.green(`Successfully`),
        chalk.white(`reloaded`), chalk.greenBright(`${data.length}`), chalk.white(`application (/) commands.`)
      );
    } catch (error) {
      // And of course, make sure you catch and log any errors!
      console.error(error);
    }
  })();
}

export async function EventHandler(client) {
  const EventFiles = await readdir(join("./src/Events"));
  for (const file of EventFiles) {
    const event = await import(`../Events/${file}`);
    if (event.once) {
      client.once(event.Event.name, (...args) =>
        event.Event.execute(...args, client)
      );
    } else {
      client.on(event.Event.name, (...args) =>
        event.Event.execute(...args, client)
      );
    }
  }
}
