import express, { Request, Response } from "express";
import temperatureRoutes from "./routes/temperature.routes";

const app = express();
const PORT = 3000;

app.use(express.json());

// Root route
app.get("/", (req: Request, res: Response) => {
  res.json({
    message: "Temperature API is running",
    endpoints: {
      generate: "POST /temperature/generate",
      getAll: "GET /temperature",
    },
  });
});

// Temperature routes
app.use("/temperature", temperatureRoutes);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});