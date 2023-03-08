import {
  SlashCommandBuilder,
  PermissionFlagsBits,
  EmbedBuilder,
  PermissionsBitField,
} from "discord.js";

export const Command = {
  data: new SlashCommandBuilder()
    .setName("ban")
    .setDescription("ban a user from the server")
    .addUserOption((option) =>
      option.setName("user").setDescription("The user to ban").setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName("reason")
        .setDescription("The reason for the ban")
        .setRequired(true)
    ),
  options: {
    disabled: false,
    ownerOnly: false,
    permissions: [PermissionsBitField.Flags.BanMembers],
  },
  /**
   * @param {Object} param
   * @param {import('discord.js').Client} param.client
   * @param {import("discord.js").CommandInteraction} param.int
   */
  run: async ({ client, int }) => {
    const user = int.options.getMember("user");
    const reason = int.options.getString("reason");

    if (user.id === client.user.id) {
      return int.reply({
        content: "I cannot ban myself.",
        ephemeral: true,
      });
    } 

    if (user.id === int.member.id) {
      return int.reply({
        content: "You cannot ban yourself.",
        ephemeral: true,
      });
    }

    if (user.roles.highest.position >= int.member.roles.highest.position)
      return int.reply({
        content: "You cannot ban this user they have a higher role then you.",
        ephemeral: true,
      });

    const embed = new EmbedBuilder()
      .setDescription(
        `**Banned**: ${user.user.tag}\n**ID**: ${user.id}\n**Reason**: ${reason}`
      )
      .setColor("Purple");

    await user.send(`You have been banned from ${int.guild.name} for ${reason}`).catch(err => {
      return;
    })

    await int.reply({ embeds: [embed] })
    await user.ban({ reason: `${user} has been banned by ${int.user.username} for ${reason}` });
  },
};
