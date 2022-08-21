import { getPlurals } from "./cache";

export const removeEnding = async (word: string): Promise<string> => {
    const plurals = await getPlurals();
    const plural = plurals[word];

    if (plural) return plural.pluralFor;
    else return word;
};