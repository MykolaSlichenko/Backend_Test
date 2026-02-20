import { Request, Response } from "express";
import { TemperatureRecord } from "../models/temperature.model";

let temperatureData: TemperatureRecord[] = [];

// Generate 30 days of temperature
export const generateTemperature = (req: Request, res: Response) => {
    temperatureData = [];

    const today = new Date();

    for (let i = 0; i < 30; i++) {
        const date = new Date();
        date.setDate(today.getDate() - i);

        const randomTemp = Math.floor(Math.random() * 15) + 10;

        const isoDate = date.toISOString().slice(0, 10);

        temperatureData.push({
            date: isoDate,
            temperature: randomTemp,
        });
    }

    res.status(201).json(temperatureData);
};

// Get stored temperatures
export const getTemperatures = (req: Request, res: Response) => {
    res.json(temperatureData);
};