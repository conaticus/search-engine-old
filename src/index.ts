import axios from "axios";
import express from "express";
import parse from "node-html-parser";
import path from "path";
import router from "./routes/router";
import Parser from "./structures/Parser";
import { getTestSites, getTopOneMill } from "./util/cache";
import db from "./util/db";
import fs from "fs";

require("dotenv").config();

const server = express();
server.use(express.json());

server.use("/api", router);
server.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "/client/index.html"));
});

let scannedSites: { [key: string]: boolean | undefined } = {};

const initialise = async () => {
    await getTopOneMill();
    await getTestSites();
    server.listen(process.env.PORT, () => console.log(`Listening at *:${process.env.PORT}`));
};

const indexPage = async (url: string, parser: Parser, topOneMill: string[]): Promise<void> => {
    const { title, description, language } = parser.getMeta();
    const keywords = await parser.getKeywords();
    const urls = parser.getUrls().filter((u) => !scannedSites[u]);

    for (let i = 0; i < urls.length; i++) {
        const url = urls[i];

        try {
            const response = await axios.get(url);
            scannedSites[url] = true;
            if (response.headers["content-type"].split(";")[0] !== "text/html") continue;

            const parser = new Parser(parse(response.data) as any);
            await indexPage(url, parser, topOneMill);
        } catch (e) {
            console.log(`FAILED TO ADD: ${url}`);
        }
    }

    if (!title || keywords.length === 0) return;
    console.log("ADDING:", url);
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
        },
    });
};

const scrape = async () => {
    setInterval(() => {
        fs.writeFileSync("./scanned-sites.txt", JSON.stringify(scannedSites));
    }, 30000);

    const topOneMill = await getTopOneMill();
    for (let i = 0; i < topOneMill.length; i++) {
        const site = "https://" + topOneMill[i];
        scannedSites[site] = true;

        const response = await axios.get(site);
        if (response.headers["content-type"].split(";")[0] !== "text/html") continue;

        let manifest;

        try {
            const manifestRes = await axios.get(`${site}/manifest.json`);
            manifest = manifestRes.data;
        } catch {}

        const parser = new Parser(parse(response.data) as any, manifest);
        try {
            await indexPage(site, parser, topOneMill);
        } catch {
            console.log("FAILED TO ADD:", site);
        }
    }
};

scrape();
initialise();
