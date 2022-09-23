import { KeywordPriority } from "@prisma/client";
import Parser from "../structures/Parser";
import { getTestSites } from "./cache";
import db from "./db";
import { nounify } from "./strings";

/**
 * Uses commonly used words to index
 */
const search = async (query: string): Promise<any[]> => {
    const words = query.split(" ");
    const wordMap = words.map(async (word, idx) => {
        words[idx] = await nounify(word);
    });

    await Promise.all(wordMap);

    const matches: any[] = [];

    words.forEach(async (word) => {
        const keywords = await db.keyword.findMany({
            where: {
                keyword: word,
                priority: KeywordPriority.HIGH,
            },
        });

        keywords.forEach(async (kw) => {
            const site = await db.webPage.findFirst({
                where: {
                    url: kw.webPageUrl,
                },
            });

            const siteMatch = {
                meta: {
                    title: site?.title,
                    description: site?.description,
                    score: 0,
                },
            };

            matches.push(siteMatch);
        });
    });

    // const sites = await getTestSites();
    // const siteMap = sites.map(async ({ document, manifest }) => {
    //     const parser = new Parser(document as any, manifest);

    //     const meta = parser.getMeta();
    //     const keywords = await parser.getKeywords();

    //     let matchScore = 0;

    //     words
    //         .filter((s) => s.length > 0)
    //         .forEach((word) => {
    //             keywords.forEach(({ keyword, priority, occurances }) => {
    //                 if (keyword.toLowerCase() === word.toLowerCase()) {
    //                     let score: number = 0;
    //                     switch (priority) {
    //                         case KeywordPriority.LOW:
    //                             score = 5;
    //                             break;
    //                         case KeywordPriority.MEDIUM:
    //                             score = 15;
    //                             break;
    //                         case KeywordPriority.HIGH:
    //                             score = 25;
    //                             break;
    //                     }

    //                     matchScore += score + occurances;
    //                 }
    //             });
    //         });

    //     if (matchScore > 2) {
    //         if (matchScore > 100) matchScore = 100;
    //         matches.push({ meta, score: `${matchScore}/100` });
    //     }
    // });

    // await Promise.all(siteMap);
    return matches;
};

export default search;
