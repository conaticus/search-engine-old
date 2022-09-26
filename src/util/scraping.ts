import Parser from "../structures/Parser";
import { getTopOneMill } from "./cache";
import fs from "fs";
import db from "./db";
import axios from "axios";
import parse from "node-html-parser";

let scannedSites: { [key: string]: boolean | undefined } = {};

const getPage = async (url: string): Promise<Parser | undefined> => {
    if (scannedSites[url]) return;
    scannedSites[url] = true;

    const response = await axios.get(url);
    if (response.headers["content-type"].split(";")[0] !== "text/html") return;

    let manifest;
    try {
        const manifestRes = await axios.get(`${url}/manifest.json`);
        manifest = manifestRes.data;
    } catch {}

    return new Parser(parse(response.data), manifest);
};

const indexPage = async (url: string, rank: number): Promise<void> => {
    const parser = await getPage(url);
    if (!parser) return;

    const { title, description, language } = parser.getMeta();
    const keywords = await parser.getKeywords();

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

const scrape = async () => {
    setInterval(() => {
        fs.writeFileSync("./scanned-sites.json", JSON.stringify(scannedSites));
    }, 30000);

    const topOneMill = await getTopOneMill();
    for (let i = 0; i < topOneMill.length; i++) {
        const url = "https" + topOneMill[i];

        try {
            console.log("ADDING:", url);
            await indexPage(url, i + 1);
        } catch (error) {
            console.error("FAILED TO ADD:", url);
        }
    }
};

export default scrape;
