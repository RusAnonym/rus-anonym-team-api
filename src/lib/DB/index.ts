import mongoose from "mongoose";

import config from "../../DB/config";

import SMSCollection from "./collections/SMS";
import UsersCollection from "./collections/users";

class DB {
    public readonly config = config;
    public readonly connection: mongoose.Connection;

    public readonly users: UsersCollection;
    public readonly sms: SMSCollection;

    constructor() {
        this.connection = mongoose.createConnection(this.config.db.mongodb, {
            autoCreate: true,
            autoIndex: true,
            dbName: "API"
        });
        this.users = new UsersCollection(this);
        this.sms = new SMSCollection(this);
    }

    public async init(): Promise<void> {
        await this.connection.asPromise();
    }
}

export type { DB };

export default new DB();
