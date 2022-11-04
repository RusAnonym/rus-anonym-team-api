import { Schema } from "mongoose";

interface IUser {
    id: number;
    telegram?: string;
    github?: string;
}

const user = new Schema({
    id: { type: Schema.Types.Number, required: true },
    telegram: { type: Schema.Types.String, required: false },
    github: { type: Schema.Types.String, required: false },
}, {
    versionKey: false
});

export type { IUser };

export default user;
