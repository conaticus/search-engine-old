import { HTMLElement } from "node-html-parser";
import { IKeyword, IMeta, KeywordPriority } from "../types";

export default class Parser {
    meta?: IMeta;

    constructor(public document: HTMLElement) {}

    public getMeta(): IMeta {
        this.meta = { title: this.getTitle(), description: this.getDescription() };
        return this.meta;
    }

    // TODO: meta, traverse elements instead of getting base components
    // TODO: ignore word endings (ed, ey, s, etc.)
    public getKeywords(): IKeyword[] {
        const keywords: IKeyword[] = [];

        if (!this.meta) this.getMeta();

        let extractedWords: string[] = [];

        const body = this.document.getElementsByTagName("body")[0];

        body.childNodes.forEach((childNode) => {
            if (!childNode.innerText) return;
            let words = this.extractWords(childNode.innerText);

            extractedWords = [...extractedWords, ...words];
        });

        extractedWords = [...extractedWords, ...this.extractWords(this.meta?.title), ...this.extractWords(this.meta?.description)];

        const wordOccurances: { [key: string]: number } = {};

        extractedWords.forEach((word) => {
            if (wordOccurances[word]) {
                wordOccurances[word]++;
            } else {
                wordOccurances[word] = 1;
            }
        });

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
        const title = this.document.getElementsByTagName("title")[0];
        return title.innerText || undefined;
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
