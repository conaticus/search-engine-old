export enum KeywordPriority {
    LOW,
    MEDIUM,
    HIGH,
}

export interface ISearchBody {
    query: string;
}

export interface IMeta {
    title?: string;
    description?: string;
}

export interface IKeyword {
    priority: KeywordPriority;
    keyword: string;
    occurances: number;
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
