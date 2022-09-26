import { getPlurals } from "./cache";
import { createReadStream } from "fs";
import readline from "readline";
import db from "./db";

/**
 * Converts to a single noun if `word` is plural \
 * E.G: `"cities"` -> `"city"`
 */
export const nounify = async (word: string): Promise<string> => {
    const match = await db.plural.findFirst({ where: { plural: word } });
    return match?.pluralFor || word;
};
