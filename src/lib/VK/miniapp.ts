import { API } from "vk-io";
import utils from "@rus-anonym/utils";

import DB from "../DB";

interface ICacheUser {
    type: "user";
    id: number;
    name: string;
    surname: string;
    photo: string;
}

interface ICacheGroup {
    type: "group";
    id: number;
    name: string;
    photo: string;
}

class Miniapp {
    public readonly api: API;

    private _cachedUsers: Omit<ICacheUser, "type">[] = [];
    private _cachedGroups: Omit<ICacheGroup, "type">[] = [];

    constructor() {
        this.api = new API({
            token: DB.config.vk.miniapp.token,
            apiMode: "parallel",
        });
    }

    private async _loadUsersInfo(user_ids: number[]): Promise<Omit<ICacheUser, "type">[]> {
        const response: Omit<ICacheUser, "type">[] = [];

        for (const chunk of utils.array.splitTo(user_ids, 500)) {
            const users = await this.api.users.get({
                user_ids: chunk,
                fields: ["photo_100"]
            });

            response.push(...users.map((user: {
                id: number;
                first_name: string;
                last_name: string;
                photo_100: string;
            }) => ({
                id: user.id,
                name: user.first_name,
                surname: user.last_name,
                photo: user.photo_100
            })));
        }

        return response;
    }

    public async getUsersInfo(user_ids: number[]): Promise<ICacheUser[]> {
        const cachedUsers = this._cachedUsers.filter((user) => user_ids.includes(user.id));
        const uncachedUsers = user_ids.filter(id => cachedUsers.find(user => user.id === id) === undefined);

        const uncachedUsersInfo = await this._loadUsersInfo(uncachedUsers);
        this._cachedUsers.push(...uncachedUsersInfo);
        return [...cachedUsers, ...uncachedUsersInfo].map((user) => ({
            type: "user",
            ...user
        }));
    }

    private async _loadGroupsInfo(group_ids: number[]): Promise<Omit<ICacheGroup, "type">[]> {
        const response: Omit<ICacheGroup, "type">[] = [];

        for (const chunk of utils.array.splitTo(group_ids, 500)) {
            const groups = await this.api.groups.getById({
                group_ids: chunk.map(Math.abs),
            });

            response.push(...groups.map((group) => ({
                id: group.id as number,
                name: group.name as string,
                photo: group.photo_100 as string
            })));
        }

        return response;
    }

    public async getGroupsInfo(group_ids: number[]): Promise<ICacheGroup[]> {
        group_ids = group_ids.map(Math.abs);
        const cachedGroups = this._cachedGroups.filter((user) => group_ids.includes(user.id));
        const uncachedGroups = group_ids.filter(id => cachedGroups.find(user => user.id === id) === undefined);

        const uncachedGroupsInfo = await this._loadGroupsInfo(uncachedGroups);
        this._cachedGroups.push(...uncachedGroupsInfo);
        return [...cachedGroups, ...uncachedGroupsInfo].map((group) => ({
            type: "group",
            ...group
        }));
    }

    public async getMembersInfo(peer_ids: number[]): Promise<(ICacheUser | ICacheGroup)[]> {
        const userIds = peer_ids.filter((peer_id) => peer_id > 0);
        const groupIds = peer_ids.filter((peer_id) => peer_id < 0);

        const users = await this.getUsersInfo(userIds);
        const groups = await this.getGroupsInfo(groupIds);

        return [...users, ...groups];
    }

    public resetCache(): void {
        this._cachedGroups = [];
        this._cachedUsers = [];
    }
}

export default new Miniapp();
