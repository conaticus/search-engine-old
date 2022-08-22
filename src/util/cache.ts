import axios from "axios";
import fs from "fs/promises";
import parse from "node-html-parser";
import { SAMPLE_SITES } from "./consts";

interface IPlurals {
    [key: string]: {
        pluralFor: string;
    };
}

let plurals: IPlurals;
let sampleSites: HTMLElement[];

export const getPlurals = async (): Promise<IPlurals> => {
    if (!plurals) {
        const pluralsRaw = await fs.readFile("plurals.json", "utf8");
        plurals = JSON.parse(pluralsRaw);
    }

    return plurals;
};

export const getSites = async (): Promise<HTMLElement[]> => {
    if (sampleSites) {
        return sampleSites;
    }

    const siteMap = SAMPLE_SITES.map(async (site) => {
        const response = await axios.get(site);
        return parse(response.data);
    }) as Promise<any>[];

    sampleSites = await Promise.all(siteMap);
    return sampleSites;
};
