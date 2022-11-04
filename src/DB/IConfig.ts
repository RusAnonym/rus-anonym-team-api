interface IConfig {
    db: {
        protocol: string;
        address: string;
        login: string;
        password: string;
    };
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
