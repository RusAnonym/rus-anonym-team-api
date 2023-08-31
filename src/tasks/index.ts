import { Interval } from "@rus-anonym/scheduler";
import { getRandomId } from "vk-io";
import Bot from "../lib/VK/Bot";
import miniapp from "../lib/VK/miniapp";

new Interval({
    cron: "*/15 * * * *",
    source: miniapp.resetCache.bind(miniapp),
});

new Interval({
    cron: "0 4,11,17,23 * * *",
    source: (): Promise<unknown> => {
        const currentHour = new Date().getHours();

        let message = "";

        if (currentHour > 4 && currentHour < 11) {
            message = "всем доброе утро друзья коллеги 😙😙😙";
        } else if (currentHour >= 11 && currentHour < 17) {
            message = "всем добрый день друзья коллеги 😙😙😙";
        } else if (currentHour >= 17 && currentHour < 23) {
            message = "всем добрый вечер друзья коллеги 😙😙😙";
        } else if (currentHour >= 23 || currentHour <= 4) {
            message = "всем доброй ночи друзья коллеги 😙😙😙";
        }

        return Bot.group.api.messages.send({
            peer_id: 2e9 + 7,
            message,
            random_id: getRandomId()
        });
    }
});
