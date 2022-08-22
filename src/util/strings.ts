import { getPlurals } from "./cache";

/**
 * Converts to a single noun if `word` is plural \
 * E.G: `"cities"` -> `"city"`
 */
export const nounify = async (word: string): Promise<string> => {
    const plurals = await getPlurals();
    const plural = plurals[word];

    if (plural) return plural.pluralFor;
    else return word;
};
