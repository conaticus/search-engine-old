import { Router } from "express";
import searchRouter from "./search";

const router = Router();

router.use(searchRouter);

export default router;
