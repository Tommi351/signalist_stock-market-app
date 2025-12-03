import {Inngest} from "inngest";
import dotenv from "dotenv";
dotenv.config();

const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey) {
  throw new Error('GEMINI_API_KEY environment variable is required but not set');
}

export const inngest = new Inngest({
    id: "signalist",
    ai: { gemini: { apiKey } },
});