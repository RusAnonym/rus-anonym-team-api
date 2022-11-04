import fs from "node:fs";

import DB from "../DB";

import Fastify from "fastify";

import rateLimit from "@fastify/rate-limit";
import formBody from "@fastify/formbody";
import multiPart from "@fastify/multipart";
import cors from "@fastify/cors";
import helmet from "@fastify/helmet";

import APIError from "./error";

const server = Fastify({
    https: DB.config.server.cert && DB.config.server.key ? {
        key: fs.readFileSync(DB.config.server.key),
        cert: fs.readFileSync(DB.config.server.cert),
    } : null,
});

void server.register(rateLimit, {
    max: 25,
    ban: 3,
});
void server.register(formBody);
void server.register(multiPart);
void server.register(cors, { origin: "*" });
void server.register(helmet);

server.setReplySerializer((payload) => {
    if (Object.prototype.hasOwnProperty.call(payload, "error")) {
        return JSON.stringify(payload);
    } else {
        return JSON.stringify({ response: payload });
    }
});

server.setNotFoundHandler(() => {
    throw new APIError(1);
});

server.setErrorHandler((err, request, reply) => {
    if (err instanceof APIError) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        void reply.status(200).send({ error: err.toJSON() });
    } else {
        if (reply.statusCode === 429) {
            const error = new APIError(2);
            void reply.status(200).send({ error: error.toJSON() });
        } else {
            const error = new APIError(0);
            void reply.status(200).send({ error: error.toJSON() });
        }
    }
});

export default server;
