import { Manager } from "@rus-anonym/commands-manager";
import { VK, getRandomId } from "vk-io";
import DB from "../../DB";
import chatgpt from "../../chatgpt";
import TextCommand from "./TextCommand";

class Bot {
    public readonly manager: Manager<TextCommand> = new Manager();

    public readonly instance: VK = new VK({
        token: DB.config.vk.group.token,
        pollingGroupId: DB.config.vk.group.id,
        apiMode: "parallel"
    });

    public init(): Promise<void> {
        this.instance.updates.on("wall_post_new", async (ctx) => {
            if (ctx.isRepost || ctx.wall.ownerId !== -DB.config.vk.group.id || !ctx.wall.text) {
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

            await this.instance.api.messages.send({
                chat_id: DB.config.vk.adminChatId,
                random_id: getRandomId(),
                message: `Предлагаемые теги:\n${tags?.content || ""}`,
                attachment: ctx.wall.toString()
            });
        });
        return this.instance.updates.start();
    }
}

export default new Bot();
