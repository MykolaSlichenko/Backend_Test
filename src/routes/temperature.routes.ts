import { Router } from "express";
import {
  generateTemperature,
  getTemperatures,
  getTemperatureStats,
} from "../controllers/temperature.controller";

const router = Router();

router.post("/generate", generateTemperature);
router.get("/", getTemperatures);
router.get("/stats", getTemperatureStats);

export default router;