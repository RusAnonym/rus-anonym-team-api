import { Model } from "mongoose";
import { DB } from "../..";
import DBCollection from "../../Collection";
import userSchema, { IUser } from "./schema";

class UsersCollection extends DBCollection<IUser> {
    protected model: Model<IUser>;
    constructor(db: DB) {
        super(db);
        this.model = db.connection.model("users", userSchema);
    }

    public async get(): Promise<IUser[]> {
        return this.model.find().lean();
    }
}

export default UsersCollection;
