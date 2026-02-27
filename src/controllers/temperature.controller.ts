import { Request, Response } from "express";
import { TemperatureRecord } from "../models/temperature.model";
import { promises as fs } from "fs";
import path from "path";

const dataPath = path.join(__dirname, "../../data/temperature.json");

export const generateTemperature = async (
  req: Request,
  res: Response
) => {
  try {
    const temperatureData: TemperatureRecord[] = [];
    const today = new Date();

    const baseTemp = 18;
    const amplitude = 7;

    for (let i = 0; i < 30; i++) {
      const date = new Date();
      date.setDate(today.getDate() - i);

      const seasonalVariation =
        amplitude * Math.sin((2 * Math.PI * i) / 30);

      const noise = Math.random() * 2 - 1;

      const temperature = Math.round(
        baseTemp + seasonalVariation + noise
      );

      const isoDate = date.toISOString().slice(0, 10);

      temperatureData.push({
        id: i + 1,
        dayNumber: i + 1,
        date: isoDate,
        temperature,
      });
    }

    await fs.writeFile(
      dataPath,
      JSON.stringify(temperatureData, null, 2),
      "utf-8"
    );

    res.status(201).json({
      message: "Temperature data generated.",
      count: temperatureData.length,
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to generate data" });
  }
};

export const getTemperatures = async (
  req: Request,
  res: Response
) => {
  try {
    const fileData = await fs.readFile(dataPath, "utf-8");
    const temperatures: TemperatureRecord[] = JSON.parse(fileData);

    res.json(temperatures);
  } catch (error) {
    res.status(500).json({ message: "Failed to read temperature data" });
  }
};

export const getTemperatureStats = async (
  req: Request,
  res: Response
) => {
  try {
    const fileData = await fs.readFile(dataPath, "utf-8");
    const temperatures: TemperatureRecord[] = JSON.parse(fileData);

    if (!temperatures.length) {
      return res.status(404).json({
        message: "No temperature data found",
      });
    }

    const daysQuery = req.query.days;
    let filteredTemperatures = temperatures;

    if (daysQuery) {
      const days = Number(daysQuery);

      if (isNaN(days) || days <= 0) {
        return res.status(400).json({
          message: "Query parameter 'days' must be a positive number",
        });
      }

      filteredTemperatures = temperatures.slice(0, days);
    }

    const totalDays = filteredTemperatures.length;

    const sum = filteredTemperatures.reduce(
      (acc, record) => acc + record.temperature,
      0
    );

    const average = Number((sum / totalDays).toFixed(2));

    const minRecord = filteredTemperatures.reduce((min, current) =>
      current.temperature < min.temperature ? current : min
    );

    const maxRecord = filteredTemperatures.reduce((max, current) =>
      current.temperature > max.temperature ? current : max
    );

    res.json({
      totalDays,
      averageTemperature: average,
      minTemperature: minRecord.temperature,
      minTemperatureDate: minRecord.date,
      maxTemperature: maxRecord.temperature,
      maxTemperatureDate: maxRecord.date,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to calculate statistics",
    });
  }
};