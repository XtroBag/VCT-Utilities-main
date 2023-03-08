import mongo from "mongoose";

export async function DatabaseConnect(uri) {
        try {
            await mongo.connect(uri)
        } catch (e) {
            console.error(e)
        }
    }