import Parser from "../structures/Parser";
import { KeywordPriority } from "../types";
import { getSites } from "./cache";
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

    const sites = await getSites();
    const siteMap = sites.map(async ({ document, manifest }) => {
        const parser = new Parser(document as any, manifest);

        const meta = parser.getMeta();
        const keywords = await parser.getKeywords();

        let matchScore = 0;

        words
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

    await Promise.all(siteMap);
    return matches;
};

export default search;
