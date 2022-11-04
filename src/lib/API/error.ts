const ERRORS = {
    0: "Internal server error",
    1: "Method not found",
    2: "Rate limit exceeded",
} as const;

type TAPIErrorCode = keyof typeof ERRORS;

interface IAdditionalErrorParams {
	code?: never;
	message?: never;
	request_params?: never;
	[prop: string]: unknown;
}

class APIError<
	Code extends TAPIErrorCode,
	Message extends typeof ERRORS[Code] | string = typeof ERRORS[Code],
	Additional extends IAdditionalErrorParams = IAdditionalErrorParams,
> {
    public readonly code: Code;
    public readonly message: Message;
    public readonly additional: Additional;

    constructor(options: {
		code: Code;
		additional?: Additional;
		message?: Message;
	} | Code) {
        if (typeof options === "number") {
            this.code = options;
            this.message = ERRORS[options] as unknown as Message;
            this.additional = {} as Additional;
            return this;
        }

        const {
            code,
            additional = {} as Additional,
            message = ERRORS[code] as unknown as Message,
        } = options;

        this.code = code;
        this.message = message;
        this.additional = additional;
    }

    public toJSON(): {
		code: Code;
		message: Message;
	} & Additional {
        return {
            code: this.code,
            message: this.message,
            ...this.additional,
        };
    }
}

export { ERRORS };

export default APIError;
