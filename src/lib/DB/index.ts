import config from "../../DB/config";

import Cache from "./Cache";

class DB {
    public readonly config = config;
    public readonly cache = new Cache();
}

export default new DB();
