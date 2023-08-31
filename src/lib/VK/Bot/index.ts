import { Manager } from "@rus-anonym/commands-manager";
import { VK, getRandomId } from "vk-io";
import DB from "../../DB";
import chatgpt from "../../chatgpt";
import TextCommand from "./TextCommand";

class Bot {
    public readonly manager: Manager<TextCommand> = new Manager();

    public readonly group: VK = new VK({
        token: DB.config.vk.group.token,
        pollingGroupId: DB.config.vk.group.id,
        apiMode: "parallel"
    });

    public readonly admin: VK = new VK({
        token: DB.config.vk.admin.token,
        apiMode: "parallel"
    });

    public init(): Promise<void> {
        this.group.updates.on("wall_post_new", async (ctx) => {
            if (ctx.isRepost || ctx.wall.ownerId !== -DB.config.vk.group.id) {
                return;
            }

            if (ctx.wall.createdUserId !== DB.config.vk.ownerId && ctx.wall.signerId === undefined){
                await ctx.wall.loadAttachmentPayload();

                await this.admin.api.wall.edit({
                    post_id: ctx.wall.id,
                    owner_id: ctx.wall.ownerId,
                    signed: true,
                    message: ctx.wall.text,
                    attachments: ctx.wall.attachments.map(x => x.toString())
                });
            }

            if (!ctx.wall.text) {
                return;
            }

            const {
                data: {
                    choices: [{
                        message: tags
                    }]
                }
            } = await chatgpt.createChatCompletion({
                model: "gpt-3.5-turbo",
                messages: [
                    {
                        role: "system",
                        content: "Ты должен создавать теги к тексту в следующем формате #tag, необходимо от 3 до 10 тегов"
                    },
                    {
                        role: "user",
                        content: ctx.wall.text
                    }
                ]
            });

            await this.group.api.messages.send({
                chat_id: DB.config.vk.adminChatId,
                random_id: getRandomId(),
                message: `Предлагаемые теги:\n${tags?.content || ""}`,
                attachment: ctx.wall.toString()
            });
        });
        this.group.updates.on("message", console.log);
        return this.group.updates.start();
    }
}

export default new Bot();
