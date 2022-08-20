import axios from "axios";
import { WordAPIResponse } from "../types";

export const removeEnding = async (word: string): Promise<string> => {
    word = word.toLowerCase();

    try {
        const { data }: { data: WordAPIResponse } = await axios.get(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`);
        const [result] = data;
        if (result.meanings[0].partOfSpeech === "noun") {
            if (word.endsWith("ves")) {
                word = word.slice(0, -3);
                word += "f"; // this is flawed because it could be "fe"
            } else if (word.endsWith("es")) {
                word = word.slice(0, -2);
            } else if (word.endsWith("s")) {
                word = word.slice(0, -1);
            }
        }

        return word;
    } catch {
        return word;
    }
};
