import express from "express";
import path from "path";
import router from "./routes/router";
import { getTestSites, getTopOneMill } from "./util/cache";
import scrape from "./util/scraping";

require("dotenv").config();

const server = express();
server.use(express.json());

server.use("/api", router);
server.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "/client/index.html"));
});

const initialise = async () => {
    await getTopOneMill();
    await getTestSites();
    server.listen(process.env.PORT, () => console.log(`Listening at *:${process.env.PORT}`));
};

scrape();
initialise();
