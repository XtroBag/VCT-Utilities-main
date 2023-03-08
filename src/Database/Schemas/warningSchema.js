import { Schema, model } from "mongoose";

const WarningSchema = new Schema({
    Guild: { type: Object }, // add name + id + maybe something else
    User: { type: String }, // add just the trouble makers id
    Tag: { type: String }, // add just the trouble makers tag
    Warns: { type: Array } // add just the trouble makers warns in an object each with data
    });

export const Warns = model("Warns", WarningSchema);