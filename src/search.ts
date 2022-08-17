import fs from "fs/promises";
import { parse } from "node-html-parser";
import Parser from "./structures/Parser";
import { KeywordPriority } from "./types";

const SAMPLES_DIR = "./sample-sites";

const search = async (query: string): Promise<any[]> => {
    const files = await fs.readdir(SAMPLES_DIR);

    const matches: any[] = [];

    const map = files.map(async (filename) => {
        const contents = await fs.readFile(`${SAMPLES_DIR}/${filename}`, "utf8");
        const document = parse(contents);

        const parser = new Parser(document);
        const meta = parser.getMeta();
        const keywords = parser.getKeywords();

        let matchScore = 0;

        query
            .split(" ")
            .filter((s) => s.length > 0)
            .forEach((word) => {
                keywords.forEach(({ keyword, priority, occurances }) => {
                    if (keyword.toLowerCase() === word.toLowerCase()) {
                        let score: number = 0;
                        switch (priority) {
                            case KeywordPriority.LOW:
                                score = 5;
                                break;
                            case KeywordPriority.MEDIUM:
                                score = 15;
                                break;
                            case KeywordPriority.HIGH:
                                score = 25;
                                break;
                        }

                        matchScore += score + occurances;
                    }
                });
            });

        if (matchScore > 2) {
            if (matchScore > 100) matchScore = 100;
            matches.push({ meta, score: `${matchScore}/100` });
        }
    });

    await Promise.all(map);
    return matches;
};

export default search;
