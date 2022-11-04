import server from "../..";

import DB from "../../../DB";
import miniapp from "../../../VK/miniapp";

server.post("/dreamteam.get", async () => {
    const users = await DB.users.get();
    const usersInfo = await miniapp.getUsersInfo(users.map((user) => user.id));

    return users.map(user => {
        const info = usersInfo.find(x => x.id === user.id);
        return {
            ...info,
            ...user
        };
    });
});
