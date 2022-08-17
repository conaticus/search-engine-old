import { Router } from "express";
import search from "../search";
import { ISearchBody } from "../types";
import error from "../util/error";

const router = Router();

router.post("/search", async (req, res) => {
    const { query }: ISearchBody = req.body;
    if (!query || query.length > 200) {
        return res.status(401).json(error("Invalid query."));
    }

    const results = await search(query);
    res.json(results);
});

export default router;
