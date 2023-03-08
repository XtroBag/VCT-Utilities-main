import { EmbedBuilder, Events } from "discord.js";
import { Guild } from "../Database/Schemas/guildSchema.js";
export const Event = {
  name: Events.GuildCreate,
  once: true,
  async execute(guild, client) {
    Guild.findOne({ guildID: guild.id }, async (err, data) => {
      if (err) throw err;
      if (!data) {
        await new Guild({
          guildID: guild.id,
          memberCount: guild.memberCount,
          ownerID: guild.ownerId,
          createdTimestamp: guild.createdTimestamp,
          name: guild.name,
          icon: guild.iconURL() ?? 'None present',
          banner: guild.bannerURL() ?? 'None present',
          region: guild.region,
        }).save();
      }
    });

   
  },
};
