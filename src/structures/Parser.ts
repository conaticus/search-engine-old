import { HTMLElement } from "node-html-parser";
import { IKeyword, IMeta, KeywordPriority } from "../types";
import { WORD_EXCEPTIONS } from "../util/consts";
import { nounify } from "../util/strings";

/** Searches for keywords in a HTML document */
export default class Parser {
    meta?: IMeta;

    constructor(public document: HTMLElement) {}

    public getMeta(): IMeta {
        this.meta = { title: this.getTitle(), description: this.getDescription() };
        return this.meta;
    }

    public async getKeywords(): Promise<IKeyword[]> {
        const keywords: IKeyword[] = [];

        if (!this.meta) this.getMeta();

        let extractedWords: string[] = [];
        console.log(this.document.firstChild);

        for (const node of this.document.childNodes) {
            if (!node.innerText) continue;

            const words = this.extractWords(node.innerText);
            extractedWords = [...extractedWords, ...words];
        }

        extractedWords = [...extractedWords, ...this.extractWords(this.meta?.title), ...this.extractWords(this.meta?.description)];

        const wordOccurances: { [key: string]: number } = {};

        const map = extractedWords.map(async (word) => {
            if (WORD_EXCEPTIONS.includes(word)) return;
            word = await nounify(word);

            if (wordOccurances[word]) {
                wordOccurances[word]++;
            } else {
                wordOccurances[word] = 1;
            }
        });

        await Promise.all(map);

        for (const word in wordOccurances) {
            let occurances = wordOccurances[word];
            if (occurances > 1) {
                let priority: KeywordPriority = KeywordPriority.LOW;
                if (this.meta?.title?.toLowerCase().includes(word)) {
                    priority = KeywordPriority.HIGH;
                    occurances++;
                }

                if (this.meta?.description?.toLowerCase().includes(word)) {
                    priority = KeywordPriority.HIGH;
                    occurances++;
                }

                keywords.push({
                    keyword: word,
                    priority,
                    occurances,
                });
            }
        }

        return keywords;
    }

    private extractWords(str: string = ""): string[] {
        str = str.toLowerCase().trim();
        str = str.replace(/[.,\/'#!$%^&*;:{}=-_`~()]/gm, ""); // ignore grammar (e.g "hi!" will be read as "hi")
        str = str.replace(/(\r\n|\n|\r|\t)/gm, ""); // ignore newlines
        return str.split(" ").filter((str) => str.length > 0);
    }

    private getTitle(): string | undefined {
        const title: HTMLElement = this.document.getElementsByTagName("title")[0];
        return title?.innerText || undefined;
    }

    private getDescription(): string | undefined {
        const metas = this.document.getElementsByTagName("meta");
        for (let i = 0; i < metas.length; i++) {
            const meta = metas[i];
            if (meta.attributes.name === "description") {
                return meta.attributes.content;
            }
        }

        return;
    }
}
