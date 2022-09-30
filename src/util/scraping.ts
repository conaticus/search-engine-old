import Parser from "../structures/Parser";
import db from "./db";
import axios from "axios";
import parse from "node-html-parser";
import fsSync from "fs";
import * as URL from "url";

const getPage = async (url: string): Promise<Parser | undefined> => {
    const response = await axios.get(url);
    if (response.headers["content-type"].split(";")[0] !== "text/html") return;

    let manifest;
    try {
        const manifestRes = await axios.get(`${url}manifest.json`);
        manifest = manifestRes.data;
    } catch {}

    return new Parser(parse(response.data), manifest);
};

const indexPage = async (url: string, rank: number): Promise<void> => {
    const parser = await getPage(url);
    if (!parser) return;

    const { title, description, language } = parser.getMeta();
    const keywords = await parser.getKeywords();

    console.log("ADDING:", url);

    if (!title || keywords.length === 0) return;
    await db.webPage.create({
        data: {
            url: url.toString(),
            title,
            description,
            language,
            keywords: {
                createMany: {
                    data: keywords,
                },
            },
            rank,
        },
    });
};

const CHUNK_SIZE = 500;

const scrape = async () => {
    const stream = fsSync.createReadStream("top-1m.txt");
    let i = 0;

    stream.on("line", async (line: string) => {
        if (line.length === 0) return;
        const url = new URL.URL(`https://${line}`).toString();

        try {
            await indexPage(url, i);
        } catch (err: any) {
            console.log("FAILED TO ADD:", url);
        } finally {
            stream.read(CHUNK_SIZE);
            i += 1;
        }
    });

    stream.on("data", (chunk) => {
        const urls = chunk.toString().split("\n");
        urls.forEach((url) => stream.emit("line", url));
    });

    stream.read(CHUNK_SIZE);
};

export default scrape;
