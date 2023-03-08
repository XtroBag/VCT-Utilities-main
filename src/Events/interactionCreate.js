import { AttachmentBuilder, EmbedBuilder, Events } from "discord.js";
import config from "../config.json" assert { type: "json" };

export const Event = {
  name: Events.InteractionCreate,
  once: false,
  async execute(int, client) {
    if (!int.isCommand()) return;

    

    const command = int.client.commands.get(int.commandName);

    // ======================Disabled======================
    if (command.Command.options.disabled === true) {
      return int.reply({
        embeds: [new EmbedBuilder()
          .setTitle(`Command Disabled`)
          .setDescription(`This command is currently disabled.`)
          .setColor("#2F3136")], ephemeral: true
      });
    } else {
      // ======================Owner Only======================
      if (command.Command.options.ownerOnly === true) {
        if (int.member.id !== config.ownerID) {
          return int.reply({
            content: `Only the owner of the bot can use this command.`,
            ephemeral: true,
          });
        }
      }

      //======================Doesnt exist======================
      if (!command) {
        console.error(`No command matching ${int.commandName} was found.`);
        return;
      }

      // ======================Permissions======================

      const commandinfo = command.Command.options

      if (commandinfo.permissions && commandinfo.permissions.length > 0) {
        if (!int.member.permissions.has(command.Command.options.permissions)) return int.reply({ content: 'You do not have permission to run this command' })
      }

      // ======================Run Command======================
      try {
        await command.Command.run({ client, int });
      } catch (error) {
        console.error(`Error executing ${int.commandName}`);
        console.error(error);
      }
    }
  },
};
