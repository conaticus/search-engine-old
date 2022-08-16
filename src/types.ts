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
}
