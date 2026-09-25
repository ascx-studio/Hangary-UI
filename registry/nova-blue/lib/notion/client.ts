import { Client } from "@notionhq/client";

const token = process.env.NOTION_SECRET || process.env.NOTION_API_KEY;

export const Notionclient = new Client({ auth: token });
