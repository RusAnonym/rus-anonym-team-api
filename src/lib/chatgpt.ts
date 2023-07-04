import { Configuration, OpenAIApi } from "openai";
import DB from "./DB";

const chatgpt = new OpenAIApi(new Configuration({
    apiKey: DB.config.chatgpt.token,
}));

export default chatgpt;
