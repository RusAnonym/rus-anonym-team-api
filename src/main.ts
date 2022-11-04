import DB from "./lib/DB";

import API from "./lib/API";

void (async function main (): Promise<void> {
    await DB.init();
    console.log("DB initialized");
    await API.listen({
        port: DB.config.server.port,
        host: "0.0.0.0"
    });
    console.log(`API started on port ${DB.config.server.port}`);
})();
