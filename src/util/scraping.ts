import Parser from "../structures/Parser";
import db from "./db";
import axios from "axios";
import parse from "node-html-parser";
import fsSync from "fs";
const fakeUserAgent = require("fake-useragent");

const getPage = async (url: string): Promise<Parser | undefined> => {
    const response = await axios.get(url, { headers: { "User-Agent": fakeUserAgent() } });
    if (response.headers["content-type"].split(";")[0] !== "text/html") return;

    let manifest;
    try {
        const manifestRes = await axios.get(`${url}/manifest.json`, { headers: { "User-Agent": fakeUserAgent() } });
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
            url,
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

let iteration = 1;

const CHUNK_SIZE = 500;

const scrape = async () => {
    if (iteration * CHUNK_SIZE >= 12316 * 1000) return;
    console.log("start:", iteration * CHUNK_SIZE - CHUNK_SIZE + 1);
    console.log("end:", iteration * CHUNK_SIZE);

    const stream = fsSync.createReadStream("top-1m.txt", {
        start: iteration * CHUNK_SIZE - CHUNK_SIZE,
        end: iteration * CHUNK_SIZE,
    });

    await new Promise<void>((resolve) => {
        let fullString = "";

        stream.on("data", (chunk) => {
            fullString += chunk;
        });

        stream.on("end", async () => {
            const lines = fullString.split("\n");
            lines.pop();
            const downloadMap = lines.map(async (line, idx) => {
                line.trim();
                const url = `https://${line}`;

                try {
                    await indexPage(url, idx + 1);
                } catch (err: any) {
                    console.log("FAILED TO ADD:", url);
                }
            });

            await Promise.all(downloadMap);
            resolve();
        });
    });

    iteration++;
    scrape();
};

export default scrape;
