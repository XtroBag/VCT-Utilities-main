import { Schema, model } from "mongoose";

const GuildSchema = new Schema({
    guildID: { type: String },
    memberCount: { type: Number },
    ownerID: { type: String },
    createdTimestamp: { type: String },
    name: { type: String },
    icon: { type: String },
    banner: { type: String },
    region: { type: String }
    });
    


    // Reminder: Make a command to get info about a guild like their member count and etc.

export const Guild = model("Guilds", GuildSchema);