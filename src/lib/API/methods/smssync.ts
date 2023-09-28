import { Type } from "@sinclair/typebox";
import { stripIndents } from "common-tags";
import moment from "moment";
import { getRandomId } from "vk-io";
import server from "..";
import DB from "../../DB";
import Bot from "../../VK/Bot";

server.post(
    "/smssync",
    {
        schema: {
            body: Type.Object({
                secret: Type.Optional(Type.String()),
                from: Type.Optional(Type.String()),
                message: Type.Optional(Type.String()),
                sent_timestamp: Type.Optional(Type.String()),
                sent_to: Type.Optional(Type.String()),
                message_id: Type.Optional(Type.String()),
                device_id: Type.Optional(Type.String())
            })
        }
    },
    async (req) => {
        if (req.body.secret !== DB.config.smssync.secret) {
            return {
                isSmsSync: true,
                payload: {
                    success: false,
                    error: "Unknown secret key"
                }
            };
        }

        if (
            "sent_timestamp" in req.body &&
            "from" in req.body &&
            "message" in req.body
        ) {
            await Bot.group.api.messages.send({
                message: stripIndents(`
            SMS ${moment(Number(req.body.sent_timestamp)).format(
                "DD.MM.YYYY, HH:mm:ss"
            )}:
            Sender: ${req.body.from}
            Text: ${req.body.message}
        `),
                chat_id: DB.config.smssync.chatId,
                random_id: getRandomId()
            });
        }

        return {
            isSmsSync: true,
            payload: {
                success: true,
                error: null
            }
        };
    }
);
