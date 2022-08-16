// import express from "express";
// import router from "./routes/router";

// require("dotenv").config();

// const server = express();
// server.use(express.json());

// server.use("/api", router);

// server.listen(process.env.PORT, () => console.log(`Listening at *:${process.env.PORT}`));

import fs from "fs/promises";
import { parse } from "node-html-parser";
import Parser from "./structures/Parser";

const SAMPLES_DIR = "./sample-sites";

const search = async (query: string) => {
    const files = await fs.readdir(SAMPLES_DIR);

    const htmlFiles: string[] = [];

    files.forEach(async (filename) => {
        const contents = await fs.readFile(`${SAMPLES_DIR}/${filename}`, "utf8");
        const document = parse(contents);

        const parser = new Parser(document);
        const meta = parser.getMeta();
        const keywords = parser.getKeywords();
        console.log(keywords);
    });
};

search("cows");
