import express from "express";
import router from "./routes/router";

require("dotenv").config();

const server = express();
server.use(express.json());

server.use("/api", router);

server.listen(process.env.PORT, () => console.log(`Listening at *:${process.env.PORT}`));
