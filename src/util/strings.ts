<<<<<<< HEAD
import { getPlurals } from "./cache";
=======
import axios from "axios";
import { WordAPIResponse } from "../types";
import db from "./db";
>>>>>>> 9a2f73a027aecc1c0bbfaf907dcc0b5ba6368ccf

export const removeEnding = async (word: string): Promise<string> => {
    word = word.toLowerCase();

<<<<<<< HEAD
    const plurals = await getPlurals();
    const plural = plurals[word];
=======
    try {
        // TODO: cache with redis
        const wordData = await db.word.findFirst({
            where: {
                word,
            },
        });

        let isNoun = wordData?.isNoun;

        if (!wordData) {
            const { data }: { data: WordAPIResponse } = await axios.get(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`);
            const [result] = data;

            isNoun = result.meanings[0].partOfSpeech === "noun";
            await db.word.create({
                data: {
                    word,
                    isNoun,
                },
            });
        }

        if (isNoun) {
            if (word.endsWith("ves")) {
                word = word.slice(0, -3);
                word += "f"; // this is flawed because it could be "fe"
            } else if (word.endsWith("es")) {
                word = word.slice(0, -2);
            } else if (word.endsWith("s")) {
                word = word.slice(0, -1);
            }
        }
>>>>>>> 9a2f73a027aecc1c0bbfaf907dcc0b5ba6368ccf

    if (plural) return plural.pluralFor;
    else return word;

    // try {
    //     const { data }: { data: WordAPIResponse } = await axios.get(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`);
    //     const [result] = data;
    //     if (result.meanings[0].partOfSpeech === "noun") {
    //         if (word.endsWith("ves")) {
    //             word = word.slice(0, -3);
    //             word += "f"; // this is flawed because it could be "fe"
    //         } else if (word.endsWith("es")) {
    //             word = word.slice(0, -2);
    //         } else if (word.endsWith("s")) {
    //             word = word.slice(0, -1);
    //         }
    //     }

    //     return word;
    // } catch {
    //     return word;
    // }
};
