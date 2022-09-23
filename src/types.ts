import { Keyword } from "@prisma/client";

export interface ISearchBody {
    query: string;
}

export interface IMeta {
    title?: string;
    description?: string;
    language?: string;
}

export type WordAPIResponse = {
    word: string;
    phonetic: string;
    phonetics: {
        text: string;
        audio?: string;
    }[];
    origin: string;
    meanings: {
        partOfSpeech: string;
        definitions: {
            definition: string;
            example: string;
            synonyms: string[];
            antonyms: string[];
        }[];
    }[];
}[];

export type IKeyword = Omit<Keyword, "id" | "webPage" | "webPageUrl">;
