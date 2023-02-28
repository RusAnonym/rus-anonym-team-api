import DB from "./lib/DB";

import API from "./lib/API";
import "./lib/API/methods";

import "./tasks";

import Bot from "./lib/VK/Bot";

void (async function main (): Promise<void> {
    await DB.init();
    console.log("DB initialized");
    await Bot.init();
    console.log("VK polling started");
    await API.listen({
        port: DB.config.server.port,
        host: "0.0.0.0"
    });
    console.log(`API started on port ${DB.config.server.port}`);
})();
