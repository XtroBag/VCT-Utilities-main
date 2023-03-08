import { Events } from "discord.js";
import chalk from "chalk";

export const Event = {
  name: Events.ClientReady,
  once: true,
 async execute(client) {
    console.log(chalk.green(`Ready!`), chalk.white(`Logged in as ${client.user.tag}`));

  },
};
