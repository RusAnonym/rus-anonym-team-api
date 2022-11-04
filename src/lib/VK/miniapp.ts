import { API } from "vk-io";

import DB from "../DB";

class Miniapp {
    public readonly api: API;

    constructor() {
        this.api = new API({
            token: DB.config.vk.miniapp.token,
            apiMode: "parallel",
        });
    }
}

export default new Miniapp();
