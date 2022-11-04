import mongoose from "mongoose";

import config from "../../DB/config";

import Cache from "./Cache";
import UsersCollection from "./collections/users";

class DB {
    public readonly config = config;
    public readonly cache = new Cache();
    public readonly connection: mongoose.Connection;


    public readonly users: UsersCollection;

    constructor() {
        this.connection = mongoose.createConnection(
            `${this.config.db.protocol}://${this.config.db.login}:${this.config.db.password}@${this.config.db.address}/`,
            {
                autoCreate: true,
                autoIndex: true,
                dbName: "API",
            }
        );
        this.users = new UsersCollection(this);
    }

    public async init(): Promise<void> {
        await this.connection.asPromise();
    }
}

export type { DB };

export default new DB();
