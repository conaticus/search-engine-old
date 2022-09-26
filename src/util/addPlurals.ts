import { createReadStream } from "fs";
import readline from "readline";
import db from "./db";

const addPluralsToDb = async () => {
    const rl = readline.createInterface({
        input: createReadStream("./plurals.json"),
    });

    rl.on("line", async (line) => {
        const json = JSON.parse(`{${line}}`);
        const plural = Object.keys(json)[0];
        if (!plural) return;
        const pluralFor = json[plural].pluralFor;

        const tryAdd = async () => {
            try {
                await db.plural.create({
                    data: {
                        plural,
                        pluralFor,
                    },
                });
            } catch {
                console.log("Failure.. retrying in 12 seconds.");
                setTimeout(() => {
                    tryAdd();
                }, 12 * 1000);
            }
        };

        await tryAdd();
    });
};

export default addPluralsToDb;
