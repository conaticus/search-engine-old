import express from "express";
import path from "path";
import router from "./routes/router";

require("dotenv").config();

const server = express();
server.use(express.json());

server.use("/api", router);
server.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "/client/index.html"));
});

server.listen(process.env.PORT, () => console.log(`Listening at *:${process.env.PORT}`));
