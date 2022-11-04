import config from "./DB/config";

import API from "./lib/API";

void (async function main (): Promise<void> {
    await API.listen({
        port: config.server.port,
        host: "0.0.0.0"
    });
    console.log(`API started on port ${config.server.port}`);
})();
