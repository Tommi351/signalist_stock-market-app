import {Inngest} from "inngest";
import dotenv from "dotenv";
dotenv.config();

export const inngest = new Inngest({
    id: "signalist",
    ai: { gemini: { apikey: process.env.GEMINI_API_KEY! } },
});