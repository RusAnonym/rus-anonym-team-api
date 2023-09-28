import { Model } from "mongoose";
import { DB } from "../..";
import DBCollection from "../../Collection";
import schema, { TSmsBox } from "./schema";

class SMSCollection extends DBCollection<TSmsBox> {
    protected model: Model<TSmsBox>;
    constructor(db: DB) {
        super(db);
        this.model = db.connection.model("users", schema);
    }
}

export default SMSCollection;
