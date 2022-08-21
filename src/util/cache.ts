import fs from "fs/promises";

interface IPlurals {
    [key: string]: {
        pluralFor: string;
    };
}

let plurals: IPlurals;

export const getPlurals = async (): Promise<IPlurals> => {
    if (!plurals) {
        const pluralsRaw = await fs.readFile("plurals.json", "utf8");
        plurals = JSON.parse(pluralsRaw);
    }

    return plurals;
};
