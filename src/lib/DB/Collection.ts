import { DB } from ".";
import mongoose from "mongoose";

abstract class DBCollection<Doc> {
    protected readonly _db: DB;
    protected abstract readonly model: mongoose.Model<Doc>;

    constructor(db: DB) {
        this._db = db;
    }
}

export default DBCollection;
