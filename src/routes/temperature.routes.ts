import { Router } from "express";
import {
  generateTemperature,
  getTemperatures,
  getTemperatureStats,
} from "../controllers/temperature.controller";
import { asyncHandler } from "../utils/asyncHandler";

const router = Router();

router.post("/generate", asyncHandler(generateTemperature));
router.get("/", asyncHandler(getTemperatures));
router.get("/stats", asyncHandler(getTemperatureStats));

export default router;