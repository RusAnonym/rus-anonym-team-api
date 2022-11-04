import { IAPIOptions } from "vk-io";

type TVKOptions = Partial<Omit<IAPIOptions, "token">>;

interface IConfig {
    server: {
        port: number;
        key?: string;
        cert?: string;
    };
    vk: {
        miniapp: {
            token: string;
        };
    };
}

export default IConfig;
