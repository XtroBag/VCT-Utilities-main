import {
  SlashCommandBuilder,
  EmbedBuilder,
  ButtonStyle,
  ActionRowBuilder,
  ButtonBuilder,
  ActivityType,
  codeBlock,
} from "discord.js";
import emojis from "../../emojis.json" assert { type: "json" };

export const Command = {
  data: new SlashCommandBuilder()
    .setName("user")
    .setDescription("Check a users profile")
    .addUserOption((option) =>
      option
        .setName("user")
        .setDescription("The selected user to check")
        .setRequired(true)
    ),
  options: {
    disabled: false,
    ownerOnly: false,
    permissions: [],
  },
  /**
   * @param {Object} param
   * @param {import('discord.js').Client} param.client
   * @param {import("discord.js").CommandInteraction} param.int
   */
  run: async ({ client, int }) => {
    // User
    // > Gets the user from the interaction
    const member = int.options.getMember("user");

    const usererror = new EmbedBuilder()
      .setDescription("Please provide a valid user in this server!")
      .setColor("#2F3136");
    if (!member) return int.reply({ embeds: [usererror], ephemeral: true });

    const boterror = new EmbedBuilder()
      .setDescription("Please don't try to check a bot's profile!")
      .setColor("#2F3136");
    if (member.user.bot)
      return int.reply({ embeds: [boterror], ephemeral: true });

    // Badges
    // > Gets the users profile badges and converts them onto an embed
    const badges = [];
    const UserFlags = (await member.user.fetchFlags(true)).toArray();

    if (UserFlags.length === 0) {
      badges.push(`No badges`);
    }

    for (const flag of UserFlags) {
      switch (flag) {
        case "HypeSquadOnlineHouse1": // Bravery
          badges.push("<:HypesquadBravery:1054162269749125160>");
          break;
        case "HypeSquadOnlineHouse2": // Brilliance
          badges.push("<:HypesquadBrilliance:1054162348224557166>");
          break;
        case "HypeSquadOnlineHouse3": // Balance
          badges.push("<:HypesquadBalance:1054162268620869703>");
          break;
        case "VerifiedDeveloper": // Verified Developer
          badges.push("<:VerifiedDeveloper:1054162267337404466>");
          break;
        case "PremiumEarlySupporter": // Early Supporter
          badges.push("<:EarlySupporter:1054162266439823461>");
          break;
        case "Hypesquad": // Hype Squad
          badges.push("<:HypeSquadEvents:1054162416721731664>");
          break;
        case "BugHunterLevel1": // Bug Hunter [1]
          badges.push("<:BugHunter1:1054162263235379301>");
          break;
        case "BugHunterLevel2": // Bug Hunter [2]
          badges.push("<:BugHunter2:1054162264321704116>");
          break;
        case "CertifiedModerator": // Certified Moderator
          badges.push("<:CertifiedModerator:1054162265542230068>");
          break;
        case "Partner": // Partner
          badges.push("<:PartneredServer:1054162574817624084>");
          break;
        case "Staff": // Discord Staff
          badges.push("<:DiscordStaff:1054162480538067075>");
          break;
        case "ActiveDeveloper": // Active Developer
          badges.push("<:ActiveDeveloper:1054162262300053608>");
          break;
      }
    }

    // Activity
    // > Gets the users activity and converts it onto an embed
    const customStatus = member.presence?.activities.find(
      (activity) => activity.name === "Custom Status"
    );
    const activityStatus = customStatus ? customStatus?.state : "None";

    // Status
    // > Gets the users status and converts it onto an embed
    let status = {
      online: "Online",
      idle: "Idle",
      dnd: "Do Not Disturb",
      offline: "Invisible",
    };

    let mode = {
      online: emojis.Online,
      idle: emojis.Idle,
      dnd: emojis.Dnd,
      offline: emojis.Invisible,
    };

    let banner;
    if (member.user?.bannerURL()) {
      banner = `[Click Here](${member.user?.bannerURL()})`;
    } else {
      banner = "None";
    }

    let boosting;
    if (member.premiumSinceTimestamp) {
      boosting = `<t:${parseInt(member.premiumSinceTimestamp / 1000)}:R>`;
    } else {
      boosting = "None";
    }

    let communication;
    if (member.isCommunicationDisabled()) {
      communication = "Disabled";
    } else {
      communication = "Enabled";
    }

    let incall;
    if (member.voice.channel) {
      incall = "Yes";
    } else {
      incall = "None";
    }

    let memberActivities = member.presence?.activities.filter(
      (item) => item.name === "YouTube" || item.name === "Twitch"
    );

    // Embed
    // > Creates the embed for the user profile
    const embed = new EmbedBuilder()
      .addFields(
        {
          name: `Who is ${member.user.username}?`,
          inline: true,
          value: `${emojis.Blank}${emojis.Blank}
<:Name:1069370477337903175> Name: \`\` ${member.user.username} \`\`
           ▸ <:Tag:1069384742111281212> **Tag:** #${member.user.discriminator}
           ▸ <:ID:1069383758928695356> **ID:** ${member.user.id}
           <:Badges:1069373687112941628> Badges: ${badges.join(" ")}
                  <:Status:1069372483158954064> Status: ${activityStatus}
                  <:Mode:1069373810584854529> Mode: ${
                    mode[member.presence?.status ?? "offline"]
                  } ${status[member.presence?.status ?? "offline"]}
                  <:Streaming:1069388045498994778> Streaming: ${
                    memberActivities?.length > 0
                      ? memberActivities.map((activity) => {
                          if (activity.type === ActivityType.Streaming) {
                            return `\`\`Online\`\` <:StreamingIcon:1054524086560235520>`;
                          }
                        })
                      : "Offline"
                  }
                  <:Banner:1069374333174153306> Banner: ${banner}
                  <:Created:1069373119757832282> Created: <t:${parseInt(
                    member.user.createdTimestamp / 1000
                  )}:R>
                 `,
        },

        {
          name: "Server Information:",
          value: `
          <:Crown:1069371696525623326> Owner: ${
            member.guild.ownerId === member.id ? "Yes" : "No"
          }
          <:NickName:1069372079511699516> Nickname: ${member.nickname ?? `None`}
          <:Highest:1069394134038753290> Highest Role: ${member.roles.highest}
          <:Roles:1069710402524565514> Role Size: ${
            member.roles.cache.size - 1 ? member.roles.cache.size - 1 : "None"
          }
          <:RoleColor:1069371153459716176> Role Color: ${member.displayHexColor}
          <:Joined:1069378282123968543> Joined: <t:${parseInt(
            member.joinedTimestamp / 1000
          )}:R>
          <:Boosting:1069378920039850124> Boosting: ${boosting}
          <:Communication:1069382001611776070> Communication: ${communication} 
          <:Call:1069392815718678669> Active Call: ${incall}

                 `,
        }
      )
      .setColor("#2F3136")
      .setThumbnail(member.user.avatarURL());

    const row = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId("roles")
        .setLabel("Roles")
        .setStyle(ButtonStyle.Danger),
      new ButtonBuilder()
        .setCustomId("presence")
        .setLabel("Presence")
        .setStyle(ButtonStyle.Success)
    );

    const msg = await int.reply({
      embeds: [embed],
      components: [row],
      ephemeral: false,
    });

    const collector = msg.createMessageComponentCollector({ time: 60000 }); // 1 minute

    collector.on("collect", async (interaction) => {
      if (interaction.isButton()) {
        if (interaction.user.id === int.user.id) {
          if (interaction.customId === "roles") {
            await interaction.update({
              components: [row],
              embeds: [
                new EmbedBuilder()
                  .setDescription(
                    member.roles.cache
                      .toJSON()
                      .filter((role) => role.id !== int.guild.id).length === 0
                      ? codeBlock("diff", "- No roles for this user -")
                      : member.roles.cache
                          .toJSON()
                          .filter((role) => role.id !== int.guild.id)
                          .sort((a, b) => b.position - a.position)
                          .slice(0, 3 * 4)
                          .map((val, idx) => {
                            return `${val}${(idx + 1) % 3 === 0 ? "\n" : ""}`;
                          })
                          .join(" ")
                          .split("\n")
                          .join("\n")
                          .concat(
                            member.roles.cache.toJSON().length <= 10 // need to fix this to stop listing more roles when it hits the max limit i set
                              ? ""
                              : codeBlock("yaml", "To many roles to display")
                          )
                  )
                  .setColor("#2F3136"),
              ],
            });
          }
          if (interaction.customId === "presence") {
            await interaction.update({
              components: [row],
              embeds: [
                new EmbedBuilder()
                  .setDescription("Presence list")
                  .setDescription(
                    codeBlock(
                      "fix",
                      `${
                        member.presence?.activities
                          .filter((item) => item.name != "Custom Status")
                          .map((activity) => `${activity.name}`)
                          .join("\n") || "No activities"
                      }`
                    )
                  )
                  .setColor("#2F3136"),
              ],
            });
          }
        } else {
          interaction.reply({
            content: "These buttons are not for you!",
            ephemeral: true,
          });
        }

        // collector.on("end", async () => {
        //   const updated = new EmbedBuilder()
        //     .setDescription("This embed has expired")
        //     .setColor("#2F3136");
        //   const deletenow = await interaction.editReply({
        //     embeds: [updated],
        //     components: [],
        //   });

        //   setTimeout(async () => {
        //     // deletes the last message after 30 seconds
        //     await deletenow?.delete();
        //   }, 20000);
        // });
      }
    });
  },
};
