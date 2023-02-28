import {
    Command,
    ICommandParams
} from "@rus-anonym/commands-manager";

import { MessageContext } from "vk-io";

type TTextCommandFunction = (ctx: MessageContext) => unknown;

class TextCommand extends Command<TTextCommandFunction> {
    private _trigger: string;

    constructor(params: ICommandParams<TTextCommandFunction> & { trigger: string }) {
        super(params);
        this._trigger = params.trigger;
    }

    public check(value: string): boolean {
        return this._trigger === value;
    }
}

export default TextCommand;
