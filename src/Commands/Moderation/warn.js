import {
  SlashCommandBuilder,
  PermissionFlagsBits,
  EmbedBuilder,
} from "discord.js";
import { Warns } from "../../Database/Schemas/warningSchema.js";
import emojis from "../../emojis.json" assert { type: "json" };

export const Command = {
  data: new SlashCommandBuilder()
    .setName("newwarn")
    .setDescription("warn a user")
    .addSubcommand((subcommand) =>
      subcommand
        .setName("add")
        .setDescription("adds a warning")
        .addUserOption((option) =>
          option
            .setName("user")
            .setDescription("select a user")
            .setRequired(true)
        )
        .addStringOption((option) =>
          option
            .setName("reason")
            .setDescription("provide a reason")
            .setRequired(true)
        )
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("check")
        .setDescription("check the warnings")
        .addUserOption((option) =>
          option
            .setName("user")
            .setDescription("select a user")
            .setRequired(true)
        )
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("remove")
        .setDescription("remove a specific warning")
        .addUserOption((option) =>
          option
            .setName("user")
            .setDescription("select a user")
            .setRequired(true)
        )
        .addStringOption((option) =>
          option
            .setName("warnid")
            .setDescription("provide the warning ID")
            .setRequired(true)
        )
    ),
  options: {
    disabled: false,
    ownerOnly: false,
    permissions: [PermissionFlagsBits.MuteMembers],
  },
  /**
   * @param {Object} param
   * @param {import('discord.js').Client} param.client
   * @param {import("discord.js").CommandInteraction} param.int
   */
  run: async ({ client, int }) => {
    const SubCommand = int.options.getSubcommand();
    const User = int.options.getUser("user");
    const Reason = int.options.getString("reason");
    const WarnId = int.options.getString("warnid");

    function getTimestampInSeconds() {
      return Math.floor(Date.now() / 1000);
    }

    const characters =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    function generateString(length) {
      let result = "";
      const charactersLength = characters.length;
      for (let i = 0; i < length; i++) {
        result += characters.charAt(
          Math.floor(Math.random() * charactersLength)
        );
      }

      return result;
    }

    if (SubCommand === "add") {
      Warns.findOne(
        { Guild: int.guild.id, User: User.id, Tag: User.tag },
        async (err, data) => {
          if (err) throw err;
          if (!data) {
            data = new Warns({
              Guild: int.guild.id,
              User: User.id,
              Tag: User.tag,
              Warns: [
                {
                  Admin: int.user.tag,
                  Id: generateString(7),
                  Reason: Reason,
                  Date: new Date(int.createdTimestamp).toLocaleDateString(),
                  Time: getTimestampInSeconds(),
                },
              ],
            });
          } else {
            const object = {
              Admin: int.user.tag,
              Id: generateString(7),
              Reason: Reason,
              Date: new Date(int.createdTimestamp).toLocaleDateString(),
              Time: getTimestampInSeconds(),
            };
            data.Warns.push(object);
          }
          data.save();
        }
      );

      int.reply({
        embeds: [
          new EmbedBuilder()
            .setTitle(`\`\` Warned Member \`\``)
            .setColor("#2F3136")
            .addFields([
              {
                name: "Information:",
                value: `
                ${emojis.User} User: ${User.tag}
                ${emojis.Reason} Reason: ${Reason}
                `,
              },
            ])
            .setTimestamp()
            .setFooter({ text: `${int.user.tag}` }),
        ],
      });
    } else if (SubCommand === "check") {
      Warns.findOne(
        { Guild: int.guild.id, User: User.id, Tag: User.tag },
        async (err, data) => {
          if (err) throw err;
          if (data) {
            int.reply({
              embeds: [
                new EmbedBuilder()
                  .setTitle("`` Warning Check ``")
                  .setColor("#2F3136")
                  .addFields(
                    data.Warns.slice(0, 5).map((warn, order) => {
                      return {
                        name: `${order + 1} Warning`,
                        value: `
                      Admin: ${warn.Admin}
                      Id: ${warn.Id}
                      Reason: ${warn.Reason}
                      Date: ${warn.Date}
                      Time: <t:${warn.Time}:R>
                      `,
                        inline: false,
                      };
                    })
                  )
                  .setFooter({ text: "Only shows first 5 warnings" }),
              ],
            });
          } else {
            int.reply({
              embeds: [
                new EmbedBuilder()
                  .setColor("#2F3136")
                  .setDescription(`${User.tag} has no warnings.`),
              ],
            });
          }
        }
      );
    } else if (SubCommand === "remove") {
      Warns.findOneAndUpdate(
        { Guild: int.guild.id },
        { $pull: { Warns: { Id: WarnId } } },
        (err, data) => {
          if (err) {
            console.log(err);
          }
        }
      );
    }
  },
};
