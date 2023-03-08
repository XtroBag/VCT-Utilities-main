import {
    SlashCommandBuilder,
    PermissionFlagsBits,
    EmbedBuilder,
  } from "discord.js";
  
  export const Command = {
    data: new SlashCommandBuilder()
      .setName("kick")
      .setDescription("kick a user from the server")
      .addUserOption((option) =>
        option
        .setName("user")
        .setDescription("The user to kick")
        .setRequired(true)
      )
      .addStringOption((option) =>
        option
          .setName("reason")
          .setDescription("The reason for the kick")
          .setRequired(true)
      ),
    options: {
      disabled: false,
      ownerOnly: false,
      permissions: [PermissionFlagsBits.BanMembers],
    },
    /**
     * @param {Object} param
     * @param {import('discord.js').Client} param.client
     * @param {import("discord.js").CommandInteraction} param.int
     */
    run: async ({ client, int }) => {
      const user = int.options.getMember("user");
      const reason = int.options.getString("reason");
  
      if (member.id === client.user.id) {
        return int.reply({
          content: "I cannot ban myself.",
          ephemeral: true,
        });
      }
  
      if (user.roles.highest.position >= int.member.roles.highest.position)
        return int.reply({
          content:
            "You cannot kick this user because they have a higher role than you.",
          ephemeral: true,
        });
  
      const embed = new EmbedBuilder()
        .setDescription(
          `**Kicked**: ${user.user.tag} [${user.id}]\n**Reason**: ${reason}`
        )
        .setColor("Purple");
  
      await int.reply({ embeds: [embed] });
      await user.kick({ reason: reason });
    },
  };
  