import { Manager } from "@rus-anonym/commands-manager";
import { VK } from "vk-io";
import DB from "../../DB";
import TextCommand from "./TextCommand";

class Bot {
    public readonly manager: Manager<TextCommand> = new Manager();

    public readonly instance: VK = new VK({
        token: DB.config.vk.group.token,
        pollingGroupId: DB.config.vk.group.id,
        apiMode: "parallel"
    });

    public init(): Promise<void> {
        return this.instance.updates.start();
    }
}

export default new Bot();
