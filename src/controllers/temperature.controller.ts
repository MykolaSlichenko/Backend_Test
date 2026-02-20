import { Request, Response } from "express";
import { TemperatureRecord } from "../models/temperature.model";
import fs from "fs";
import path from "path";

const dataPath = path.join(__dirname, "../../data/temperature.json");

// Generate 30 days and save to file
export const generateTemperature = (req: Request, res: Response) => {
    const temperatureData: TemperatureRecord[] = [];
    const today = new Date();

    for (let i = 0; i < 30; i++) {
        const date = new Date();
        date.setDate(today.getDate() - i);
        
        const randomTemp = Math.floor(Math.random() * 45) + (-40);

        const isoDate = date.toISOString().slice(0, 10);

        temperatureData.push({
            id: i + 1,          // Unique ID
            dayNumber: i + 1,   // Day number (1 = most recent)
            date: isoDate,      // Date string
            temperature: randomTemp,
        });
    }

    // Save to file
    fs.writeFileSync(dataPath, JSON.stringify(temperatureData, null, 2));

    res.status(201).json({
        message: "Temperature data generated and saved to file successfully.",
        count: temperatureData.length,
    });
};

// Read from file
export const getTemperatures = (req: Request, res: Response) => {
    try {
        const fileData = fs.readFileSync(dataPath, "utf-8");
        const temperatures: TemperatureRecord[] = JSON.parse(fileData);

        res.json(temperatures);
    } catch (error) {
        res.status(500).json({ message: "Error reading temperature file" });
    }
};