import { Static, Type } from "@sinclair/typebox";
import { Schema } from "mongoose";

const smsBox = Type.Object({
    uuid: Type.String(),
    to: Type.String(),
    message: Type.String(),
    sentCode: Type.Union([Type.Number(), Type.Null()])
});

type TSmsBox = Static<typeof smsBox>;

const sms = new Schema<TSmsBox>(
    {
        message: {
            type: Schema.Types.String,
            required: true
        },
        to: {
            type: Schema.Types.String,
            required: true
        },
        uuid: {
            type: Schema.Types.String,
            required: true,
            unique: true
        },
        sentCode: {
            type: Schema.Types.String,
            required: false,
            default: null
        }
    },
    {
        versionKey: false
    }
);

export type { TSmsBox };

export default sms;
