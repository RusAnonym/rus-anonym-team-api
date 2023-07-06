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
        group: {
            id: number;
            token: string;
        };
        ownerId: number;
        adminChatId: number;
        admin: {
            id: number;
            token: string;
        };
    };
    smssync: {
        chatId: number;
        secret: string;
    };
    chatgpt: {
        token: string;
    };
}

export default IConfig;
