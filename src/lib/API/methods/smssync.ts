import { Type } from "@sinclair/typebox";
import { stripIndents } from "common-tags";
import moment from "moment";
import { getRandomId } from "vk-io";
import server from "..";
import DB from "../../DB";
import Bot from "../../VK/Bot";

server.post("/smssync", {
    schema: {
        body: Type.Object({
            secret: Type.String(),
            from: Type.String(),
            message: Type.String(),
            sent_timestamp: Type.String(),
            sent_to: Type.String(),
            message_id: Type.String(),
            device_id: Type.String()
        })
    },
}, async (req) => {
    if (req.body.secret !== DB.config.smssync.secret) {
        return {
            isSmsSync: true,
            payload: {
                success: false,
                error: "Unknown secret key"
            }
        };
    }

    await Bot.instance.api.messages.send({
        message: stripIndents(`
            SMS ${moment(Number(req.body.sent_timestamp)).format("DD.MM.YYYY, HH:mm:ss")}:
            Sender: ${req.body.from}
            Text: ${req.body.message}
        `),
        chat_id: DB.config.smssync.chatId,
        random_id: getRandomId()
    });

    return {
        isSmsSync: true,
        payload: {
            success: true,
            error: null
        }
    };
});
