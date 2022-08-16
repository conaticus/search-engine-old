import { Router } from "express";
import { ISearchBody } from "../types";
import error from "../util/error";

const router = Router();

router.post("/search", (req, res) => {
    const { query }: ISearchBody = req.body;
    if (!query || query.length > 200) {
        return res.status(401).json(error("Invalid query."));
    }
});
