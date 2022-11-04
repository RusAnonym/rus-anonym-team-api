import { Interval } from "@rus-anonym/scheduler";
import miniapp from "../lib/VK/miniapp";

new Interval({
    cron: "*/15 * * * *",
    source: miniapp.resetCache.bind(miniapp),
});
