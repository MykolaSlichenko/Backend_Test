import { Router } from "express";
import {
  generateTemperature,
  getTemperatures,
} from "../controllers/temperature.controller";

const router = Router();

router.post("/generate", generateTemperature);
router.get("/", getTemperatures);

export default router;