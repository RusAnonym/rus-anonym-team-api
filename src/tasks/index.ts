import { Interval } from "@rus-anonym/scheduler";
import { getRandomId } from "vk-io";
import Bot from "../lib/VK/Bot";
import miniapp from "../lib/VK/miniapp";

new Interval({
    cron: "*/15 * * * *",
    source: miniapp.resetCache.bind(miniapp),
});
